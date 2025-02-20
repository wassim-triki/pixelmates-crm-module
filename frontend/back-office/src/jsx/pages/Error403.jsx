import React from 'react'
import { Link } from 'react-router-dom'

const Error403 = () => {
  return (
    <div className='authincation'>
      <div className='container'>
        <div className='row justify-content-center h-100 align-items-center'>
          <div className='col-md-7 col-lg-5'>
            <div className='form-input-content text-center error-page'>
              <h1 className='error-text  fw-bold'>403</h1>
              <h4>
                <i className='fa fa-times-circle text-danger' /> Forbidden
                Error!
              </h4>
              <p>You do not have permission to view this resource.</p>
              <div>
                <Link className='btn btn-primary' to='/dashboard'>
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Error403
