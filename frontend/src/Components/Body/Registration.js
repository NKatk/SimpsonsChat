import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

class Registration extends Component {

    constructor(){
        super();
        this.state = {
            messageDanger: null,
            redirect: false,
            login: '',
            email: '',
            password: '',
            confPassword: '',
            result: {
                errors:{},
                result: null
            }
        };
    }

    handleInputChange = (e) =>{
        this.setState({
            [e.target.name]: e.target.value
        })
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const user = {
            login: this.state.login,
            email: this.state.email,
            password: this.state.password,
            confPassword: this.state.confPassword
        };
        fetch('/register',
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
                this.setState({
                    result: value
                })
            })
            .catch(error=>{
                this.setState({
                    messageDanger: true
                })
            })

    };

    redirect = () =>{
        setTimeout(()=>{
            this.setState({
                redirect: true
             })
        }, 1500)
    };


    render(){
        const {result, errors} = this.state.result;
        const {redirect, messageDanger} = this.state;
        if(this.props.status){
            return <Redirect to='/'/>
        }
        if (messageDanger) return (
            <div className="alert alert-danger">
                <h4 className="alert-heading">Error, contact your administrator</h4>
            </div>
        );
        if (redirect) return <Redirect to='/login'/>;
        if(result) {
            this.redirect();
            return (
                <div className="alert alert-success">
                    <h4 className="alert-heading">Registration success</h4>
                </div>
            )
        }else {
            return(
                <div className='container' style={{marginTop: '50px', width: '700px'}}>
                    <h2 style={{marginBottom: '40px'}}>Registration</h2>
                    <form onSubmit={this.handleSubmit}>
                        <div className='form-group'>
                            <input
                                type="text"
                                placeholder='Login'
                                className={errors.login ?'form-control form-control-lg border-danger':'form-control form-control-lg'}
                                name= 'login'
                                onChange={this.handleInputChange}
                                value={this.state.login}
                            />
                            {errors.login && (<div className='text-danger'>{errors.login}</div>)}
                        </div>
                        <div className='form-group'>
                            <input
                                type="email"
                                placeholder='Email'
                                className={errors.email ?'form-control form-control-lg border-danger':'form-control form-control-lg'}
                                name= 'email'
                                onChange={this.handleInputChange}
                                value={this.state.email}
                            />
                            {errors.email && (<div className='text-danger'>{errors.email}</div>)}
                        </div>
                        <div className='form-group'>
                            <input
                                type="password"
                                placeholder='Password'
                                className={errors.password ?'form-control form-control-lg border-danger':'form-control form-control-lg'}
                                name= 'password'
                                onChange={this.handleInputChange}
                                value={this.state.password}
                            />
                            {errors.password && (<div className='text-danger'>{errors.password}</div>)}
                        </div>
                        <div className='form-group'>
                            <input
                                type="password"
                                placeholder='Confirm password'
                                className={errors.confPassword ?'form-control form-control-lg border-danger':'form-control form-control-lg'}
                                name= 'confPassword'
                                onChange={this.handleInputChange}
                                value={this.state.confPassword}
                            />
                            {errors.confPassword && (<div className='text-danger'>{errors.confPassword}</div>)}
                        </div>
                        <div className='form-group'>
                            <button type='submit' className='btn btn-primary'>
                                Registration User
                            </button>
                        </div>
                    </form>
                </div>
            )
        }
    }
}



export default Registration;
