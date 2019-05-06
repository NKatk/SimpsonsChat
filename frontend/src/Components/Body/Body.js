import React, {Component} from 'react';
import {Route} from 'react-router-dom';

import Chat from './Chat';
import NotRegister from './NotRegister';
import Login from './Login';
import Registration from './Registration';
import About from './About';

class Body extends Component{
    constructor(props){
        super(props);
        this.state = {
            statusAuth: false
        }
    }

    stateAuth = (val) =>{
        this.setState({
            statusAuth: val
        });
    };

    render(){
        console.log(this.props);
        return(
            <div>
                <Route exact path='/' component={(this.props.status||this.state.statusAuth)?About:NotRegister}/>
                <Route exact path='/login' render={()=><Login status={this.props.status} stateAuth={this.stateAuth}/>}/>
                <Route exact path='/register' component={Registration}/>
                <Route exact path='/chat' render={()=>this.props.status?<Chat state={'true'}/>:<NotRegister state={'false'}/>}/>
            </div>
        )
    }
}

export default Body;
