import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";

function GeneralCustomers() {
  const [data, setData] = useState(
    document.querySelectorAll("#generalCustomer tbody tr")
  );
  const sort = 10;
  const activePag = useRef(0);
  const [test, settest] = useState(0);

  // Active data
  const chageData = (frist, sec) => {
    for (var i = 0; i < data.length; ++i) {
      if (i >= frist && i < sec) {
        data[i].classList.remove("d-none");
      } else {
        data[i].classList.add("d-none");
      }
    }
  };

  // use effect
  useEffect(() => {
    setData(document.querySelectorAll("#generalCustomer tbody tr"));
  }, [test]);
  // Active pagginarion
  activePag.current === 0 && chageData(0, sort);
  // paggination
  let paggination = Array(Math.ceil(data.length / sort))
    .fill()
    .map((_, i) => i + 1);

  // Active paggination & chage data
  const onClick = (i) => {
    activePag.current = i;
    chageData(activePag.current * sort, (activePag.current + 1) * sort);
    settest(i);
  };

  return (
    <>
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
      <Dropdown className="dropdown custom-dropdown mb-md-4 mb-2">
        <Dropdown.Toggle
          type="button"
          className="i-false btn btn-primary light d-flex align-items-center svg-btn"
          as="div"
          aria-expanded="false"
        >
          <svg
            width={28}
            height={28}
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24.5 6.125H12.25C12.25 5.15987 11.4651 4.375 10.5 4.375H8.75C7.78487 4.375 7 5.15987 7 6.125H3.5C3.017 6.125 2.625 6.51612 2.625 7C2.625 7.48388 3.017 7.875 3.5 7.875H7C7 8.84013 7.78487 9.625 8.75 9.625H10.5C11.4651 9.625 12.25 8.84013 12.25 7.875H24.5C24.983 7.875 25.375 7.48388 25.375 7C25.375 6.51612 24.983 6.125 24.5 6.125ZM8.75 7.875V6.125H10.5L10.5009 6.9965C10.5009 6.99825 10.5 6.99913 10.5 7C10.5 7.00087 10.5009 7.00175 10.5009 7.0035V7.875H8.75Z"
              fill="#EA7A9A"
            />
            <path
              d="M24.5 13.125H19.25C19.25 12.1599 18.4651 11.375 17.5 11.375H15.75C14.7849 11.375 14 12.1599 14 13.125H3.5C3.017 13.125 2.625 13.5161 2.625 14C2.625 14.4839 3.017 14.875 3.5 14.875H14C14 15.8401 14.7849 16.625 15.75 16.625H17.5C18.4651 16.625 19.25 15.8401 19.25 14.875H24.5C24.983 14.875 25.375 14.4839 25.375 14C25.375 13.5161 24.983 13.125 24.5 13.125ZM15.75 14.875V13.125H17.5L17.5009 13.9965C17.5009 13.9983 17.5 13.9991 17.5 14C17.5 14.0009 17.5009 14.0017 17.5009 14.0035V14.875H15.75Z"
              fill="#EA7A9A"
            />
            <path
              d="M24.5 20.125H12.25C12.25 19.1599 11.4651 18.375 10.5 18.375H8.75C7.78487 18.375 7 19.1599 7 20.125H3.5C3.017 20.125 2.625 20.5161 2.625 21C2.625 21.4839 3.017 21.875 3.5 21.875H7C7 22.8401 7.78487 23.625 8.75 23.625H10.5C11.4651 23.625 12.25 22.8401 12.25 21.875H24.5C24.983 21.875 25.375 21.4839 25.375 21C25.375 20.5161 24.983 20.125 24.5 20.125ZM8.75 21.875V20.125H10.5L10.5009 20.9965C10.5009 20.9983 10.5 20.9991 10.5 21C10.5 21.0009 10.5009 21.0017 10.5009 21.0035V21.875H8.75Z"
              fill="#EA7A9A"
            />
          </svg>
          <span className="fs-16 ms-3">Filter</span>
          <i className="fa fa-angle-down scale5 ms-3" />
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
          <Dropdown.Item className="dropdown-item" to="#">
            2020
          </Dropdown.Item>
          <Dropdown.Item className="dropdown-item" to="#">
            2019
          </Dropdown.Item>
          <Dropdown.Item className="dropdown-item" to="#">
            2018
          </Dropdown.Item>
          <Dropdown.Item className="dropdown-item" to="#">
            2017
          </Dropdown.Item>
          <Dropdown.Item className="dropdown-item" to="#">
            2016
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <div className="row">
        <div className="col-lg-12">
          <div className="table-responsive rounded card-table">
            <div id="generalCustomer" className="dataTables_wrapper no-footer">
              <table
                className="table border-no order-table mb-4 table-responsive-lg dataTablesCard dataTable no-footer"
                id="example5"
                role="grid"
                aria-describedby="example5_info"
              >
                <thead>
                  <tr role="row">
                    <th
                      className="sorting_asc"
                      tabIndex={0}
                      aria-controls="example5"
                      rowSpan={1}
                      colSpan={1}
                      aria-sort="ascending"
                      aria-label="Customer ID: activate to sort column descending"
                      style={{ width: 100 }}
                    >
                      Customer ID
                    </th>
                    <th
                      className="sorting"
                      tabIndex={0}
                      aria-controls="example5"
                      rowSpan={1}
                      colSpan={1}
                      aria-label="Join Date: activate to sort column ascending"
                      style={{ width: 166 }}
                    >
                      Join Date
                    </th>
                    <th
                      className="sorting"
                      tabIndex={0}
                      aria-controls="example5"
                      rowSpan={1}
                      colSpan={1}
                      aria-label="Customer Name: activate to sort column ascending"
                      style={{ width: 126 }}
                    >
                      Customer Name
                    </th>
                    <th
                      className="sorting"
                      tabIndex={0}
                      aria-controls="example5"
                      rowSpan={1}
                      colSpan={1}
                      aria-label="Location: activate to sort column ascending"
                      style={{ width: 184 }}
                    >
                      Location
                    </th>
                    <th
                      className="sorting"
                      tabIndex={0}
                      aria-controls="example5"
                      rowSpan={1}
                      colSpan={1}
                      aria-label="Total Spent: activate to sort column ascending"
                      style={{ width: 90 }}
                    >
                      Total Spent
                    </th>
                    <th
                      className="sorting"
                      tabIndex={0}
                      aria-controls="example5"
                      rowSpan={1}
                      colSpan={1}
                      aria-label="Last Order: activate to sort column ascending"
                      style={{ width: 85 }}
                    >
                      Last Order
                    </th>
                    <th
                      className="sorting"
                      tabIndex={0}
                      aria-controls="example5"
                      rowSpan={1}
                      colSpan={1}
                      aria-label=": activate to sort column ascending"
                      style={{ width: 26 }}
                    />
                  </tr>
                </thead>
                <tbody>
                  <tr
                    className="alert alert-dismissible border-0 odd"
                    role="row"
                  >
                    <td className="sorting_1">#C-00451</td>
                    <td>26 March 2024, 12:42 AM</td>
                    <td>James WItcwicky</td>
                    <td>Corner Street 5th London</td>
                    <td>$164.52</td>
                    <td>
                      <Link className="btn btn-light btn-sm" to="#">
                        $67.27
                      </Link>
                    </td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant=""
                          className="i-false"
                          to="#"
                          as="div"
                          aria-expanded="false"
                        >
                          <svg
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12Z"
                              stroke="#3E4954"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M18 12C18 12.5523 18.4477 13 19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12Z"
                              stroke="#3E4954"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M4 12C4 12.5523 4.44772 13 5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12Z"
                              stroke="#3E4954"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                          <Dropdown.Item className="dropdown-item" to="#">
                            <i className="las la-check-circle text-success me-3 scale5" />
                            Accept Order
                          </Dropdown.Item>
                          <Dropdown.Item
                            to="#"
                            data-dismiss="alert"
                            aria-label="Close"
                            className="dropdown-item"
                          >
                            <i className="las la-times-circle text-danger me-3 scale5" />
                            Reject Order
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                  <tr
                    className="alert alert-dismissible border-0 even"
                    role="row"
                  >
                    <td className="sorting_1">#C-00456</td>
                    <td>26 March 2024, 12:42 AM</td>
                    <td>David Horison</td>
                    <td>981 St. John’s Road London</td>
                    <td>$24.55</td>
                    <td>
                      <Link className="btn btn-light btn-sm" to="#">
                        $14.89
                      </Link>
                    </td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant=""
                          className="i-false"
                          to="#"
                          as="div"
                          aria-expanded="false"
                        >
                          <svg
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12Z"
                              stroke="#3E4954"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M18 12C18 12.5523 18.4477 13 19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12Z"
                              stroke="#3E4954"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M4 12C4 12.5523 4.44772 13 5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12Z"
                              stroke="#3E4954"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                          <Dropdown.Item className="dropdown-item" to="#">
                            <i className="las la-check-circle text-success me-3 scale5" />
                            Accept Order
                          </Dropdown.Item>
                          <Dropdown.Item
                            to="#"
                            data-dismiss="alert"
                            aria-label="Close"
                            className="dropdown-item"
                          >
                            <i className="las la-times-circle text-danger me-3 scale5" />
                            Reject Order
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                  <tr
                    className="alert alert-dismissible border-0 odd"
                    role="row"
                  >
                    <td className="sorting_1">#C-004560</td>
                    <td>26 March 2024, 12:42 AM</td>
                    <td>Veronica</td>
                    <td>21 King Street London</td>
                    <td>$74.92</td>
                    <td>
                      <Link className="btn btn-light btn-sm" to="#">
                        $21.55
                      </Link>
                    </td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant=""
                          className="i-false"
                          to="#"
                          as="div"
                          aria-expanded="false"
                        >
                          <svg
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12Z"
                              stroke="#3E4954"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M18 12C18 12.5523 18.4477 13 19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12Z"
                              stroke="#3E4954"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M4 12C4 12.5523 4.44772 13 5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12Z"
                              stroke="#3E4954"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                          <Dropdown.Item className="dropdown-item" to="#">
                            <i className="las la-check-circle text-success me-3 scale5" />
                            Accept Order
                          </Dropdown.Item>
                          <Dropdown.Item
                            to="#"
                            data-dismiss="alert"
                            aria-label="Close"
                            className="dropdown-item"
                          >
                            <i className="las la-times-circle text-danger me-3 scale5" />
                            Reject Order
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                  <tr
                    className="alert alert-dismissible border-0 even"
                    role="row"
                  >
                    <td className="sorting_1">#C-004561</td>
                    <td>26 March 2024, 12:42 AM</td>
                    <td>Samantha Bake</td>
                    <td>79 The Drive London</td>
                    <td>$22.18</td>
                    <td>
                      <Link className="btn btn-light btn-sm" to="#">
                        $11.41
                      </Link>
                    </td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant=""
                          className="i-false"
                          to="#"
                          as="div"
                          aria-expanded="false"
                        >
                          <svg
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12Z"
                              stroke="#3E4954"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M18 12C18 12.5523 18.4477 13 19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12Z"
                              stroke="#3E4954"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M4 12C4 12.5523 4.44772 13 5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12Z"
                              stroke="#3E4954"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                          <Dropdown.Item className="dropdown-item" to="#">
                            <i className="las la-check-circle text-success me-3 scale5" />
                            Accept Order
                          </Dropdown.Item>
                          <Dropdown.Item
                            to="#"
                            data-dismiss="alert"
                            aria-label="Close"
                            className="dropdown-item"
                          >
                            <i className="las la-times-circle text-danger me-3 scale5" />
                            Reject Order
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                  <tr
                    className="alert alert-dismissible border-0 odd"
                    role="row"
                  >
                    <td className="sorting_1">#C-004562</td>
                    <td>26 March 2024, 12:42 AM</td>
                    <td>Olivia Shine</td>
                    <td>35 Station Road London</td>
                    <td>$82.46</td>
                    <td>
                      <Link className="btn btn-light btn-sm" to="#">
                        $42.85
                      </Link>
                    </td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant=""
                          className="i-false"
                          to="#"
                          as="div"
                          aria-expanded="false"
                        >
                          <svg
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12Z"
                              stroke="#3E4954"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M18 12C18 12.5523 18.4477 13 19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12Z"
                              stroke="#3E4954"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M4 12C4 12.5523 4.44772 13 5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12Z"
                              stroke="#3E4954"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                          <Dropdown.Item className="dropdown-item" to="#">
                            <i className="las la-check-circle text-success me-3 scale5" />
                            Accept Order
                          </Dropdown.Item>
                          <Dropdown.Item
                            to="#"
                            data-dismiss="alert"
                            aria-label="Close"
                            className="dropdown-item"
                          >
                            <i className="las la-times-circle text-danger me-3 scale5" />
                            Reject Order
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                  <tr
                    className="alert alert-dismissible border-0 even"
                    role="row"
                  >
                    <td className="sorting_1">#C-004562</td>
                    <td>26 March 2024, 12:42 AM</td>
                    <td>Olivia Shine</td>
                    <td>35 Station Road London</td>
                    <td>$82.46</td>
                    <td>
                      <Link className="btn btn-light btn-sm" to="#">
                        $42.85
                      </Link>
                    </td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant=""
                          className="i-false"
                          to="#"
                          as="div"
                          aria-expanded="false"
                        >
                          <svg
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12Z"
                              stroke="#3E4954"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M18 12C18 12.5523 18.4477 13 19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12Z"
                              stroke="#3E4954"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M4 12C4 12.5523 4.44772 13 5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12Z"
                              stroke="#3E4954"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                          <Dropdown.Item className="dropdown-item" to="#">
                            <i className="las la-check-circle text-success me-3 scale5" />
                            Accept Order
                          </Dropdown.Item>
                          <Dropdown.Item
                            to="#"
                            data-dismiss="alert"
                            aria-label="Close"
                            className="dropdown-item"
                          >
                            <i className="las la-times-circle text-danger me-3 scale5" />
                            Reject Order
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                  <tr
                    className="alert alert-dismissible border-0 odd"
                    role="row"
                  >
                    <td className="sorting_1">#C-004563</td>
                    <td>26 March 2024, 12:42 AM</td>
                    <td>Roberto Carlo</td>
                    <td>544 Manor Road London</td>
                    <td>$34.41</td>
                    <td>
                      <Link className="btn btn-light btn-sm" to="#">
                        $8.13
                      </Link>
                    </td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant=""
                          className="i-false"
                          to="#"
                          as="div"
                          aria-expanded="false"
                        >
                          <svg
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12Z"
                              stroke="#3E4954"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M18 12C18 12.5523 18.4477 13 19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12Z"
                              stroke="#3E4954"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M4 12C4 12.5523 4.44772 13 5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12Z"
                              stroke="#3E4954"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                          <Dropdown.Item className="dropdown-item" to="#">
                            <i className="las la-check-circle text-success me-3 scale5" />
                            Accept Order
                          </Dropdown.Item>
                          <Dropdown.Item
                            to="#"
                            data-dismiss="alert"
                            aria-label="Close"
                            className="dropdown-item"
                          >
                            <i className="las la-times-circle text-danger me-3 scale5" />
                            Reject Order
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                  <tr
                    className="alert alert-dismissible border-0 even"
                    role="row"
                  >
                    <td className="sorting_1">#C-004564</td>
                    <td>26 March 2024, 12:42 AM</td>
                    <td>Franky Sihotang</td>
                    <td>6 The Avenue London</td>
                    <td>$45.86</td>
                    <td>
                      <Link className="btn btn-light btn-sm" to="#">
                        $42.85
                      </Link>
                    </td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant=""
                          className="i-false"
                          to="#"
                          as="div"
                          aria-expanded="false"
                        >
                          <svg
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12Z"
                              stroke="#3E4954"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M18 12C18 12.5523 18.4477 13 19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12Z"
                              stroke="#3E4954"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M4 12C4 12.5523 4.44772 13 5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12Z"
                              stroke="#3E4954"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                          <Dropdown.Item className="dropdown-item" to="#">
                            <i className="las la-check-circle text-success me-3 scale5" />
                            Accept Order
                          </Dropdown.Item>
                          <Dropdown.Item
                            to="#"
                            data-dismiss="alert"
                            aria-label="Close"
                            className="dropdown-item"
                          >
                            <i className="las la-times-circle text-danger me-3 scale5" />
                            Reject Order
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                  <tr
                    className="alert alert-dismissible border-0 odd"
                    role="row"
                  >
                    <td className="sorting_1">#C-00457</td>
                    <td>26 March 2024, 12:42 AM</td>
                    <td>Emilia Johanson</td>
                    <td>67 St. John’s Road London</td>
                    <td>$251.16</td>
                    <td>
                      <Link className="btn btn-light btn-sm" to="#">
                        $91.68
                      </Link>
                    </td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant=""
                          className="i-false"
                          to="#"
                          as="div"
                          aria-expanded="false"
                        >
                          <svg
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12Z"
                              stroke="#3E4954"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M18 12C18 12.5523 18.4477 13 19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12Z"
                              stroke="#3E4954"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M4 12C4 12.5523 4.44772 13 5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12Z"
                              stroke="#3E4954"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                          <Dropdown.Item className="dropdown-item" to="#">
                            <i className="las la-check-circle text-success me-3 scale5" />
                            Accept Order
                          </Dropdown.Item>
                          <Dropdown.Item
                            to="#"
                            data-dismiss="alert"
                            aria-label="Close"
                            className="dropdown-item"
                          >
                            <i className="las la-times-circle text-danger me-3 scale5" />
                            Reject Order
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                  <tr
                    className="alert alert-dismissible border-0 even"
                    role="row"
                  >
                    <td className="sorting_1">#C-00458</td>
                    <td>26 March 2024, 12:42 AM</td>
                    <td>Rendy Greenlee</td>
                    <td>32 The Green London</td>
                    <td>$44.99</td>
                    <td>
                      <Link className="btn btn-light btn-sm" to="#">
                        $11.41
                      </Link>
                    </td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant=""
                          className="i-false"
                          to="#"
                          as="div"
                          aria-expanded="false"
                        >
                          <svg
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12Z"
                              stroke="#3E4954"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M18 12C18 12.5523 18.4477 13 19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12Z"
                              stroke="#3E4954"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M4 12C4 12.5523 4.44772 13 5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12Z"
                              stroke="#3E4954"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                          <Dropdown.Item className="dropdown-item" to="#">
                            <i className="las la-check-circle text-success me-3 scale5" />
                            Accept Order
                          </Dropdown.Item>
                          <Dropdown.Item
                            to="#"
                            data-dismiss="alert"
                            aria-label="Close"
                            className="dropdown-item"
                          >
                            <i className="las la-times-circle text-danger me-3 scale5" />
                            Reject Order
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
                <div
                  className="dataTables_info"
                  id="example5_info"
                  role="status"
                  aria-live="polite"
                >
                  Showing {activePag.current * sort + 1} to{" "}
                  {data.length > (activePag.current + 1) * sort
                    ? (activePag.current + 1) * sort
                    : data.length}{" "}
                  of {data.length} entries
                </div>
                <div
                  className="dataTables_paginate paging_simple_numbers"
                  id="example5_paginate"
                >
                  <Link
                    className="paginate_button previous disabled"
                    to="/general-customers"
                    onClick={() =>
                      activePag.current > 0 && onClick(activePag.current - 1)
                    }
                  >
                    Previous
                  </Link>
                  <span>
                    {paggination.map((number, i) => (
                      <Link
                        key={i}
                        to="general-customers"
                        className={`paginate_button  ${
                          activePag.current === i ? "current" : ""
                        } `}
                        onClick={() => onClick(i)}
                      >
                        {number}
                      </Link>
                    ))}
                  </span>
                  <Link
                    className="paginate_button next"
                    to="general-customers"
                    onClick={() =>
                      activePag.current + 1 < paggination.length &&
                      onClick(activePag.current + 1)
                    }
                  >
                    Next
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GeneralCustomers;
