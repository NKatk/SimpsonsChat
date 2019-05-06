import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class About extends Component{
    constructor(props){
        super(props);
        this.state = {
            result: {
                takeIcon:null,
                auth: null,
                messageDanger: null
            }

        }
    }


    componentDidMount(){
        setTimeout(()=>{
            fetch('/takeicons',
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
                        return
                    }
                    this.setState({
                        result:{
                            takeIcon: value.takeIcon,
                            auth: value.auth,
                            messageDanger: false
                        }
                    })
                })
                .catch(error=>{
                    this.setState({
                        result:{
                            takeIcon: [],
                            auth: false,
                            messageDanger: true
                        }
                    })
                })
        },500)
    }

    clickCharacter = (e) =>{
        console.log(e.target.alt);
        localStorage.setItem('CharacterUrl', e.target.src);
        localStorage.setItem('CharacterTitle', e.target.alt);
    };


    render(){
        const {takeIcon, messageDanger} = this.state.result;
        if(!takeIcon && !messageDanger) return(
            <div className="d-flex justify-content-center">
                <div className="spinner-border text-warning" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
        if(messageDanger){
            return (
                <div className="alert alert-danger">
                    <h4 className="alert-heading">Error, contact your administrator</h4>
                    <img src="/images/homerBroke.png" alt="" style={{height: '200px'}}/>
                </div>
            )
        }
        return(
            <div>
                <h4>Choose your favorite character</h4>
                {takeIcon.map((item,i)=>{
                    return (
                        <Link key={i} to='/chat' onClick={this.clickCharacter}><img  src={item.url} alt={item.title} style={{height: '200px', margin:'10px'}}/></Link>
                    )
                })}
            </div>
        )
    }
}

export default About;
