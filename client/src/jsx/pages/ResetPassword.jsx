import React from 'react';
//import { Link } from "react-router-dom";
//TODO: validate and dispatch
const ResetPassword = ({ history }) => {
  const onSubmit = (e) => {
    e.preventDefault();
    // Add your reset password logic here
  };

  return (
    <div className="authincation h-100 p-meddle">
      <div className="container h-100">
        <div className="row justify-content-center h-100 align-items-center">
          <div className="col-md-6">
            <div className="authincation-content">
              <div className="row no-gutters">
                <div className="col-xl-12">
                  <div className="auth-form">
                    <h4 className="text-center mb-4">Reset Password</h4>
                    <form onSubmit={(e) => onSubmit(e)}>
                      <div className="form-group">
                        <label>
                          <strong>New Password</strong>
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div className="form-group">
                        <label>
                          <strong>Confirm Password</strong>
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Confirm new password"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="submit"
                          value="RESET PASSWORD"
                          className="btn btn-primary btn-block"
                        />
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

export default ResetPassword;
