import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
// import { TimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
// import DateFnsUtils from "@date-io/date-fns";
import { timePickerModal } from "analogue-time-picker";

import { Dropdown } from "react-bootstrap";

function Orders() {
  //Time Picker
  const [selectedDate, handleDateChange] = useState(new Date());

  const [data, setData] = useState(
    document.querySelectorAll("#orders tbody tr")
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

  
  useEffect(() => {
    setData(document.querySelectorAll("#orders tbody tr"));
  }, [test]);
  
  activePag.current === 0 && chageData(0, sort);  
  let paggination = Array(Math.ceil(data.length / sort))
    .fill()
    .map((_, i) => i + 1);
  const onClick = (i) => {
    activePag.current = i;
    chageData(activePag.current * sort, (activePag.current + 1) * sort);
    settest(i);
  };


  //time picker modal
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    if (openModal) {
      timePickerModal({
        // mode: 12,
        width: "300px",
        time: { hour: 12, minute: 0 }
      });
    }
  }, [openModal]);

  return (
    <>      
      <div className="d-sm-flex mb-lg-4 mb-2">
        <Dropdown className="dropdown mb-2 ms-auto me-3">
          <Dropdown.Toggle
            to="#"
            className="i-false btn btn-primary btn-rounded light"
            
            aria-expanded="false"
          >
            <i className="las la-bolt scale5 me-2" />
            All Status
            <i className="las la-angle-down ms-3" />
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu dropdown-menu-center">
            <Dropdown.Item className="dropdown-item" to="#;">
              <span className="text-primary">On Delivery</span>
            </Dropdown.Item>
            <Dropdown.Item className="dropdown-item" to="#;">
              <span className="text-primary">New Order</span>
            </Dropdown.Item>
            <Dropdown.Item className="dropdown-item" to="#;">
              <span className="text-success">Delivery</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>       
        <div id="clock"></div>
          <input placeholder="Today" className="d-inline-block form-control date-button btn btn-primary light btn-rounded" onClick={() => setOpenModal(!openModal)} />          
        
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="table-responsive rounded card-table">
            <div id="orders" className="dataTables_wrapper no-footer">
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
                      aria-label="Order ID: activate to sort column descending"
                      style={{ width: 74 }}
                    >
                      Order ID
                    </th>
                    <th
                      className="sorting"
                      tabIndex={0}
                      aria-controls="example5"
                      rowSpan={1}
                      colSpan={1}
                      aria-label="Date: activate to sort column ascending"
                      style={{ width: 174 }}
                    >
                      Date
                    </th>
                    <th
                      className="sorting"
                      tabIndex={0}
                      aria-controls="example5"
                      rowSpan={1}
                      colSpan={1}
                      aria-label="Customer Name: activate to sort column ascending"
                      style={{ width: 133 }}
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
                      style={{ width: 193 }}
                    >
                      Location
                    </th>
                    <th
                      className="sorting"
                      tabIndex={0}
                      aria-controls="example5"
                      rowSpan={1}
                      colSpan={1}
                      aria-label="Amount: activate to sort column ascending"
                      style={{ width: 67 }}
                    >
                      Amount
                    </th>
                    <th
                      className="sorting"
                      tabIndex={0}
                      aria-controls="example5"
                      rowSpan={1}
                      colSpan={1}
                      aria-label="Status Order: activate to sort column ascending"
                      style={{ width: 108 }}
                    >
                      Status Order
                    </th>
                    <th
                      className="sorting"
                      tabIndex={0}
                      aria-controls="example5"
                      rowSpan={1}
                      colSpan={1}
                      aria-label=": activate to sort column ascending"
                      style={{ width: 28 }}
                    />
                  </tr>
                </thead>
                <tbody>
                  <tr
                    className="alert alert-dismissible border-0 odd"
                    role="row"
                  >
                    <td className="sorting_1">#5552311</td>
                    <td>26 March 2020, 12:42 AM</td>
                    <td>Olivia Shine</td>
                    <td>35 Station Road London</td>
                    <td>$82.46</td>
                    <td>
                      <span className="text-primary">
                        <svg
                          className="me-2"
                          width={12}
                          height={12}
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx={6} cy={6} r={6} fill="#EA7A9A" />
                        </svg>
                        On Delivery
                      </span>
                    </td>
                    <td>
                      <Dropdown className="dropdown">
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
                          <Dropdown.Item className="dropdown-item" to="#;">
                            <i className="las la-check-circle text-success me-3 scale5" />
                            Accept Order
                          </Dropdown.Item>
                          <Dropdown.Item
                            to="#;"
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
                    <td className="sorting_1">#5552322</td>
                    <td>26 March 2020, 12:42 AM</td>
                    <td>Samantha Bake</td>
                    <td>79 The Drive London</td>
                    <td>$22.18</td>
                    <td>
                      <span className="text-primary">
                        <svg
                          className="me-2"
                          width={12}
                          height={12}
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx={6} cy={6} r={6} fill="#EA7A9A" />
                        </svg>
                        On Delivery
                      </span>
                    </td>
                    <td>
                      <Dropdown className="dropdown">
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
                          <Dropdown.Item className="dropdown-item" to="#;">
                            <i className="las la-check-circle text-success me-3 scale5" />
                            Accept Order
                          </Dropdown.Item>
                          <Dropdown.Item
                            to="#;"
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
                    <td className="sorting_1">#5552323</td>
                    <td>26 March 2020, 12:42 AM</td>
                    <td>Veronica</td>
                    <td>21 King Street London</td>
                    <td>$74.92</td>
                    <td>
                      <span className="text-primary">New Order</span>
                    </td>
                    <td>
                      <Dropdown className="dropdown">
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
                          <Dropdown.Item className="dropdown-item" to="#;">
                            <i className="las la-check-circle text-success me-3 scale5" />
                            Accept Order
                          </Dropdown.Item>
                          <Dropdown.Item
                            to="#;"
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
                    <td className="sorting_1">#5552349</td>
                    <td>26 March 2020, 12:42 AM</td>
                    <td>Roberto Carlo</td>
                    <td>544 Manor Road London</td>
                    <td>$34.41</td>
                    <td>
                      <span className="text-success">Delivery</span>
                    </td>
                    <td>
                      <Dropdown className="dropdown">
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
                          <Dropdown.Item className="dropdown-item" to="#;">
                            <i className="las la-check-circle text-success me-3 scale5" />
                            Accept Order
                          </Dropdown.Item>
                          <Dropdown.Item
                            to="#;"
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
                    <td className="sorting_1">#5552351</td>
                    <td>26 March 2020, 12:42 AM</td>
                    <td>James WItcwicky</td>
                    <td>Corner Street 5th London</td>
                    <td>$164.52</td>
                    <td>
                      <span className="text-success">Delivery</span>
                    </td>
                    <td>
                      <Dropdown className="dropdown">
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
                          <Dropdown.Item className="dropdown-item" to="#;">
                            <i className="las la-check-circle text-success me-3 scale5" />
                            Accept Order
                          </Dropdown.Item>
                          <Dropdown.Item
                            to="#;"
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
                    <td className="sorting_1">#5552356</td>
                    <td>26 March 2020, 12:42 AM</td>
                    <td>Rendy Greenlee</td>
                    <td>32 The Green London</td>
                    <td>$44.99</td>
                    <td>
                      <span className="text-primary">New Order</span>
                    </td>
                    <td>
                      <Dropdown className="dropdown">
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
                          <Dropdown.Item className="dropdown-item" to="#;">
                            <i className="las la-check-circle text-success me-3 scale5" />
                            Accept Order
                          </Dropdown.Item>
                          <Dropdown.Item
                            to="#;"
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
                    <td className="sorting_1">#5552358</td>
                    <td>26 March 2020, 12:42 AM</td>
                    <td>David Horison</td>
                    <td>981 St. John’s Road London</td>
                    <td>$24.17</td>
                    <td>
                      <span className="text-primary">
                        <svg
                          className="me-2"
                          width={12}
                          height={12}
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx={6} cy={6} r={6} fill="#EA7A9A" />
                        </svg>
                        On Delivery
                      </span>
                    </td>
                    <td>
                      <Dropdown className="dropdown">
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
                          <Dropdown.Item className="dropdown-item" to="#;">
                            <i className="las la-check-circle text-success me-3 scale5" />
                            Accept Order
                          </Dropdown.Item>
                          <Dropdown.Item
                            to="#;"
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
                    <td className="sorting_1">#5552375</td>
                    <td>26 March 2020, 02:12 AM</td>
                    <td>Emilia Johanson</td>
                    <td>67 St. John’s Road London</td>
                    <td>$251.16</td>
                    <td>
                      <span className="text-primary">
                        <svg
                          className="me-2"
                          width={12}
                          height={12}
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx={6} cy={6} r={6} fill="#EA7A9A" />
                        </svg>
                        On Delivery
                      </span>
                    </td>
                    <td>
                      <Dropdown className="dropdown">
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
                          <Dropdown.Item className="dropdown-item" to="#;">
                            <i className="las la-check-circle text-success me-3 scale5" />
                            Accept Order
                          </Dropdown.Item>
                          <Dropdown.Item
                            to="#;"
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
                    <td className="sorting_1">#5552388</td>
                    <td>26 March 2020, 12:42 AM</td>
                    <td>Jessica Wong</td>
                    <td>11 Church Road London</td>
                    <td>$24.17</td>
                    <td>
                      <span className="text-primary">
                        <svg
                          className="me-2"
                          width={12}
                          height={12}
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx={6} cy={6} r={6} fill="#EA7A9A" />
                        </svg>
                        On Delivery
                      </span>
                    </td>
                    <td>
                      <Dropdown className="dropdown">
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
                          <Dropdown.Item className="dropdown-item" to="#;">
                            <i className="las la-check-circle text-success me-3 scale5" />
                            Accept Order
                          </Dropdown.Item>
                          <Dropdown.Item
                            to="#;"
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
                    <td className="sorting_1">#5552397</td>
                    <td>26 March 2020, 12:42 AM</td>
                    <td>Franky Sihotang</td>
                    <td>6 The Avenue London</td>
                    <td>$45.86</td>
                    <td>
                      <span className="text-success">Delivery</span>
                    </td>
                    <td>
                      <Dropdown className="dropdown">
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
                          <Dropdown.Item className="dropdown-item" to="#;">
                            <i className="las la-check-circle text-success me-3 scale5" />
                            Accept Order
                          </Dropdown.Item>
                          <Dropdown.Item
                            to="#;"
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
                  className="dataTables_paginate paging_simple_numbers "
                  id="example5_paginate"
                >
                  <Link
                    to="/orders"
                    onClick={() =>
                      activePag.current > 0 && onClick(activePag.current - 1)
                    }
                    className="paginate_button previous disabled "
                  >
                    Previous
                  </Link>
                  <span>
                    {paggination.map((number, i) => (
                      <Link
                        key={i}
                        to="/orders"
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
                    to="/orders"
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

export default Orders;
