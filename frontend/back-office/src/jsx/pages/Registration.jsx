import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { connect, useDispatch } from 'react-redux';
import logo from '../../assets/images/logo-full-dark.png'
import {
    loadingToggleAction,
    signupAction,
} from '../../store/actions/AuthActions';
function Register(props) {
    const [email, setEmail] = useState('');
    let errorsObj = { email: '', password: '' };
    const [errors, setErrors] = useState(errorsObj);
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    function onSignUp(e) {
        e.preventDefault();
        let error = false;
        const errorObj = { ...errorsObj };
        if (email === '') {
            errorObj.email = 'Email is Required';
            error = true;
        }
        if (password === '') {
            errorObj.password = 'Password is Required';
            error = true;
        }
        setErrors(errorObj);
        if (error) return;
        dispatch(loadingToggleAction(true));
        dispatch(signupAction(email, password, navigate));
    }
    const [showPassword, setShowPassword] =  useState(false);
  return (
    <div className='authincation h-100 p-meddle'>
        <div className='container h-100'>
            <div className='row justify-content-center h-100 align-items-center'>
                <div className='col-md-8 col-lg-6'>
                    <div className='authincation-content'>
                        <div className='row no-gutters'>
                            <div className='col-xl-12'>
                                <div className='auth-form'>
                                    <div className='text-center mb-3'>
                                        <img src={logo} alt="" />
                                    </div>

                                    <h4 className='text-center mb-4'>Sign up your account</h4>
                                    {props.errorMessage && (
                                        <div className='text-black p-1 my-2'>
                                            {props.errorMessage}
                                        </div>
                                    )}
                                    {props.successMessage && (
                                        <div className=' text-black p-1 my-2'>
                                            {props.successMessage}
                                        </div>
                                    )}
                                    <form onSubmit={onSignUp}>
                                        <div className='form-group mb-3'>
                                            <label className='form-label'>Username <span className='required'>*</span></label>
                                            <input type='text' className='form-control' placeholder='user'  />
                                        </div>
                                        <div className='form-group mb-3'>
                                            <label className='form-label'>Email <span className='required'>*</span></label>
                                            <input type="email" className="form-control"
                                                value={email}
												placeholder='email'
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                            {errors.email && <div className="text-danger fs-12">{errors.email}</div>}
                                        </div>
                                        <div className='form-group mb-3'>
                                            <label className='form-label'>Password <span className='required'>*</span></label>
                                            <div className='position-relative'>
                                                <input type={showPassword ? 'text' : 'password' } className="form-control"
                                                    value={password}
                                                    onChange={(e) =>
                                                        setPassword(e.target.value)
                                                    }
                                                    placeholder='password'
                                                />
                                                <span className={`show-pass eye ${showPassword ? 'active' : ''}`}
                                                    onClick={()=>setShowPassword(!showPassword)}
                                                >
													<i className="fa fa-eye-slash"/>
													<i className="fa fa-eye"/>
												</span>
                                            </div>
                                        </div>
                                        {errors.password && <div className="text-danger fs-12">{errors.password}</div>}
                                        <div className='text-center mt-4'>
                                            <button type='submit' className='btn btn-primary btn-block'>Sign Up</button>
                                        </div>
                                    </form>
                                    <div className='new-account mt-3'>
                                        <p>
                                            Already have an account?{' '}
                                            <Link className='text-primary' to='/login'>
                                                Sign in
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

const mapStateToProps = (state) => {
    return {
        errorMessage: state.auth.errorMessage,
        successMessage: state.auth.successMessage,
        showLoading: state.auth.showLoading,
    };
};
export default connect(mapStateToProps)(Register);