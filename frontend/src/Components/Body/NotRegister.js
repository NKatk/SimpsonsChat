import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class NotRegister extends Component{
    render(){
        return(
            <div>
                <h2>Welcome SimpsonsChat</h2>
                <img src="/images/family.png" alt="" style={{height: '400px'}}/>
                <p>For use, <Link to='/login'>Login</Link> or <Link to='/register'>Register</Link>.</p>
            </div>
        )
    }
}

export default NotRegister;
