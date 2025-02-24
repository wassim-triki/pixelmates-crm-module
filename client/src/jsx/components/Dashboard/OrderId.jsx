import React from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";

import OrderIdDada from "../Sego/Analytics/OrderIdDada";

//** Import Image */
import map from "../../../assets/images/map.png";
import profile from "../../../assets/images/profile/19.jpg";
import profile2 from "../../../assets/images/profile/18.jpg";

function OrderId() {
  return (
    <>
     
      <Dropdown className="dropdown mb-md-4 mb-2 text-end">
        <Dropdown.Toggle className="btn btn-success">
          <svg
            width={22}
            className="me-2"
            height={28}
            viewBox="0 0 22 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.16647 27.9558C9.25682 27.9856 9.34946 28.0001 9.44106 28.0001C9.71269 28.0001 9.97541 27.8732 10.1437 27.6467L21.5954 12.2248C21.7926 11.9594 21.8232 11.6055 21.6746 11.31C21.526 11.0146 21.2236 10.8282 20.893 10.8282H13.1053V0.874999C13.1053 0.495358 12.8606 0.15903 12.4993 0.042327C12.1381 -0.0743215 11.7428 0.0551786 11.5207 0.363124L0.397278 15.7849C0.205106 16.0514 0.178364 16.403 0.327989 16.6954C0.477614 16.9878 0.77845 17.1718 1.10696 17.1718H8.56622V27.125C8.56622 27.5024 8.80816 27.8373 9.16647 27.9558ZM2.81693 15.4218L11.3553 3.58389V11.7032C11.3553 12.1865 11.7471 12.5782 12.2303 12.5782H19.1533L10.3162 24.479V16.2968C10.3162 15.8136 9.92444 15.4218 9.44122 15.4218H2.81693Z"
              fill="#fff"
            />
          </svg>
          <span>ON DELIVERY</span>
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu dropdown-menu-left">
          <Dropdown.Item className="dropdown-item" to="#">
            A To Z List
          </Dropdown.Item>
          <Dropdown.Item className="dropdown-item" to="#">
            Z To A List
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <div className="row">
        <div className="col-xl-9 col-xxl-8">
          <div className="row">
            <div className="col-xl-12">
              <div className="card">
                <div className="card-body">
                  <div className="map-bx">
                    <img src={map} alt="map" />
                    <div className="map-content">
                      <h4 className="fs-20 text-black">Track Orders</h4>
                      <span className="fs-12">Lorem ipsum dolor sit</span>
                    </div>
                  </div>
                  <h4 className="fs-20 text-black mb-4">Delivery by</h4>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-md-0 mb-4">
                        <img
                          src={profile2}
                          alt="profile2"
                          className="rounded-circle me-3"
                          width={68}
                        />
                        <div>
                          <h4 className="fs-20 text-black">
                            Geovanny Van Houten
                          </h4>
                          <span className="fs-14">ID 412455</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="row align-items-center">
                        <div className="col-xl-6 col-xxl-12 col-lg-6 mb-3">
                          <div className="d-flex">
                            <svg
                              className="me-3 min-w32"
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M22.9993 17.4712V20.7831C23.0006 21.0906 22.9375 21.3949 22.814 21.6766C22.6906 21.9583 22.5096 22.2112 22.2826 22.419C22.0556 22.6269 21.7876 22.7851 21.4958 22.8836C21.2039 22.9821 20.8947 23.0187 20.5879 22.991C17.1841 22.6219 13.9145 21.4611 11.0418 19.6019C8.36914 17.9069 6.10319 15.6455 4.40487 12.9781C2.53545 10.0981 1.37207 6.81909 1.00898 3.40674C0.981336 3.10146 1.01769 2.79378 1.11572 2.50329C1.21376 2.2128 1.37132 1.94586 1.57839 1.71947C1.78546 1.49308 2.03749 1.31221 2.31843 1.18836C2.59938 1.06451 2.90309 1.0004 3.21023 1.00011H6.52869C7.06551 0.994834 7.58594 1.18456 7.99297 1.53391C8.4 1.88326 8.66586 2.36841 8.74099 2.89892C8.88106 3.9588 9.14081 4.99946 9.5153 6.00106C9.66413 6.39619 9.69634 6.82562 9.60812 7.23847C9.51989 7.65131 9.31494 8.03026 9.01753 8.33042L7.61272 9.73245C9.18739 12.4963 11.4803 14.7847 14.2496 16.3562L15.6545 14.9542C15.9552 14.6574 16.3349 14.4528 16.7486 14.3648C17.1622 14.2767 17.5925 14.3089 17.9884 14.4574C18.992 14.8312 20.0348 15.0904 21.0967 15.2302C21.6341 15.3058 22.1248 15.576 22.4756 15.9892C22.8264 16.4024 23.0128 16.9298 22.9993 17.4712Z"
                                stroke="#566069"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span className="text-black font-w500">
                              +51 5125 626 77
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-6 col-xxl-12 col-lg-6 mb-3">
                          <div className="d-flex">
                            <svg
                              className="me-3 min-w32"
                              width={32}
                              height={32}
                              viewBox="0 0 32 32"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M28.0005 13.3335C28.0005 22.6668 16.0005 30.6668 16.0005 30.6668C16.0005 30.6668 4.00049 22.6668 4.00049 13.3335C4.00049 10.1509 5.26477 7.09865 7.51521 4.84821C9.76564 2.59778 12.8179 1.3335 16.0005 1.3335C19.1831 1.3335 22.2353 2.59778 24.4858 4.84821C26.7362 7.09865 28.0005 10.1509 28.0005 13.3335Z"
                                stroke="#3E4954"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M16.0005 17.3335C18.2096 17.3335 20.0005 15.5426 20.0005 13.3335C20.0005 11.1244 18.2096 9.3335 16.0005 9.3335C13.7913 9.3335 12.0005 11.1244 12.0005 13.3335C12.0005 15.5426 13.7913 17.3335 16.0005 17.3335Z"
                                stroke="#3E4954"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span className="text-black font-w500">
                              Long Horn St. Avenue 351636 London
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <OrderIdDada />
          </div>
        </div>
        <div className="col-xl-3 col-xxl-4">
          <div className="row">
            <div className="col-xl-12 col-sm-6">
              <div className="card">
                <div className="card-body text-center">
                  <img
                    src={profile}
                    alt="profile"
                    width={130}
                    className="rounded-circle mb-4"
                  />
                  <h3 className="fs-18 text-black font-w600 mb-3">
                    James Witwitcky
                  </h3>
                  <Link
                    to="#"
                    className="btn btn-primary light btn-sm btn-rounded"
                  >
                    Customer
                  </Link>
                </div>
                <div className="card-body bg-light rounded-top">
                  <h3 className="fs-18 text-black font-w600">Note Order</h3>
                  <p className="fs-14">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.{" "}
                  </p>
                </div>
                <div className="card-footer d-flex align-items-center gradient-bg">
                  <span className="p-3 me-3 d-inline-block rounded-circle bg-white">
                    <svg
                      width={28}
                      height={28}
                      viewBox="0 0 28 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.04863 18.6668H5.83366C5.18937 18.6668 4.66699 19.1886 4.66699 19.8335C4.66699 20.4784 5.18937 21.0002 5.83366 21.0002H6.04871C6.53185 22.3552 7.81473 23.3335 9.33366 23.3335C10.8526 23.3335 12.1355 22.3552 12.6187 21.0002H15.382C15.8652 22.3552 17.1481 23.3335 18.667 23.3335C20.1926 23.3335 21.4796 22.3463 21.9577 20.9819C23.3498 20.8887 24.511 19.915 24.8176 18.5347L26.2697 11.9984C26.4782 11.0618 26.2532 10.0946 25.6522 9.34603C25.0512 8.59635 24.1562 8.16683 23.1958 8.16683H21.6708C21.5538 7.73054 21.3433 7.3191 21.0453 6.96257C20.4455 6.24479 19.5648 5.8335 18.6294 5.8335H7.00033C6.35604 5.8335 5.83366 6.35531 5.83366 7.00016C5.83366 7.64502 6.35604 8.16683 7.00033 8.16683H18.6294C18.9609 8.16683 19.1637 8.35026 19.2555 8.45964C19.3466 8.56901 19.4907 8.80029 19.4326 9.125L18.1096 16.3898C16.8387 16.5953 15.8044 17.482 15.382 18.6668H12.6187C12.1355 17.3117 10.8526 16.3335 9.33366 16.3335C7.81473 16.3335 6.53178 17.3117 6.04863 18.6668ZM23.8321 10.8055C23.9238 10.9194 24.0657 11.1598 23.9922 11.4925L22.5401 18.0288C22.4722 18.3337 22.241 18.5553 21.9518 18.6314C21.6688 17.8666 21.1205 17.221 20.4053 16.8071L21.554 10.5002H23.1958C23.5365 10.5002 23.7404 10.6916 23.8321 10.8055ZM18.667 18.6668C18.741 18.6668 18.8157 18.6725 18.8658 18.6805C19.4264 18.7899 19.8337 19.2741 19.8337 19.8335C19.8337 20.4772 19.3101 21.0002 18.667 21.0002C18.0238 21.0002 17.5003 20.4772 17.5003 19.8335C17.5003 19.1898 18.0238 18.6668 18.667 18.6668ZM9.33366 18.6668C9.97681 18.6668 10.5003 19.1898 10.5003 19.8335C10.5003 20.4772 9.97681 21.0002 9.33366 21.0002C8.69051 21.0002 8.16699 20.4772 8.16699 19.8335C8.16699 19.1898 8.69051 18.6668 9.33366 18.6668Z"
                        fill="#EA7A9A"
                      />
                      <path
                        d="M4.66667 12.8333H9.33333C9.97762 12.8333 10.5 12.3115 10.5 11.6667C10.5 11.0218 9.97762 10.5 9.33333 10.5H4.66667C4.02238 10.5 3.5 11.0218 3.5 11.6667C3.5 12.3115 4.02238 12.8333 4.66667 12.8333Z"
                        fill="#EA7A9A"
                      />
                      <path
                        d="M2.33366 16.3333H5.83366C6.47795 16.3333 7.00033 15.8115 7.00033 15.1667C7.00033 14.5218 6.47795 14 5.83366 14H2.33366C1.68937 14 1.16699 14.5218 1.16699 15.1667C1.16699 15.8115 1.68937 16.3333 2.33366 16.3333Z"
                        fill="#EA7A9A"
                      />
                      <path
                        d="M3.49967 8.16683C4.144 8.16683 4.66634 7.64449 4.66634 7.00016C4.66634 6.35583 4.144 5.8335 3.49967 5.8335C2.85534 5.8335 2.33301 6.35583 2.33301 7.00016C2.33301 7.64449 2.85534 8.16683 3.49967 8.16683Z"
                        fill="#EA7A9A"
                      />
                      <path
                        d="M2.33366 20.9998C2.97799 20.9998 3.50033 20.4775 3.50033 19.8332C3.50033 19.1888 2.97799 18.6665 2.33366 18.6665C1.68933 18.6665 1.16699 19.1888 1.16699 19.8332C1.16699 20.4775 1.68933 20.9998 2.33366 20.9998Z"
                        fill="#EA7A9A"
                      />
                    </svg>
                  </span>
                  <span className="text-white font-w600">
                    6 The Avenue, London EC50 4GN
                  </span>
                </div>
              </div>
            </div>
            <div className="col-xl-12 col-sm-6">
              <div className="card">
                <div className="card-header border-0 pb-0">
                  <h4 className="fs-20 font-w600">History</h4>
                </div>
                <div className="card-body pb-0">
                  <div className="widget-timeline-icon2">
                    <ul className="timeline">
                      <li>
                        <div className="icon bg-dark" />
                        <Link className="timeline-panel text-muted" to="#">
                          <h4 className="mb-2 ">Order Delivered</h4>
                          <p className="fs-15 mb-0 ">
                            Sat, 23 Jul 2020, 01:24 PM
                          </p>
                        </Link>
                      </li>
                      <li>
                        <div className="icon bg-primary" />
                        <Link className="timeline-panel text-muted" to="#">
                          <h4 className="mb-2">On Delivery</h4>
                          <p className="fs-15 mb-0 ">
                            Sat, 23 Jul 2020, 01:24 PM
                          </p>
                        </Link>
                      </li>
                      <li>
                        <div className="icon bg-primary" />
                        <Link className="timeline-panel text-muted" to="#">
                          <h4 className="mb-2">Payment Success</h4>
                          <p className="fs-15 mb-0 ">
                            Fri, 22 Jul 2020, 10:44 AM
                          </p>
                        </Link>
                      </li>
                      <li>
                        <div className="icon bg-primary las" />
                        <Link className="timeline-panel text-muted" to="#">
                          <h4 className="mb-2">Order Created</h4>
                          <p className="fs-15 mb-0 ">
                            Thu, 21 Jul 2020, 11:49 AM
                          </p>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderId;
