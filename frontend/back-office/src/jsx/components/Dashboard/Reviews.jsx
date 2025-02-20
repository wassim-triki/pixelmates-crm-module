import React from "react";
import { Link } from "react-router-dom";
import { Dropdown, Nav, Tab } from "react-bootstrap";
//** Import Image */
import avatar1 from "../../../assets/images/avatar/1.jpg";
import avatar2 from "../../../assets/images/avatar/2.jpg";
import avatar3 from "../../../assets/images/avatar/3.jpg";
import avatar4 from "../../../assets/images/avatar/4.jpg";
import avatar5 from "../../../assets/images/avatar/5.jpg";
import ReviewSlider from "../Sego/Revirew/ReviewSlider";

function Reviews() {
  return (
    <>
      
      <Tab.Container defaultActiveKey="all">
        <div className="d-sm-flex d-block align-items-end">
          <div className="card-action card-tabs mb-sm-4 mb-3 me-auto">
            <Nav as="ul" className="nav nav-tabs" role="tablist">
              <Nav.Item as="li" className="nav-item">
                <Nav.Link className="nav-link" eventKey="all" role="tab">
                  All
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li" className="nav-item">
                <Nav.Link className="nav-link" eventKey="published" role="tab">
                  Published
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li" className="nav-item">
                <Nav.Link className="nav-link" eventKey="today" role="tab">
                  Deleted
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
          <Dropdown className="dropdown custom-dropdown mb-4">
            <Dropdown.Toggle
              className="i-false btn btn-sm btn-primary light d-flex align-items-center svg-btn"
            >
              <svg
                width={28}
                height={28}
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g>
                  <path
                    d="M22.4281 2.856H21.8681V1.428C21.8681 0.56 21.2801 0 20.4401 0C19.6001 0 19.0121 0.56 19.0121 1.428V2.856H9.71606V1.428C9.71606 0.56 9.15606 0 8.28806 0C7.42006 0 6.86006 0.56 6.86006 1.428V2.856H5.57206C2.85606 2.856 0.560059 5.152 0.560059 7.868V23.016C0.560059 25.732 2.85606 28.028 5.57206 28.028H22.4281C25.1441 28.028 27.4401 25.732 27.4401 23.016V7.868C27.4401 5.152 25.1441 2.856 22.4281 2.856ZM5.57206 5.712H22.4281C23.5761 5.712 24.5841 6.72 24.5841 7.868V9.856H3.41606V7.868C3.41606 6.72 4.42406 5.712 5.57206 5.712ZM22.4281 25.144H5.57206C4.42406 25.144 3.41606 24.136 3.41606 22.988V12.712H24.5561V22.988C24.5841 24.136 23.5761 25.144 22.4281 25.144Z"
                    fill="#2F4CDD"
                  />
                </g>
              </svg>
              <div className="text-start ms-3">
                <span className="d-block fs-16">Filter Periode</span>
                <small className="d-block fs-13">
                  4 June 2020 - 4 July 2020
                </small>
              </div>
              <i className="fa fa-angle-down scale5 ms-3" />
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
              <Dropdown.Item className="dropdown-item" to="#">
                4 June 2020 - 4 July 2020
              </Dropdown.Item>
              <Dropdown.Item className="dropdown-item" to="#">
                5 july 2020 - 4 Aug 2020
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="row">
          <div className="col-xl-9 col-xxl-8">
            <div className="row">
              <div className="col-xl-12">
                <Tab.Content className="tab-content">
                  <Tab.Pane eventKey="all" className="tab-pane fade" id="All">
                    <div className="card">
                      <div className="card-header border-0 pb-0 d-sm-flex d-block">
                        <div>
                          <h4 className="card-title mb-1 fs-28 font-w600">
                            Recent Review
                          </h4>
                          <p className="mb-0">
                            Here is customer review about your restaurant{" "}
                          </p>
                        </div>
                        <Dropdown className="dropdown mt-sm-0 mt-3">
                          <Dropdown.Toggle
                            type="button"
                            className="btn btn-primary dropdown-toggle light fs-14"
                            data-toggle="dropdown"
                          >
                            Latest
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="dropdown-menu">
                            <Dropdown.Item className="dropdown-item" to="#">
                              Latest
                            </Dropdown.Item>
                            <Dropdown.Item className="dropdown-item" to="#">
                              OLD
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                      <div className="card-body p-0">
                        <div className="media review-box">
                          <img
                            className="me-3 img-fluid btn-rounded"
                            width={55}
                            src={avatar1}
                            alt="avatar1"
                          />
                          <div className="media-body">
                            <h4 className="mt-0 mb-0 text-black">
                              Glee Smiley
                            </h4>
                            <ul className="review-meta mb-3 d-block d-sm-flex align-items-center">
                              <li className="me-3">
                                <small>Head Marketing</small>
                              </li>
                              <li className="me-3">
                                <small>24 June 2020</small>
                              </li>
                              <li className="ms-auto ms-auto mt-sm-0 mt-3">
                                <span className="badge badge-rounded bg-primary font-w500 ">
                                  Excelent
                                </span>
                              </li>
                            </ul>
                            <p className="mb-3 me-1">
                              We recently had dinner with friends at David CC
                              and we all walked away with a great experience.
                              Good food, pleasant environment, personal
                              attention through all the evening. Thanks to the
                              team and we will be back!
                            </p>
                          </div>
                          <div className="media-footer align-self-center">
                            <div className="star-review text-md-center">
                              <span className="text-secondary me-1">4.5</span>
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-gray me-1" />
                            </div>
                          </div>
                        </div>
                        <div className="media review-box">
                          <img
                            className="me-3 img-fluid btn-rounded"
                            width={55}
                            src={avatar2}
                            alt="avatar2"
                          />
                          <div className="media-body">
                            <h4 className="mt-0 mb-0 text-black">
                              Samuel Hawkins
                            </h4>
                            <ul className="review-meta mb-3 d-block d-sm-flex align-items-center">
                              <li className="me-3">
                                <small>Head Marketing</small>
                              </li>
                              <li className="me-3">
                                <small>24 June 2020</small>
                              </li>
                              <li className="ms-auto ms-auto mt-sm-0 mt-3">
                                <span className="badge badge-rounded bg-primary font-w500 ">
                                  Recomended
                                </span>
                                <span className="badge badge-rounded bg-primary font-w500  ms-1">
                                  Great
                                </span>
                              </li>
                            </ul>
                            <p className="mb-3 me-1">
                              We recently had dinner with friends at David CC
                              and we all walked away with a great experience.
                              Good food, pleasant environment, personal
                              attention through all the evening. Thanks to the
                              team and we will be back!
                            </p>
                          </div>
                          <div className="media-footer align-self-center">
                            <div className="star-review text-md-center">
                              <span className="text-secondary me-1">4.8</span>
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-gray me-1" />
                            </div>
                          </div>
                        </div>
                        <div className="media review-box">
                          <img
                            className="me-3 img-fluid btn-rounded"
                            width={55}
                            src={avatar3}
                            alt="avatar3"
                          />
                          <div className="media-body">
                            <h4 className="mt-0 mb-0 text-black">
                              Dicky Sitompul
                            </h4>
                            <ul className="review-meta mb-3 d-block d-sm-flex align-items-center">
                              <li className="me-3">
                                <small>Head Marketing</small>
                              </li>
                              <li className="me-3">
                                <small>24 June 2020</small>
                              </li>
                              <li className="ms-auto ms-auto mt-sm-0 mt-3">
                                <span className="badge badge-rounded bg-primary font-w500 ">
                                  Excelent
                                </span>
                              </li>
                            </ul>
                            <p className="mb-3 me-1">
                              We recently had dinner with friends at David CC
                              and we all walked away with a great experience.
                              Good food, pleasant environment, personal
                              attention through all the evening. Thanks to the
                              team and we will be back!
                            </p>
                          </div>
                          <div className="media-footer align-self-center">
                            <div className="star-review text-md-center">
                              <span className="text-secondary me-1">4.0</span>
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-gray me-1" />
                            </div>
                          </div>
                        </div>
                        <div className="media review-box">
                          <img
                            className="me-3 img-fluid btn-rounded"
                            width={55}
                            src={avatar4}
                            alt="avatar4"
                          />
                          <div className="media-body">
                            <h4 className="mt-0 mb-0 text-black">
                              Dracule Mihawk
                            </h4>
                            <ul className="review-meta mb-3 d-block d-sm-flex align-items-center">
                              <li className="me-3">
                                <small>Head Marketing</small>
                              </li>
                              <li className="me-3">
                                <small>24 June 2020</small>
                              </li>
                            </ul>
                            <p className="mb-3 me-1">
                              We recently had dinner with friends at David CC
                              and we all walked away with a great experience.
                              Good food, pleasant environment, personal
                              attention through all the evening. Thanks to the
                              team and we will be back!
                            </p>
                          </div>
                          <div className="media-footer align-self-center">
                            <div className="star-review text-md-center">
                              <span className="text-secondary me-1">2.0</span>
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-gray me-1" />
                              <i className="fa fa-star text-gray me-1" />
                              <i className="fa fa-star text-gray me-1" />
                            </div>
                          </div>
                        </div>
                        <div className="media review-box">
                          <img
                            className="me-3 img-fluid btn-rounded"
                            width={55}
                            src={avatar5}
                            alt="avatar5"
                          />
                          <div className="media-body">
                            <h4 className="mt-0 mb-0 text-black">
                              Samuel Hawkins
                            </h4>
                            <ul className="review-meta mb-3 d-block d-sm-flex align-items-center">
                              <li className="me-3">
                                <small>Head Marketing</small>
                              </li>
                              <li className="me-3">
                                <small>24 June 2020</small>
                              </li>
                              <li className="ms-auto ms-auto mt-sm-0 mt-3">
                                <span className="badge badge-rounded bg-primary font-w500 ">
                                  Delcious
                                </span>
                                <span className="badge badge-rounded bg-primary font-w500  ms-1">
                                  Excelent
                                </span>
                                <span className="badge badge-rounded bg-primary font-w500  ms-1">
                                  Good Services
                                </span>
                              </li>
                            </ul>
                            <p className="mb-3 me-1">
                              We recently had dinner with friends at David CC
                              and we all walked away with a great experience.
                              Good food, pleasant environment, personal
                              attention through all the evening. Thanks to the
                              team and we will be back!
                            </p>
                          </div>
                          <div className="media-footer align-self-center">
                            <div className="star-review text-md-center">
                              <span className="text-secondary me-1">3.0</span>
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-gray me-1" />
                              <i className="fa fa-star text-gray me-1" />
                            </div>
                          </div>
                        </div>
                        <div className="media review-box">
                          <img
                            className="me-3 img-fluid btn-rounded"
                            width={55}
                            src={avatar1}
                            alt="avatar1"
                          />
                          <div className="media-body">
                            <h4 className="mt-0 mb-0 text-black">Sanji Lee</h4>
                            <ul className="review-meta mb-3 d-block d-sm-flex align-items-center">
                              <li className="me-3">
                                <small>Head Marketing</small>
                              </li>
                              <li className="me-3">
                                <small>24 June 2020</small>
                              </li>
                              <li className="ms-auto ms-auto mt-sm-0 mt-3">
                                <span className="badge badge-rounded bg-primary font-w500 ">
                                  Excelent
                                </span>
                              </li>
                            </ul>
                            <p className="mb-3 me-1">
                              We recently had dinner with friends at David CC
                              and we all walked away with a great experience.
                              Good food, pleasant environment, personal
                              attention through all the evening. Thanks to the
                              team and we will be back!
                            </p>
                          </div>
                          <div className="media-footer align-self-center">
                            <div className="star-review text-md-center">
                              <span className="text-secondary me-1">1.0</span>
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-gray me-1" />
                              <i className="fa fa-star text-gray me-1" />
                              <i className="fa fa-star text-gray me-1" />
                              <i className="fa fa-star text-gray me-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-footer border-0 text-center">
                        <nav>
                          <ul className="pagination style-1 mb-0">
                            <li className="page-item page-indicator">
                              <Link className="page-link" to="#">
                                <i className="la la-angle-left" />
                              </Link>
                            </li>
                            <li>
                              <ul>
                                <li className="page-item active">
                                  <Link className="page-link" to="#">
                                    1
                                  </Link>
                                </li>
                                <li className="page-item">
                                  <Link className="page-link" to="#">
                                    2
                                  </Link>
                                </li>
                                <li className="page-item">
                                  <Link className="page-link" to="#">
                                    3
                                  </Link>
                                </li>
                                <li className="page-item">
                                  <Link className="page-link" to="#">
                                    4
                                  </Link>
                                </li>
                              </ul>
                            </li>
                            <li className="page-item page-indicator">
                              <Link className="page-link" to="#">
                                <i className="la la-angle-right" />
                              </Link>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane
                    eventKey="published"
                    className="tab-pane fade"
                    id="Published"
                  >
                    <div className="card">
                      <div className="card-header border-0 pb-0 d-sm-flex d-block">
                        <div>
                          <h4 className="card-title mb-1 fs-28 font-w600">
                            Published
                          </h4>
                          <p className="mb-0">
                            Here is customer review about your restaurant{" "}
                          </p>
                        </div>
                        <Dropdown className="dropdown mt-sm-0 mt-3">
                          <Dropdown.Toggle
                            type="button"
                            className="i-false btn btn-primary dropdown-toggle light fs-14"
                            data-toggle="dropdown"
                            
                          >
                            Latest
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="dropdown-menu">
                            <Dropdown.Item className="dropdown-item" to="#">
                              Latest
                            </Dropdown.Item>
                            <Dropdown.Item className="dropdown-item" to="#">
                              OLD
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                      <div className="card-body p-0">
                        <div className="media review-box">
                          <img
                            className="me-3 img-fluid btn-rounded"
                            width={55}
                            src={avatar1}
                            alt="avatar1"
                          />
                          <div className="media-body">
                            <h4 className="mt-0 mb-0 text-black">
                              Glee Smiley
                            </h4>
                            <ul className="review-meta mb-3 d-block d-sm-flex align-items-center">
                              <li className="me-3">
                                <small>Head Marketing</small>
                              </li>
                              <li className="me-3">
                                <small>24 June 2020</small>
                              </li>
                              <li className="ms-auto ms-auto mt-sm-0 mt-3">
                                <span className="badge badge-rounded bg-primary font-w500 ">
                                  Excelent
                                </span>
                              </li>
                            </ul>
                            <p className="mb-3 me-1">
                              We recently had dinner with friends at David CC
                              and we all walked away with a great experience.
                              Good food, pleasant environment, personal
                              attention through all the evening. Thanks to the
                              team and we will be back!
                            </p>
                          </div>
                          <div className="media-footer align-self-center">
                            <div className="star-review text-md-center">
                              <span className="text-secondary me-1">4.5</span>
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-gray me-1" />
                            </div>
                          </div>
                        </div>
                        <div className="media review-box">
                          <img
                            className="me-3 img-fluid btn-rounded"
                            width={55}
                            src={avatar2}
                            alt="avatar2"
                          />
                          <div className="media-body">
                            <h4 className="mt-0 mb-0 text-black">
                              Samuel Hawkins
                            </h4>
                            <ul className="review-meta mb-3 d-block d-sm-flex align-items-center">
                              <li className="me-3">
                                <small>Head Marketing</small>
                              </li>
                              <li className="me-3">
                                <small>24 June 2020</small>
                              </li>
                              <li className="ms-auto ms-auto mt-sm-0 mt-3">
                                <span className="badge badge-rounded bg-primary font-w500 ">
                                  Recomended
                                </span>
                                <span className="badge badge-rounded bg-primary font-w500  ms-1">
                                  Great
                                </span>
                              </li>
                            </ul>
                            <p className="mb-3 me-1">
                              We recently had dinner with friends at David CC
                              and we all walked away with a great experience.
                              Good food, pleasant environment, personal
                              attention through all the evening. Thanks to the
                              team and we will be back!
                            </p>
                          </div>
                          <div className="media-footer align-self-center">
                            <div className="star-review text-md-center">
                              <span className="text-secondary me-1">4.8</span>
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-gray me-1" />
                            </div>
                          </div>
                        </div>
                        <div className="media review-box">
                          <img
                            className="me-3 img-fluid btn-rounded"
                            width={55}
                            src={avatar3}
                            alt="avatar3"
                          />
                          <div className="media-body">
                            <h4 className="mt-0 mb-0 text-black">
                              Dicky Sitompul
                            </h4>
                            <ul className="review-meta mb-3 d-block d-sm-flex align-items-center">
                              <li className="me-3">
                                <small>Head Marketing</small>
                              </li>
                              <li className="me-3">
                                <small>24 June 2020</small>
                              </li>
                              <li className="ms-auto ms-auto mt-sm-0 mt-3">
                                <span className="badge badge-rounded bg-primary font-w500 ">
                                  Excelent
                                </span>
                              </li>
                            </ul>
                            <p className="mb-3 me-1">
                              We recently had dinner with friends at David CC
                              and we all walked away with a great experience.
                              Good food, pleasant environment, personal
                              attention through all the evening. Thanks to the
                              team and we will be back!
                            </p>
                          </div>
                          <div className="media-footer align-self-center">
                            <div className="star-review text-md-center">
                              <span className="text-secondary me-1">4.0</span>
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-gray me-1" />
                            </div>
                          </div>
                        </div>
                        <div className="media review-box">
                          <img
                            className="me-3 img-fluid btn-rounded"
                            width={55}
                            src={avatar1}
                            alt="avatar1"
                          />
                          <div className="media-body">
                            <h4 className="mt-0 mb-0 text-black">Sanji Lee</h4>
                            <ul className="review-meta mb-3 d-block d-sm-flex align-items-center">
                              <li className="me-3">
                                <small>Head Marketing</small>
                              </li>
                              <li className="me-3">
                                <small>24 June 2020</small>
                              </li>
                              <li className="ms-auto ms-auto mt-sm-0 mt-3">
                                <span className="badge badge-rounded bg-primary font-w500 ">
                                  Excelent
                                </span>
                              </li>
                            </ul>
                            <p className="mb-3 me-1">
                              We recently had dinner with friends at David CC
                              and we all walked away with a great experience.
                              Good food, pleasant environment, personal
                              attention through all the evening. Thanks to the
                              team and we will be back!
                            </p>
                          </div>
                          <div className="media-footer align-self-center">
                            <div className="star-review text-md-center">
                              <span className="text-secondary me-1">1.0</span>
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-gray me-1" />
                              <i className="fa fa-star text-gray me-1" />
                              <i className="fa fa-star text-gray me-1" />
                              <i className="fa fa-star text-gray me-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-footer border-0 text-center py-4">
                        <nav>
                          <ul className="pagination style-1 mb-0">
                            <li className="page-item page-indicator">
                              <Link className="page-link" to="#">
                                <i className="la la-angle-left" />
                              </Link>
                            </li>
                            <li>
                              <ul>
                                <li className="page-item active">
                                  <Link className="page-link" to="#">
                                    1
                                  </Link>
                                </li>
                                <li className="page-item">
                                  <Link className="page-link" to="#">
                                    2
                                  </Link>
                                </li>
                                <li className="page-item">
                                  <Link className="page-link" to="#">
                                    3
                                  </Link>
                                </li>
                                <li className="page-item">
                                  <Link className="page-link" to="#">
                                    4
                                  </Link>
                                </li>
                              </ul>
                            </li>
                            <li className="page-item page-indicator">
                              <Link className="page-link" to="#">
                                <i className="la la-angle-right" />
                              </Link>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane
                    eventKey="today"
                    className="tab-pane fade"
                    id="Today"
                  >
                    <div className="card">
                      <div className="card-header border-0 pb-0 d-sm-flex d-block">
                        <div>
                          <h4 className="card-title mb-1 fs-28 font-w600">
                            Today
                          </h4>
                          <p className="mb-0">
                            Here is customer review about your restaurant{" "}
                          </p>
                        </div>
                        <Dropdown className="dropdown mt-sm-0 mt-3">
                          <Dropdown.Toggle
                            type="button"
                            className="i-false btn btn-primary dropdown-toggle light fs-14"
                            data-toggle="dropdown"
                            
                          >
                            Latest
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="dropdown-menu">
                            <Dropdown.Item className="dropdown-item" to="#">
                              Latest
                            </Dropdown.Item>
                            <Dropdown.Item className="dropdown-item" to="#">
                              OLD
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                      <div className="card-body p-0">
                        <div className="media review-box">
                          <img
                            className="me-3 img-fluid btn-rounded"
                            width={55}
                            src={avatar1}
                            alt="avatar1"
                          />
                          <div className="media-body">
                            <h4 className="mt-0 mb-0 text-black">
                              Glee Smiley
                            </h4>
                            <ul className="review-meta mb-3 d-block d-sm-flex align-items-center">
                              <li className="me-3">
                                <small>Head Marketing</small>
                              </li>
                              <li className="me-3">
                                <small>24 June 2020</small>
                              </li>
                              <li className="ms-auto ms-auto mt-sm-0 mt-3">
                                <span className="badge badge-rounded bg-primary font-w500 ">
                                  Excelent
                                </span>
                              </li>
                            </ul>
                            <p className="mb-3 me-1">
                              We recently had dinner with friends at David CC
                              and we all walked away with a great experience.
                              Good food, pleasant environment, personal
                              attention through all the evening. Thanks to the
                              team and we will be back!
                            </p>
                          </div>
                          <div className="media-footer align-self-center">
                            <div className="star-review text-md-center">
                              <span className="text-secondary me-1">4.5</span>
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-gray me-1" />
                            </div>
                          </div>
                        </div>
                        <div className="media review-box">
                          <img
                            className="me-3 img-fluid btn-rounded"
                            width={55}
                            src={avatar2}
                            alt="avatar2"
                          />
                          <div className="media-body">
                            <h4 className="mt-0 mb-0 text-black">
                              Samuel Hawkins
                            </h4>
                            <ul className="review-meta mb-3 d-block d-sm-flex align-items-center">
                              <li className="me-3">
                                <small>Head Marketing</small>
                              </li>
                              <li className="me-3">
                                <small>24 June 2020</small>
                              </li>
                              <li className="ms-auto ms-auto mt-sm-0 mt-3">
                                <span className="badge badge-rounded bg-primary font-w500 ">
                                  Recomended
                                </span>
                                <span className="badge badge-rounded bg-primary font-w500  ms-1">
                                  Great
                                </span>
                              </li>
                            </ul>
                            <p className="mb-3 me-1">
                              We recently had dinner with friends at David CC
                              and we all walked away with a great experience.
                              Good food, pleasant environment, personal
                              attention through all the evening. Thanks to the
                              team and we will be back!
                            </p>
                          </div>
                          <div className="media-footer align-self-center">
                            <div className="star-review text-md-center">
                              <span className="text-secondary me-1">4.8</span>
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-gray me-1" />
                            </div>
                          </div>
                        </div>
                        <div className="media review-box">
                          <img
                            className="me-3 img-fluid btn-rounded"
                            width={55}
                            src={avatar1}
                            alt="avatar1"
                          />
                          <div className="media-body">
                            <h4 className="mt-0 mb-0 text-black">Sanji Lee</h4>
                            <ul className="review-meta mb-3 d-block d-sm-flex align-items-center">
                              <li className="me-3">
                                <small>Head Marketing</small>
                              </li>
                              <li className="me-3">
                                <small>24 June 2020</small>
                              </li>
                              <li className="ms-auto ms-auto mt-sm-0 mt-3">
                                <span className="badge badge-rounded bg-primary font-w500 ">
                                  Excelent
                                </span>
                              </li>
                            </ul>
                            <p className="mb-3 me-1">
                              We recently had dinner with friends at David CC
                              and we all walked away with a great experience.
                              Good food, pleasant environment, personal
                              attention through all the evening. Thanks to the
                              team and we will be back!
                            </p>
                          </div>
                          <div className="media-footer align-self-center">
                            <div className="star-review text-md-center">
                              <span className="text-secondary me-1">1.0</span>
                              <i className="fa fa-star text-primary me-1" />
                              <i className="fa fa-star text-gray me-1" />
                              <i className="fa fa-star text-gray me-1" />
                              <i className="fa fa-star text-gray me-1" />
                              <i className="fa fa-star text-gray me-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-footer border-0 text-center py-4">
                        <nav>
                          <ul className="pagination style-1 mb-0">
                            <li className="page-item page-indicator">
                              <Link className="page-link" to="#">
                                <i className="la la-angle-left" />
                              </Link>
                            </li>
                            <li>
                              <ul>
                                <li className="page-item active">
                                  <Link className="page-link" to="#">
                                    1
                                  </Link>
                                </li>
                                <li className="page-item">
                                  <Link className="page-link" to="#">
                                    2
                                  </Link>
                                </li>
                                <li className="page-item">
                                  <Link className="page-link" to="#">
                                    3
                                  </Link>
                                </li>
                                <li className="page-item">
                                  <Link className="page-link" to="#">
                                    4
                                  </Link>
                                </li>
                              </ul>
                            </li>
                            <li className="page-item page-indicator">
                              <Link className="page-link" to="#">
                                <i className="la la-angle-right" />
                              </Link>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-xxl-4">
            <div className="row">
              <div className="col-xl-12">
                <div className="card h-auto">
                  <ReviewSlider />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Tab.Container>
    </>
  );
}

export default Reviews;
