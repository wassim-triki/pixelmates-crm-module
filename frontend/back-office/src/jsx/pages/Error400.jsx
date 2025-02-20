import React from "react";
import { Link } from "react-router-dom";

const Error400 = () => {
   return (
      <div className="authincation">
         <div className="container">
            {" "}
            <div className="row justify-content-center h-100 align-items-center">
               <div className="col-md-7 col-lg-5">
                  <div className="form-input-content text-center error-page">
                     <h1 className="error-text fw-bold">400</h1>
                     <h4>
                        <i className="fa fa-thumbs-down text-danger" /> Bad
                        Request
                     </h4>
                     <p>Your Request resulted in an error</p>
                     <div>
                        <Link className="btn btn-primary" to="/dashboard">
                           Back to Home
                        </Link>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Error400;
