import React, {Component} from 'react';
import {Link} from 'react-router-dom';


class Login extends Component {

    constructor(){
        super();
        this.state = {
            messageDanger: null,
            login: '',
            password: '',
            result: {
                errors: {},
                result: null
            }
        };
    }

    handleInputChange = (e) =>{
        this.setState({
            [e.target.name]: e.target.value
        })
    };

    handleSubmit = (e) =>{
        e.preventDefault();
        const user = {
            login: this.state.login,
            password: this.state.password
        };
        fetch('/login',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then(res => res.json())
            .then(value => {

                if(value.token){
                    localStorage.setItem('Authorization', value.token);
                    localStorage.setItem('CharacterUrl', '/images/anonim.png');
                    localStorage.setItem('CharacterTitle', 'anonim');
                    this.props.stateAuth()
                }
                this.setState({
                    result: {errors: value.errors,
                            result: value.result
                    }
                })
            })
            .catch(error=>{
                this.setState({
                    messageDanger: true
                })
            })

    };



    render(){
        const {errors, result} = this.state.result;
        const {messageDanger} = this.state;
        if (messageDanger) return (
            <div className="alert alert-danger">
                <h4 className="alert-heading">Error, contact your administrator</h4>
                <img src="/images/homerBroke.png" alt="" style={{height: '200px'}}/>
            </div>
        );
        if(result || this.props.status) {
            return (
                <div className="alert alert-success">
                    <h4 className="alert-heading">Login success </h4>
                    <img src="/images/homerHappy.ico" alt="" style={{height: '200px'}}/>
                    <hr/>
                    <p>Choose <Link to='/'>Character</Link> or go to <Link to='/chat'>Chat</Link></p>
                </div>
            )
        }else {
            return (
                <div className='container' style={{marginTop: '50px', width: '700px'}}>
                    <h2 style={{marginBottom: '40px'}}>Login</h2>
                    <form onSubmit={this.handleSubmit}>
                        <div className='form-group'>
                            <input
                                type="text"
                                placeholder='Login'
                                className={errors.login ? 'form-control form-control-lg border-danger' : 'form-control form-control-lg'}
                                name='login'
                                onChange={this.handleInputChange}
                                value={this.state.login}
                            />
                            {errors.login && (<div className='text-danger'>{errors.login}</div>)}
                        </div>
                        <div className='form-group'>
                            <input
                                type="password"
                                placeholder='Password'
                                className={errors.password ? 'form-control form-control-lg border-danger' : 'form-control form-control-lg'}
                                name='password'
                                onChange={this.handleInputChange}
                                value={this.state.password}
                            />
                            {errors.password && (<div className='text-danger'>{errors.password}</div>)}
                        </div>
                        <div className='form-group'>
                            <button type='submit' className='btn btn-primary'>
                                Login User
                            </button>
                        </div>
                    </form>
                </div>
            )
        }
    }
}



export default Login;
