import React, {Component} from 'react';
import NavBar from './Components/Header/NavBar';
import {Route} from 'react-router-dom';


import Chat from './Components/Body/Chat';
import NotRegister from './Components/Body/NotRegister';
import Login from './Components/Body/Login';
import Registration from './Components/Body/Registration';
import About from './Components/Body/About';
import io from "socket.io-client";


class App extends Component {
    constructor(props){
        super(props);
        this.state ={
            auth: false,
            check: false,
            statusAuth: false,
        };

        this.socket = io('http://localhost:5000');
    }

    componentDidMount(){
        this.checkAuth()
    }

    stateAuth = () =>{
        this.setState({
            auth: true
        });
    };

    checkAuth = () =>{
        setTimeout(()=>{
            fetch('/check',
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
                    this.setState({
                        auth: value.auth,
                        check: value.check
                    })
                })
                .catch(error=>{
                    this.setState({
                        messageDanger: true
                    })
                })
        },500)
    };


    render() {
        const {auth, check} = this.state;

        if(!check){return(
            <div className="d-flex justify-content-center">
                <div className="spinner-border text-warning" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )}
        return(
            <div className='container' style={{textAlign:'center'}}>
                <NavBar status={auth} checkAuth={this.checkAuth} socket={this.socket}/>
                <Route exact path='/' component={(auth)?About:NotRegister}/>
                <Route exact path='/login' render={()=><Login status={auth} stateAuth={this.stateAuth}/>}/>
                <Route exact path='/register' render={()=><Registration status={auth}/>}/>
                <Route exact path='/chat' render={()=>(auth)?<Chat socket={this.socket}/>:<NotRegister/>}/>
            </div>
        )
    }
}

export default App;
