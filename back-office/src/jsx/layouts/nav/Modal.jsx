import React from "react";
// import Modal from "react-modal";

const Modal = () => {
  return (
    <div className="modal fade" id="addOrderModalside">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Menus</h5>
            <button type="button" className="close" data-dismiss="modal">
              <span>×</span>
            </button>
          </div>
          <div className="modal-body">
            <form>
              <div className="form-group">
                <label className="text-black font-w500">Food Name</label>
                <input type="text" className="form-control" />
              </div>
              <div className="form-group">
                <label className="text-black font-w500">Order Date</label>
                <input type="date" className="form-control" />
              </div>
              <div className="form-group">
                <label className="text-black font-w500">Food Price</label>
                <input type="text" className="form-control" />
              </div>
              <div className="form-group">
                <button type="button" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
