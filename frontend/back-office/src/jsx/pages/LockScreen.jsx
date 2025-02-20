import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

import logo from '../../assets/images/logo-full-dark.png';

const LockScreen = () => {
   const navigate = useNavigate();
   const submitHandler = (e) => {
      e.preventDefault();
      navigate("/");
   };
   const  [eyeOpen, setEyeOpen] = useState(false);
   return (
      <div className="authincation ">
         <div className="container ">
            <div className="row justify-content-center h-100 align-items-center">
               <div className="col-md-6">
                  <div className="authincation-content">
                     <div className="row no-gutters">
                        <div className="col-xl-12">
                           <div className="auth-form">
                              <div className="text-center mb-3">
                                 <Link to={"/"}>
                                    <img src={logo} alt="logo" />
                                 </Link>
                              </div>
                              <h4 className="text-center mb-4 ">
                                 Account Locked
                              </h4>
                              <form
                                 action=""
                                 onSubmit={(e) => submitHandler(e)}
                              >
                                 <div className="mb-3">
                                    <label className="form-label">Password</label>
                                 <div className="position-relative">
                                    <input
                                       type={eyeOpen ? 'text' : 'password'}
                                       className="form-control"
                                       defaultValue="12345"
                                       name="password"
                                    />
												<span className={`show-pass eye ${eyeOpen ? 'active' : ''}`}
                                       onClick={()=>setEyeOpen(!eyeOpen)}
                                    >
													<i className="fa fa-eye-slash"/>
													<i className="fa fa-eye"/>
												</span>
											</div>
                                    
                                 </div>
                                 <div className="text-center">
                                    <button
                                       type="submit"
                                       value="Unlock"
                                       className="btn btn-primary text-white btn-block"
                                    >
                                       Unlock
                                    </button>
                                 </div>
                              </form>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default LockScreen;
