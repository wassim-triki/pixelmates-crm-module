import React, { useState } from 'react'
import { connect, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { loadingToggleAction,loginAction,
} from '../../store/actions/AuthActions';

import logo from '../../assets/images/logo.png'
import logotext from '../../assets/images/logo-text.png'

function Login (props) {
    const [email, setEmail] = useState('demo@example.com');
    let errorsObj = { email: '', password: '' };
    const [errors, setErrors] = useState(errorsObj);
    const [password, setPassword] = useState('123456');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function onLogin(e) {
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
        if (error) {
			return ;
		}
		dispatch(loadingToggleAction(true));	
        dispatch(loginAction(email, password, navigate));
    }
	const [showPassword, setShowPassword] =  useState(false);
  return (  
		<div className="login-form-bx">
			<div className="container-fluid">
				<div className="row">
					<div className="col-lg-6 col-md-7 box-skew d-flex">
						<div className="authincation-content">
							<div className="mb-4">
								<h3 className="mb-1 font-w600">Welcome to Sego</h3>
								<p className="">Sign in by entering information below</p>
							</div>
							{props.errorMessage && (
								<div className='bg-red-300 text-red-900 border border-red-900 p-1 my-2'>
									{props.errorMessage}
								</div>
							)}
							{props.successMessage && (
								<div className='bg-green-300 text-green-900 border border-green-900 p-1 my-2'>
									{props.successMessage}
								</div>
							)}
							<form onSubmit={onLogin}>
								<div className="form-group mb-3">
									<label className="mb-2 form-label">
										Email <span className='required'>*</span>
									</label>
									<input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)}/>
									{errors.email && <div className="text-danger fs-12">{errors.email}</div>}
								</div>
								<div className="form-group mb-3">
									<label className="mb-2 form-label">Password <span className='required'>*</span></label>
									<div className='position-relative'>
										<input type={showPassword ? 'text' : 'password'} className="form-control" value={password} onChange={(e) => setPassword(e.target.value)}/>
										<span className={`show-pass eye ${showPassword ? 'active' : ''}`}
											onClick={()=>setShowPassword(!showPassword)}
										>
											<i className="fa fa-eye-slash"/>
											<i className="fa fa-eye"/>
										</span>
									</div>
									{errors.password && <div className="text-danger fs-12">{errors.password}</div>}
								</div>
								<div className="form-row d-flex justify-content-between mt-4 mb-2">
									<div className="form-group mb-3">
										<div className="custom-control custom-checkbox ms-1 ">
											<input type="checkbox" className="form-check-input" id="basic_checkbox_1"/>
											<label className="form-check-label" htmlFor="basic_checkbox_1">Remember my preference</label>
										</div>
									</div>
								</div>
								<div className="text-center">
									<button type="submit" className="btn btn-primary btn-block">Sign In</button>
								</div>
							</form>
							<div className="new-account mt-2">
								<p className="mb-0">Don't have an account?{" "}
									<Link className="text-primary" to="/page-register">Sign up</Link>
								</p>
							</div>
						</div>
					</div>
					<div className="col-lg-6 col-md-5 d-flex box-skew1">
						<div className="inner-content align-self-center">
							<Link to="/dashboard" className="login-logo">
								<img src={logo} alt="" className="logo-icon me-2"/>
								<img src={logotext} alt="" className="logo-text ms-1"/>
							</Link>
							<h2 className="m-b10 ">Login To You Now</h2>
							<p className="m-b40">User Experience & Interface Design Strategy SaaS Solutions</p>
							<ul className="social-icons mt-4">
								<li><Link to={"#"}><i className="fab fa-facebook-f"></i></Link></li>
								<li><Link to={"#"}><i className="fab fa-twitter"></i></Link></li>
								<li><Link to={"#"}><i className="fab fa-linkedin-in"></i></Link></li>
							</ul>
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
export default connect(mapStateToProps)(Login);