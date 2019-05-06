import React, {Component} from 'react';
import jwtDecode from 'jwt-decode';
import './chatBody.css';
import './chatInput.css';

class Chat extends Component {
    constructor(props){
        super(props);
        this.state = {
            gif: [],
            sendMessage: true,
            text: '',
            messages: null,
            result: {
                errorMessage: false,
                auth: null,
            }

        };
        this.props.socket.on('receiveMess', (data) => {
            this.setState({
                messages:[...this.state.messages, data],
                sendMessage: true
            });
            this.scrollBtn('chat');


            const payload = this.payloadJWT(window.localStorage.Authorization);
            if(data.login !== payload.login){
                this.sound();
            }

        });
    }
    sound = () =>{
        let audio = new Audio();
        audio.src = '/audio/blinc.mp3';
        audio.autoplay = true;
    };

    onChange = (e) =>{
        let value = e.target.value;
        this.setState({text: value});
    };

    handleSubmit=(e)=>{
        if(this.state.text) {
            const payload = this.payloadJWT(window.localStorage.Authorization);
            const srcImg = window.localStorage.CharacterUrl;
            const data = {
                text: this.state.text,
                login: payload.login,
                urlImg: srcImg
            };

            this.props.socket.emit('sendMess', data);
            this.setState({
                text: '',
                sendMessage: false
            });
        }
    };

    choiceGif = (e) =>{
        console.log(e.target.src);

        const payload = this.payloadJWT(window.localStorage.Authorization);
        const srcImg = window.localStorage.CharacterUrl;
        const data = {
            gif: e.target.src,
            login: payload.login,
            urlImg: srcImg
        };

        this.props.socket.emit('sendMess', data);
        this.setState({
            gif: []
        });
    };


    payloadJWT = (JWT) =>{
        if(JWT){
            try{
                return jwtDecode(JWT)
            }catch (e){
                localStorage.setItem('Authorization', '');
                localStorage.setItem('CharacterUrl', '');
                localStorage.setItem('CharacterTitle', '');
                window.location.reload();
            }
        }
    };

    componentDidMount(){
        setTimeout(()=>{
            fetch('/takemessage',
                {
                    method: 'GET',
                    headers: {
                        'Authorization': window.localStorage.Authorization,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                .then(res => res.json())
                .then(value => {
                    if(!value.auth){
                        localStorage.setItem('Authorization', '');
                        localStorage.setItem('CharacterUrl', '');
                        localStorage.setItem('CharacterTitle', '');
                        window.location.reload();
                        return;
                    }
                    this.setState({
                        messages: value.takeMessage,
                        result:{
                            auth: value.auth,
                            errorMessage: false
                        }
                    });
                    this.scrollBtn('chat');
                })
                .catch(error=>{
                    this.setState({
                        result:{
                            auth: false,
                            errorMessage: true
                        }
                    })
                })
        },500)
    }

    scrollBtn = (v)=>{
        const value = document.getElementById(v);
        value.scrollTop = 99999;
    };

    takeGifs = () =>{
        if(this.state.gif.length !== 0){
            this.setState({
                gif: [],
            })
        }else{
            fetch('/takegifs',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': window.localStorage.Authorization,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({group: window.localStorage.CharacterTitle})
                })
                .then(res => res.json())
                .then(value => {
                    /*if(!value.auth){
                        localStorage.setItem('Authorization', '');
                        localStorage.setItem('CharacterUrl', '');
                        localStorage.setItem('CharacterTitle', '');
                        window.location.reload();
                        return;
                    }*/
                    console.log(value);
                    this.setState({
                        gif: value,
                    })
                })
                .catch(error=>{
                    this.setState({
                        result:{
                            auth: false,
                            errorMessage: true
                        }
                    })
                })
        }

    };


    render() {
        const {gif} = this.state;
        const {errorMessage} = this.state.result;
        const payload = this.payloadJWT(window.localStorage.Authorization);
        const localStorage = window.localStorage;

        const load = (<div className="d-flex justify-content-center">
            <div className="spinner-border text-warning" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>);
        const sendButton = (
            <span className='buttonInput'>
                            <i
                                onClick={this.handleSubmit}
                                className={this.state.text?'textBtn':'textBtnFalse'}
                            >
                                >
                            </i>
                        </span>
        );

        const textArea = (
            <textarea
                className='inputTextarea'
                name="" id=""
                cols="30"
                rows="2"
                value={this.state.text}
                onChange={this.onChange}
            />
        );

        let gifList =(
                    <div className='gif'>

                        {gif.map((item, i)=>{
                            return <img className='gifImg' onClick={this.choiceGif} key={i} src={item.src} alt={item.title}/>

                        })}
                    </div>
        );



        if(!this.state.messages && !errorMessage) return load;

        if(errorMessage) return(
            <div className="alert alert-danger">
                <h4 className="alert-heading">Error, contact your administrator</h4>
                <img src="/images/homerBroke.png" alt="" style={{height: '200px'}}/>
            </div>
        );

        return(
            <div>
                <div className="chat" id='chat'>

                        {this.state.messages.map((item, i)=>{
                            return(

                                <div key={i} className='message'>
                                    <div className={payload.login===item.login?'personMessageMe':'personMessage'}>
                                        <img className='icoMessage' src={item.urlImg} alt='alt'/>
                                        <p className='namePerson'>{payload.login===item.login?'You':item.login}</p>
                                    </div>

                                    <div className={payload.login===item.login?'bodyMessageMe':'bodyMessage'}>
                                        <span className={payload.login===item.login?'textMessageMe':'textMessage'}>
                                            {item.text?item.text:<img src={item.gif} alt='gif' style={{height:'200px'}}/>}
                                        </span>
                                        <br/>
                                        <i className={payload.login===item.login?'timeMessageMe':'timeMessage'}>
                                            {item.date}
                                        </i>
                                    </div>
                                </div>
                            )
                        })}
                </div>
                <form onSubmit={this.handleSubmit} className='formSend'>
                    <div className='formCont'>

                        <span className='btnGif' onClick={this.takeGifs}>
                            <img className='inputImg' src={localStorage.CharacterUrl} alt={localStorage.CharacterTitle}/>
                            GIF
                        </span>

                        {(this.state.gif.length !== 0)?gifList:textArea}

                        {this.state.sendMessage?sendButton:load}
                    </div>
                </form>
            </div>
        )
    }
}

export default Chat;
