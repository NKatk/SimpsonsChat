import React, {Component} from 'react';
import {Link} from 'react-router-dom';


class NavBar extends Component{

    logOut = () =>{
        localStorage.setItem('Authorization', '');
        localStorage.setItem('CharacterUrl', '');
        localStorage.setItem('CharacterTitle', '');
        this.props.checkAuth()

    };

    render(){
        const guestLinks = (
            <ul className='navbar-nav ml-auto'>
                <li className='nav-item'>
                    <Link className='nav-link' to="/register">Register</Link>
                </li>
                <li className='nav-item'>
                    <Link className='nav-link' to="/login">Login</Link>
                </li>
            </ul>
        );
        const authLinks = (
            <ul className='navbar-nav ml-auto'>
                <li className='nav-item'>
                    <Link className='nav-link' to="/chat">Chat</Link>
                </li>
                <li className='nav-item'>
                    <Link className='nav-link' onClick={this.logOut} to=''>Logout</Link>
                </li>
            </ul>
        );
        return(
            <nav className="navbar navbar-expand-lg navbar-light bg-warning" style={{backgroundColor: '#03011e'}}>
                <Link className='navbar-brand' to="/">SimpsonsChat</Link>
                {this.props.status?authLinks:guestLinks}
            </nav>
        )
    }
}


export default NavBar;
