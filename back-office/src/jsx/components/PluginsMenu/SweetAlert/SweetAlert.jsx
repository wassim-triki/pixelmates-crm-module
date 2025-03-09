import React, { Fragment } from "react";
import Swal from "sweetalert2";
import PageTitle from "../../../layouts/PageTitle";
import thumbpng from  '../../../../assets/images/hand.png'

const customImageAlert = () => {
  Swal.fire({
    title:"Sweet !!",
    text: "Hey, Here's a custom image !!",
    imageUrl: thumbpng,
    imageHeight: 100, 
    imageWidth: 100,  
  });
}

const MainSweetAlert = () => {
  return (
    <Fragment>		
      <PageTitle activeMenu="Sweet Alert" motherMenu="Plugins" />	
      <div className="row">
        <div className="col-xl-3 col-xxl-4 col-lg-4 col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-3">Sweet Wrong</h4>
              <div className="card-content">
                <div className="sweetalert">
                  <button
                    onClick={() =>                      
                      Swal.fire({
                        icon: 'error',
                        title: 'Oops',
                        text: 'Something went wrong!',                        
                      })
                    }
                    className="btn btn-danger btn sweet-wrong"
                  >
                    Sweet Wrong
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-xxl-4 col-lg-4 col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-3">Sweet Message</h4>
              <div className="card-content">
                <div className="sweetalert">				
				          <button
                    onClick={() =>                      
                      Swal.fire("Hey, Here's a message !!")
                    }
                    className="btn btn-info btn sweet-message"
                  >
                    Sweet Message
                 </button>
				
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-xxl-4 col-lg-4 col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-3">Sweet Text</h4>
              <div className="card-content">
                <div className="sweetalert">    
				          <button
                    onClick={() =>                      
                      Swal.fire(
                        "Hey, Here's a message !!", 
                        "It's pretty, isn't it?"
                      )
                    }
                    className="btn btn-primary btn sweet-text"
                  >
                    Sweet Text
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-xxl-4 col-lg-4 col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-3">Sweet Success</h4>
              <div className="card-content">
                <div className="sweetalert">
                  <button                    
                    onClick={() =>                      
                      Swal.fire({
                        icon: 'success',
                        title: 'Good job!',
                        text: "You clicked the button!",                        
                      })
                    }
                    className="btn btn-success btn sweet-success"
                  >
                    Sweet Success
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-xxl-4 col-lg-4 col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-3">Sweet Confirm</h4>
              <div className="card-content">
                <div className="sweetalert">
                  <button
                    onClick={() =>
                      Swal.fire({
                        title: 'Are you sure for delete ?',
                        text: "Once deleted, you will not be able to recover this imaginary file!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#dd6b55',
                        cancelButtonColor: '#aaa',
                        confirmButtonText: 'Yes, delete it!'
                      }).then((result) => {
                        if (result.isConfirmed) {
                          Swal.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                          )
                        }
                      })
                    }
                    className="btn btn-warning btn sweet-confirm"
                  >
                    Sweet Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-xxl-4 col-lg-4 col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-3">Sweet Confirm Or Cancel</h4>
              <div className="card-content">
                <div className="sweetalert">
                  <button
                    onClick={() =>
                      Swal.fire({
                        title: 'Are you sure to delete ?',
                        text: "You will not be able to recover this imaginary file !!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#dd6b55',
                        cancelButtonColor: '#aaa',
                        confirmButtonText: 'Yes, delete it!'
                      }).then((result) => {
                        if (result.isConfirmed) {
                          Swal.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                          )
                        }
                      })
                    }
                    className="btn btn-warning btn sweet-success-cancel"
                  >
                    Sweet Confirm Or Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-xxl-4 col-lg-4 col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-3">Sweet Image Message</h4>
              <div className="card-content">
                <div className="sweetalert ">
				          <button                   
                    onClick={customImageAlert}
                    className="btn btn-info btn sweet-image-message" 
                  >
                    Sweet Image Message
                  </button>
				
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-xxl-4 col-lg-4 col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-3">Sweet Alert</h4>
              <div className="card-content">
                <div className="sweetalert">			
				          <button
                    onClick={() =>                      
                      Swal.fire(
                        "Sweet !!", 
                        "true"
                      )
                    }
                    className="btn btn-primary btn sweet-html"
                  >
                    Sweet Alert
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-3">Sweet Auto Close</h4>
              <div className="card-content">
                <div className="sweetalert">
                  <button
                    onClick={() =>                      
                      Swal.fire({                        
                        title: "Sweet auto close alert !!",
                        text: "Hey, i will close in 2 seconds !!",
                        showConfirmButton: false,                  
                        timer: 1500
                      })
                    }
                    className="btn btn-danger btn sweet-auto"
                  >
                    Sweet Auto Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-3">Sweet Prompt</h4>
              <div className="card-content">
                <div className="sweetalert">
                  <button
                    onClick={() =>                     
                      Swal.fire({
                        title: 'Enter an input !!',
                        text: "Write something interesting !!",
                        icon: false,
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#aaa',
                        confirmButtonText: 'Ok'
                      })
                    }
                    className="btn btn-success btn sweet-prompt"
                  >
                    Sweet Prompt
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-3">Sweet Ajax</h4>
              <div className="card-content"></div>
              <div className="sweetalert">
                <button
                  onClick={() =>                    
                    Swal.fire({
                      title: 'Submit your Github username',
                      input: 'text',
                      inputAttributes: {
                        autocapitalize: 'off'
                      },
                      showCancelButton: true,
                      confirmButtonText: 'Look up',
                      showLoaderOnConfirm: true,
                      preConfirm: (login) => {
                        return fetch(`//api.github.com/users/${login}`)
                          .then(response => {
                            if (!response.ok) {
                              throw new Error(response.statusText)
                            }
                            return response.json()
                          })
                          .catch(error => {
                            Swal.showValidationMessage(
                              `Request failed: ${error}`
                            )
                          })
                      },
                      allowOutsideClick: () => !Swal.isLoading()
                    }).then((result) => {
                      if (result.isConfirmed) {
                        Swal.fire({
                          title: `${result.value.login}'s avatar`,
                          imageUrl: result.value.avatar_url
                        })
                      }
                    })
                  }
                  className="btn btn-info btn sweet-ajax"
                >
                  Sweet Ajax
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default MainSweetAlert;