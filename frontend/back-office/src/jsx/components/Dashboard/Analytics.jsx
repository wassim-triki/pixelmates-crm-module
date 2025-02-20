import React from "react";
import { Link } from "react-router-dom";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import DoughnutChart3 from "../Sego/Analytics/DoughnutChart3";
import ActivityLineChart from "../Sego/Analytics/ActivityLineChart";
import CountUp from "react-countup";



//Images
//Card
import card_pic2 from "../../../assets/images/card/pic2.jpg";
import card_pic4 from "../../../assets/images/card/pic4.jpg";
import card_pic8 from "../../../assets/images/card/pic8.jpg";
import card_pic9 from "../../../assets/images/card/pic9.jpg";
import card_pic11 from "../../../assets/images/card/pic11.jpg";

// Menus
import menu9 from "../../../assets/images/menus/9.png";
import menu10 from "../../../assets/images/menus/10.png";
import menu11 from "../../../assets/images/menus/11.png";
import menu12 from "../../../assets/images/menus/12.png";

// Dish
import dish_pic1 from "../../../assets/images/dish/pic1.jpg";
import dish_pic2 from "../../../assets/images/dish/pic2.jpg";
import dish_pic3 from "../../../assets/images/dish/pic3.jpg";
import dish_pic4 from "../../../assets/images/dish/pic4.jpg";
import dish_pic5 from "../../../assets/images/dish/pic5.jpg";


// Svg
import IcStat3 from "../../../assets/images/svg/ic_stat3.svg";

// Functional Components
import MonthlySelling from "../Sego/Analytics/MonthlySelling";
import WeeklySelling from "../Sego/Analytics/WeeklySelling";
import DailySelling from "../Sego/Analytics/DailySelling";
import MonthlyFavorites from "../Sego/Analytics/MonthlyFavorites";
import WeeklyFavorites from "../Sego/Analytics/WeeklyFavorites";
import DailyFavorites from "../Sego/Analytics/DailyFavorites";

function Analytics() {
  return (
    <>
      <div className="d-sm-flex d-block">
        <p className="fs-18 me-auto mb-sm-4 mb-3">
          Here is your restaurant <br /> summary with graph view
        </p>
        <Dropdown className="custom-dropdown mb-sm-4 mb-3">
          <Dropdown.Toggle className="btn i-false btn-sm btn-primary light d-flex align-items-center svg-btn">
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
              <small className="d-block fs-13">4 June 2020 - 4 July 2020</small>
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
        <div className="col-xl-9 col-xxl-12">
          <div className="card">
            <Tab.Container defaultActiveKey="all-categories">
              <div className="card-header border-0 pb-2 d-lg-flex flex-wrap d-block">
                <div>
                  <h4 className="card-title mb-2">Most Favorites Items</h4>
                  <p className="fs-14 mb-0">
                    Lorem ipsum dolor sit amet, consectetur
                  </p>
                </div>
                <div className="card-action card-tabs mt-3 mt-3 mt-lg-0">
                  <Nav as="ul" className="nav nav-tabs" role="tablist">
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        className="nav-link"
                        eventKey="all-categories"
                        role="tab"
                      >
                        All Categories
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        className="nav-link"
                        eventKey="main-course"
                        role="tab"
                      >
                        Main Course
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        className="nav-link"
                        eventKey="pizza"
                        role="tab"
                      >
                        Pizza
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        className="nav-link"
                        eventKey="drinks"
                        role="tab"
                      >
                        Drink
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        className="nav-link"
                        eventKey="dessert"
                        role="tab"
                      >
                        Dessert
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link className="nav-link" eventKey="more" role="tab">
                        More
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
              </div>
              <div className="card-body most-favourite-items pb-0">
                <Tab.Content className="tab-content">
                  <Tab.Pane
                    eventKey="all-categories"
                    className="tab-pane fade"
                    id="all-categories"
                  >
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="media mb-4 align-items-center">
                          <img
                            className="rounded me-3 food-img"
                            src={card_pic4}
                            alt="card_pic4"
                          />
                          <div className="media-body">
                            <h5 className="mb-sm-4 mb-3">
                              <Link
                                className="text-black"
                                to="ecom-product-detail"
                              >
                                Watermelon Juice with Ice
                              </Link>
                            </h5>
                            <div className="d-flex mb-2">
                              <svg
                                className="me-2"
                                width={15}
                                height={15}
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.500488"
                                  width="2.04545"
                                  height={15}
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="4.59131"
                                  y="4.09082"
                                  width="2.04545"
                                  height="10.9091"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="8.68213"
                                  y="10.2271"
                                  width="2.04545"
                                  height="4.77273"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="12.7729"
                                  y="2.04541"
                                  width="2.04545"
                                  height="12.9545"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                              </svg>
                              <span className="fs-14 text-black">
                                <strong className="me-1">2,441</strong> Total
                                Sales
                              </span>
                            </div>
                            <div className="star-review2 d-flex align-items-center flex-wrap fs-12">
                              <div className="mb-2">
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-gray" />{" "}
                                <i className="fa fa-star text-gray" />
                              </div>
                              <span className="ms-3 text-dark mb-2">
                                (454 revies)
                              </span>
                            </div>
                          </div>
                          <div className="d-inline-block relative donut-chart-sale">
                            <DoughnutChart3
                              backgroundColor="#EA7A9A"
                              backgroundColor2="#ECECEC"
                              height="100"
                              width="100"
                              value="75"
                            />
                            <small>75%</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="media mb-4 align-items-center">
                          <img
                            className="rounded me-3 food-img"
                            src={card_pic9}
                            alt="card_pic9"
                          />
                          <div className="media-body">
                            <h5 className="mb-sm-4 mb-3">
                              <Link
                                className="text-black"
                                to="ecom-product-detail"
                              >
                                Orange Juice Special Smoothy with Sugar
                              </Link>
                            </h5>
                            <div className="d-flex mb-2">
                              <svg
                                className="me-2"
                                width={15}
                                height={15}
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.500488"
                                  width="2.04545"
                                  height={15}
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="4.59131"
                                  y="4.09082"
                                  width="2.04545"
                                  height="10.9091"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="8.68213"
                                  y="10.2271"
                                  width="2.04545"
                                  height="4.77273"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="12.7729"
                                  y="2.04541"
                                  width="2.04545"
                                  height="12.9545"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                              </svg>
                              <span className="fs-14 text-black">
                                <strong className="me-1">3,515</strong> Total
                                Sales
                              </span>
                            </div>
                            <div className="star-review2 d-flex align-items-center flex-wrap fs-12">
                              <div className="mb-2">
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-gray" />{" "}
                                <i className="fa fa-star text-gray" />
                              </div>
                              <span className="ms-3 text-dark mb-2">
                                (454 revies)
                              </span>
                            </div>
                          </div>
                          <div className="d-inline-block relative donut-chart-sale">
                            <DoughnutChart3
                              backgroundColor="#EA7A9A"
                              backgroundColor2="#ECECEC"
                              height="100"
                              width="100"
                              value="21"
                            />
                            <small>21%</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="media mb-4 align-items-center">
                          <img
                            className="rounded me-3 food-img"
                            src={card_pic2}
                            alt="card_pic2"
                          />
                          <div className="media-body">
                            <h5 className="mb-sm-4 mb-3">
                              <Link
                                className="text-black"
                                to="ecom-product-detail"
                              >
                                Mozarella Pizza with Random Topping
                              </Link>
                            </h5>
                            <div className="d-flex mb-2">
                              <svg
                                className="me-2"
                                width={15}
                                height={15}
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.500488"
                                  width="2.04545"
                                  height={15}
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="4.59131"
                                  y="4.09082"
                                  width="2.04545"
                                  height="10.9091"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="8.68213"
                                  y="10.2271"
                                  width="2.04545"
                                  height="4.77273"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="12.7729"
                                  y="2.04541"
                                  width="2.04545"
                                  height="12.9545"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                              </svg>
                              <span className="fs-14 text-black">
                                <strong className="me-1">3,515</strong> Total
                                Sales
                              </span>
                            </div>
                            <div className="star-review2 d-flex align-items-center flex-wrap fs-12">
                              <div className="mb-2">
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{' '}
                                <i className="fa fa-star text-gray" />{" "}
                                <i className="fa fa-star text-gray" />
                              </div>
                              <span className="ms-3 text-dark mb-2">
                                (454 revies)
                              </span>
                            </div>
                          </div>
                          <div className="d-inline-block relative donut-chart-sale">
                            <DoughnutChart3
                              backgroundColor="#EA7A9A"
                              backgroundColor2="#ECECEC"
                              height="100"
                              width="100"
                              value="85"
                            />
                            <small>85%</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="media mb-4 align-items-center">
                          <img
                            className="rounded me-3 food-img"
                            src={card_pic8}
                            alt="card_pic8"
                          />
                          <div className="media-body">
                            <h5 className="mb-sm-4 mb-3">
                              <Link
                                className="text-black"
                                to="ecom-product-detail"
                              >
                                Extreme Deluxe Pizza Super With Mozarella
                              </Link>
                            </h5>
                            <div className="d-flex mb-2">
                              <svg
                                className="me-2"
                                width={15}
                                height={15}
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.500488"
                                  width="2.04545"
                                  height={15}
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="4.59131"
                                  y="4.09082"
                                  width="2.04545"
                                  height="10.9091"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="8.68213"
                                  y="10.2271"
                                  width="2.04545"
                                  height="4.77273"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="12.7729"
                                  y="2.04541"
                                  width="2.04545"
                                  height="12.9545"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                              </svg>
                              <span className="fs-14 text-black">
                                <strong className="me-1">2,441</strong> Total
                                Sales
                              </span>
                            </div>
                            <div className="star-review2 d-flex align-items-center flex-wrap fs-12">
                              <div className="mb-2">
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-gray" />{" "}
                                <i className="fa fa-star text-gray" />
                              </div>
                              <span className="ms-3 text-dark mb-2">
                                (454 revies)
                              </span>
                            </div>
                          </div>
                          <div className="d-inline-block relative donut-chart-sale">
                            <DoughnutChart3
                              backgroundColor="#EA7A9A"
                              backgroundColor2="#ECECEC"
                              height="100"
                              width="100"
                              value="45"
                            />
                            <small>45%</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="media mb-4 align-items-center">
                          <img
                            className="rounded me-3 food-img"
                            src={card_pic11}
                            alt="card_pic11"
                          />
                          <div className="media-body">
                            <h5 className="mb-sm-4 mb-3">
                              <Link
                                className="text-black"
                                to="ecom-product-detail"
                              >
                                Medium Spicy Pizza with Kemangi Leaf
                              </Link>
                            </h5>
                            <div className="d-flex mb-2">
                              <svg
                                className="me-2"
                                width={15}
                                height={15}
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.500488"
                                  width="2.04545"
                                  height={15}
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="4.59131"
                                  y="4.09082"
                                  width="2.04545"
                                  height="10.9091"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="8.68213"
                                  y="10.2271"
                                  width="2.04545"
                                  height="4.77273"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="12.7729"
                                  y="2.04541"
                                  width="2.04545"
                                  height="12.9545"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                              </svg>
                              <span className="fs-14 text-black">
                                <strong className="me-1">2,441</strong> Total
                                Sales
                              </span>
                            </div>
                            <div className="star-review2 d-flex align-items-center flex-wrap fs-12">
                              <div className="mb-2">
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-gray" />{" "}
                                <i className="fa fa-star text-gray" />
                              </div>
                              <span className="ms-3 text-dark mb-2">
                                (454 revies)
                              </span>
                            </div>
                          </div>
                          <div className="d-inline-block relative donut-chart-sale">
                            <DoughnutChart3
                              backgroundColor="#EA7A9A"
                              backgroundColor2="#ECECEC"
                              height="100"
                              width="100"
                              value="52"
                            />
                            <small>52%</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="media mb-4 align-items-center">
                          <img
                            className="rounded me-3 food-img"
                            src={card_pic4}
                            alt="card_pic4"
                          />
                          <div className="media-body">
                            <h5 className="mb-sm-4 mb-3">
                              <Link
                                className="text-black"
                                to="ecom-product-detail"
                              >
                                Chicken Kebab from Turkish with Garlic
                              </Link>
                            </h5>
                            <div className="d-flex mb-2">
                              <svg
                                className="me-2"
                                width={15}
                                height={15}
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.500488"
                                  width="2.04545"
                                  height={15}
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="4.59131"
                                  y="4.09082"
                                  width="2.04545"
                                  height="10.9091"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="8.68213"
                                  y="10.2271"
                                  width="2.04545"
                                  height="4.77273"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="12.7729"
                                  y="2.04541"
                                  width="2.04545"
                                  height="12.9545"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                              </svg>
                              <span className="fs-14 text-black">
                                <strong className="me-1">2,441</strong> Total
                                Sales
                              </span>
                            </div>
                            <div className="star-review2 d-flex align-items-center flex-wrap fs-12">
                              <div className="mb-2">
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-gray" />{" "}
                                <i className="fa fa-star text-gray" />
                              </div>
                              <span className="ms-3 text-dark mb-2">
                                (454 revies)
                              </span>
                            </div>
                          </div>
                          <div className="d-inline-block relative donut-chart-sale">
                            <DoughnutChart3
                              backgroundColor="#EA7A9A"
                              backgroundColor2="#ECECEC"
                              height="100"
                              width="100"
                              value="35"
                            />
                            <small>35%</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane
                    eventKey="main-course"
                    className="tab-pane fade"
                    id="main-course"
                  >
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="media mb-4 align-items-center">
                          <img
                            className="rounded me-3 food-img"
                            src={card_pic4}
                            alt="card_pic4"
                          />
                          <div className="media-body">
                            <h5 className="mb-sm-4 mb-3">
                              <Link
                                className="text-black"
                                to="ecom-product-detail"
                              >
                                Watermelon Juice with Ice
                              </Link>
                            </h5>
                            <div className="d-flex mb-2">
                              <svg
                                className="me-2"
                                width={15}
                                height={15}
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.500488"
                                  width="2.04545"
                                  height={15}
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="4.59131"
                                  y="4.09082"
                                  width="2.04545"
                                  height="10.9091"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="8.68213"
                                  y="10.2271"
                                  width="2.04545"
                                  height="4.77273"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="12.7729"
                                  y="2.04541"
                                  width="2.04545"
                                  height="12.9545"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                              </svg>
                              <span className="fs-14 text-black">
                                <strong className="me-1">2,441</strong> Total
                                Sales
                              </span>
                            </div>
                            <div className="star-review2 d-flex align-items-center flex-wrap fs-12">
                              <div className="mb-2">
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-gray" />{" "}
                                <i className="fa fa-star text-gray" />
                              </div>
                              <span className="ms-3 text-dark mb-2">
                                (454 revies)
                              </span>
                            </div>
                          </div>
                          <div className="d-inline-block relative donut-chart-sale">
                            <DoughnutChart3
                              backgroundColor="#EA7A9A"
                              backgroundColor2="#ECECEC"
                              height="100"
                              width="100"
                              value="75"
                            />
                            <small>75%</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="media mb-4 align-items-center">
                          <img
                            className="rounded me-3 food-img"
                            src={card_pic9}
                            alt="card_pic9"
                          />
                          <div className="media-body">
                            <h5 className="mb-sm-4 mb-3">
                              <Link
                                className="text-black"
                                to="ecom-product-detail"
                              >
                                Orange Juice Special Smoothy with Sugar
                              </Link>
                            </h5>
                            <div className="d-flex mb-2">
                              <svg
                                className="me-2"
                                width={15}
                                height={15}
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.500488"
                                  width="2.04545"
                                  height={15}
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="4.59131"
                                  y="4.09082"
                                  width="2.04545"
                                  height="10.9091"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="8.68213"
                                  y="10.2271"
                                  width="2.04545"
                                  height="4.77273"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="12.7729"
                                  y="2.04541"
                                  width="2.04545"
                                  height="12.9545"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                              </svg>
                              <span className="fs-14 text-black">
                                <strong className="me-1">3,515</strong> Total
                                Sales
                              </span>
                            </div>
                            <div className="star-review2 d-flex align-items-center flex-wrap fs-12">
                              <div className="mb-2">
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-gray" />{" "}
                                <i className="fa fa-star text-gray" />
                              </div>
                              <span className="ms-3 text-dark mb-2">
                                (454 revies)
                              </span>
                            </div>
                          </div>
                          <div className="d-inline-block relative donut-chart-sale">
                            <DoughnutChart3
                              backgroundColor="#EA7A9A"
                              backgroundColor2="#ECECEC"
                              height="100"
                              width="100"
                              value="21"
                            />
                            <small>21%</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="media mb-4 align-items-center">
                          <img
                            className="rounded me-3"
                            src={card_pic2}
                            alt="card_pic2"
                          />
                          <div className="media-body">
                            <h5 className="mb-sm-4 mb-3">
                              <Link
                                className="text-black"
                                to="ecom-product-detail"
                              >
                                Mozarella Pizza with Random Topping
                              </Link>
                            </h5>
                            <div className="d-flex mb-2">
                              <svg
                                className="me-2"
                                width={15}
                                height={15}
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.500488"
                                  width="2.04545"
                                  height={15}
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="4.59131"
                                  y="4.09082"
                                  width="2.04545"
                                  height="10.9091"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="8.68213"
                                  y="10.2271"
                                  width="2.04545"
                                  height="4.77273"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="12.7729"
                                  y="2.04541"
                                  width="2.04545"
                                  height="12.9545"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                              </svg>
                              <span className="fs-14 text-black">
                                <strong className="me-1">3,515</strong> Total
                                Sales
                              </span>
                            </div>
                            <div className="star-review2 d-flex align-items-center flex-wrap fs-12">
                              <div className="mb-2">
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-gray" />{" "}
                                <i className="fa fa-star text-gray" />{" "}
                              </div>
                              <span className="ms-3 text-dark mb-2">
                                (454 revies)
                              </span>
                            </div>
                          </div>
                          <div className="d-inline-block relative donut-chart-sale">
                            <DoughnutChart3
                              backgroundColor="#EA7A9A"
                              backgroundColor2="#ECECEC"
                              height="100"
                              width="100"
                              value="85"
                            />
                            <small>85%</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="media mb-4 align-items-center">
                          <img
                            className="rounded me-3 food-img"
                            src={card_pic8}
                            alt="card_pic8"
                          />
                          <div className="media-body">
                            <h5 className="mb-sm-4 mb-3">
                              <Link
                                className="text-black"
                                to="ecom-product-detail"
                              >
                                Extreme Deluxe Pizza Super With Mozarella
                              </Link>
                            </h5>
                            <div className="d-flex mb-2">
                              <svg
                                className="me-2"
                                width={15}
                                height={15}
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.500488"
                                  width="2.04545"
                                  height={15}
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="4.59131"
                                  y="4.09082"
                                  width="2.04545"
                                  height="10.9091"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="8.68213"
                                  y="10.2271"
                                  width="2.04545"
                                  height="4.77273"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="12.7729"
                                  y="2.04541"
                                  width="2.04545"
                                  height="12.9545"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                              </svg>
                              <span className="fs-14 text-black">
                                <strong className="me-1">2,441</strong> Total
                                Sales
                              </span>
                            </div>
                            <div className="star-review2 d-flex align-items-center flex-wrap fs-12">
                              <div className="mb-2">
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-gray" />{" "}
                                <i className="fa fa-star text-gray" />
                              </div>
                              <span className="ms-3 text-dark mb-2">
                                (454 revies)
                              </span>
                            </div>
                          </div>
                          <div className="d-inline-block relative donut-chart-sale">
                            <DoughnutChart3
                              backgroundColor="#EA7A9A"
                              backgroundColor2="#ECECEC"
                              height="100"
                              width="100"
                              value="45"
                            />
                            <small>45%</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="media mb-4 align-items-center">
                          <img
                            className="rounded me-3 food-img"
                            src={card_pic11}
                            alt="card_pic11"
                          />
                          <div className="media-body">
                            <h5 className="mb-sm-4 mb-3">
                              <Link
                                className="text-black"
                                to="ecom-product-detail"
                              >
                                Medium Spicy Pizza with Kemangi Leaf
                              </Link>
                            </h5>
                            <div className="d-flex mb-2">
                              <svg
                                className="me-2"
                                width={15}
                                height={15}
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.500488"
                                  width="2.04545"
                                  height={15}
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="4.59131"
                                  y="4.09082"
                                  width="2.04545"
                                  height="10.9091"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="8.68213"
                                  y="10.2271"
                                  width="2.04545"
                                  height="4.77273"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="12.7729"
                                  y="2.04541"
                                  width="2.04545"
                                  height="12.9545"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                              </svg>
                              <span className="fs-14 text-black">
                                <strong className="me-1">2,441</strong> Total
                                Sales
                              </span>
                            </div>
                            <div className="star-review2 d-flex align-items-center flex-wrap fs-12">
                              <div className="mb-2">
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-gray" />{" "}
                                <i className="fa fa-star text-gray" />
                              </div>
                              <span className="ms-3 text-dark mb-2">
                                (454 revies)
                              </span>
                            </div>
                          </div>
                          <div className="d-inline-block relative donut-chart-sale">
                            <DoughnutChart3
                              backgroundColor="#EA7A9A"
                              backgroundColor2="#ECECEC"
                              height="100"
                              width="100"
                              value="52"
                            />
                            <small>52%</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane
                    eventKey="pizza"
                    className="tab-pane fade"
                    id="pizza"
                  >
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="media mb-4 align-items-center">
                          <img
                            className="rounded me-3 food-img"
                            src={card_pic9}
                            alt="card_pic9"
                          />
                          <div className="media-body">
                            <h5 className="mb-sm-4 mb-3">
                              <Link
                                className="text-black"
                                to="ecom-product-detail"
                              >
                                Orange Juice Special Smoothy with Sugar
                              </Link>
                            </h5>
                            <div className="d-flex mb-2">
                              <svg
                                className="me-2"
                                width={15}
                                height={15}
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.500488"
                                  width="2.04545"
                                  height={15}
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="4.59131"
                                  y="4.09082"
                                  width="2.04545"
                                  height="10.9091"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="8.68213"
                                  y="10.2271"
                                  width="2.04545"
                                  height="4.77273"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="12.7729"
                                  y="2.04541"
                                  width="2.04545"
                                  height="12.9545"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                              </svg>
                              <span className="fs-14 text-black">
                                <strong className="me-1">3,515</strong> Total
                                Sales
                              </span>
                            </div>
                            <div className="star-review2 d-flex align-items-center flex-wrap fs-12">
                              <div className="mb-2">
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-gray" />{""}
                                <i className="fa fa-star text-gray" />
                              </div>
                              <span className="ms-3 text-dark mb-2">
                                (454 revies)
                              </span>
                            </div>
                          </div>
                          <div className="d-inline-block relative donut-chart-sale">
                            <DoughnutChart3
                              backgroundColor="#EA7A9A"
                              backgroundColor2="#ECECEC"
                              height="100"
                              width="100"
                              value="21"
                            />
                            <small>21%</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="media mb-4 align-items-center">
                          <img
                            className="rounded me-3 food-img"
                            src={card_pic2}
                            alt="card_pic2"
                          />
                          <div className="media-body">
                            <h5 className="mb-sm-4 mb-3">
                              <Link
                                className="text-black"
                                to="ecom-product-detail"
                              >
                                Mozarella Pizza with Random Topping
                              </Link>
                            </h5>
                            <div className="d-flex mb-2">
                              <svg
                                className="me-2"
                                width={15}
                                height={15}
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.500488"
                                  width="2.04545"
                                  height={15}
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="4.59131"
                                  y="4.09082"
                                  width="2.04545"
                                  height="10.9091"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="8.68213"
                                  y="10.2271"
                                  width="2.04545"
                                  height="4.77273"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="12.7729"
                                  y="2.04541"
                                  width="2.04545"
                                  height="12.9545"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                              </svg>
                              <span className="fs-14 text-black">
                                <strong className="me-1">3,515</strong> Total
                                Sales
                              </span>
                            </div>
                            <div className="star-review2 d-flex align-items-center flex-wrap fs-12">
                              <div className="mb-2">
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-gray" />{" "}
                                <i className="fa fa-star text-gray" />
                              </div>
                              <span className="ms-3 text-dark mb-2">
                                (454 revies)
                              </span>
                            </div>
                          </div>
                          <div className="d-inline-block relative donut-chart-sale">
                            <DoughnutChart3
                              backgroundColor="#EA7A9A"
                              backgroundColor2="#ECECEC"
                              height="100"
                              width="100"
                              value="85"
                            />
                            <small>85%</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="media mb-4 align-items-center">
                          <img
                            className="rounded me-3 food-img"
                            src={card_pic8}
                            alt="card_pic8"
                          />
                          <div className="media-body">
                            <h5 className="mb-sm-4 mb-3">
                              <Link
                                className="text-black"
                                to="ecom-product-detail"
                              >
                                Extreme Deluxe Pizza Super With Mozarella
                              </Link>
                            </h5>
                            <div className="d-flex mb-2">
                              <svg
                                className="me-2"
                                width={15}
                                height={15}
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.500488"
                                  width="2.04545"
                                  height={15}
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="4.59131"
                                  y="4.09082"
                                  width="2.04545"
                                  height="10.9091"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="8.68213"
                                  y="10.2271"
                                  width="2.04545"
                                  height="4.77273"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="12.7729"
                                  y="2.04541"
                                  width="2.04545"
                                  height="12.9545"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                              </svg>
                              <span className="fs-14 text-black">
                                <strong className="me-1">2,441</strong> Total
                                Sales
                              </span>
                            </div>
                            <div className="star-review2 d-flex align-items-center flex-wrap fs-12">
                              <div className="mb-2">
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-gray" />{" "}
                                <i className="fa fa-star text-gray" />
                              </div>
                              <span className="ms-3 text-dark mb-2">
                                (454 revies)
                              </span>
                            </div>
                          </div>
                          <div className="d-inline-block relative donut-chart-sale">
                            <DoughnutChart3
                              backgroundColor="#EA7A9A"
                              backgroundColor2="#ECECEC"
                              height="100"
                              width="100"
                              value="45"
                            />
                            <small>45%</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="media mb-4 align-items-center">
                          <img
                            className="rounded me-3 food-img"
                            src={card_pic11}
                            alt="card_pic11"
                          />
                          <div className="media-body">
                            <h5 className="mb-sm-4 mb-3">
                              <Link
                                className="text-black"
                                to="ecom-product-detail"
                              >
                                Medium Spicy Pizza with Kemangi Leaf
                              </Link>
                            </h5>
                            <div className="d-flex mb-2">
                              <svg
                                className="me-2"
                                width={15}
                                height={15}
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.500488"
                                  width="2.04545"
                                  height={15}
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="4.59131"
                                  y="4.09082"
                                  width="2.04545"
                                  height="10.9091"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="8.68213"
                                  y="10.2271"
                                  width="2.04545"
                                  height="4.77273"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="12.7729"
                                  y="2.04541"
                                  width="2.04545"
                                  height="12.9545"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                              </svg>
                              <span className="fs-14 text-black">
                                <strong className="me-1">2,441</strong> Total
                                Sales
                              </span>
                            </div>
                            <div className="star-review2 d-flex align-items-center flex-wrap fs-12">
                              <div className="mb-2">
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-gray" />{" "}
                                <i className="fa fa-star text-gray" />
                              </div>
                              <span className="ms-3 text-dark mb-2">
                                (454 revies)
                              </span>
                            </div>
                          </div>
                          <div className="d-inline-block relative donut-chart-sale">
                            <DoughnutChart3
                              backgroundColor="#EA7A9A"
                              backgroundColor2="#ECECEC"
                              height="100"
                              width="100"
                              value="52"
                            />
                            <small>52%</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane
                    eventKey="drinks"
                    className="tab-pane fade"
                    id="drink"
                  >
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="media mb-4 align-items-center">
                          <img
                            className="rounded me-3 food-img"
                            src={card_pic4}
                            alt="card_pic4"
                          />
                          <div className="media-body">
                            <h5 className="mb-sm-4 mb-3">
                              <Link
                                className="text-black"
                                to="ecom-product-detail"
                              >
                                Watermelon Juice with Ice
                              </Link>
                            </h5>
                            <div className="d-flex mb-2">
                              <svg
                                className="me-2"
                                width={15}
                                height={15}
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.500488"
                                  width="2.04545"
                                  height={15}
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="4.59131"
                                  y="4.09082"
                                  width="2.04545"
                                  height="10.9091"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="8.68213"
                                  y="10.2271"
                                  width="2.04545"
                                  height="4.77273"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="12.7729"
                                  y="2.04541"
                                  width="2.04545"
                                  height="12.9545"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                              </svg>
                              <span className="fs-14 text-black">
                                <strong className="me-1">2,441</strong> Total
                                Sales
                              </span>
                            </div>
                            <div className="star-review2 d-flex align-items-center flex-wrap fs-12">
                              <div className="mb-2">
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-gray" />{" "}
                                <i className="fa fa-star text-gray" />
                              </div>
                              <span className="ms-3 text-dark mb-2">
                                (454 revies)
                              </span>
                            </div>
                          </div>
                          <div className="d-inline-block relative donut-chart-sale">
                            <DoughnutChart3
                              backgroundColor="#EA7A9A"
                              backgroundColor2="#ECECEC"
                              height="100"
                              width="100"
                              value="75"
                            />
                            <small>75%</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="media mb-4 align-items-center">
                          <img
                            className="rounded me-3 food-img"
                            src={card_pic9}
                            alt={card_pic9}
                          />
                          <div className="media-body">
                            <h5 className="mb-sm-4 mb-3">
                              <Link
                                className="text-black"
                                to="ecom-product-detail"
                              >
                                Orange Juice Special Smoothy with Sugar
                              </Link>
                            </h5>
                            <div className="d-flex mb-2">
                              <svg
                                className="me-2"
                                width={15}
                                height={15}
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.500488"
                                  width="2.04545"
                                  height={15}
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="4.59131"
                                  y="4.09082"
                                  width="2.04545"
                                  height="10.9091"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="8.68213"
                                  y="10.2271"
                                  width="2.04545"
                                  height="4.77273"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="12.7729"
                                  y="2.04541"
                                  width="2.04545"
                                  height="12.9545"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                              </svg>
                              <span className="fs-14 text-black">
                                <strong className="me-1">3,515</strong> Total
                                Sales
                              </span>
                            </div>
                            <div className="star-review2 d-flex align-items-center flex-wrap fs-12">
                              <div className="mb-2">
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-gray" />{" "}
                                <i className="fa fa-star text-gray" />
                              </div>
                              <span className="ms-3 text-dark mb-2">
                                (454 revies)
                              </span>
                            </div>
                          </div>
                          <div className="d-inline-block relative donut-chart-sale">
                            <DoughnutChart3
                              backgroundColor="#EA7A9A"
                              backgroundColor2="#ECECEC"
                              height="100"
                              width="100"
                              value="21"
                            />
                            <small>21%</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="media mb-4 align-items-center">
                          <img
                            className="rounded me-3 food-img"
                            src={card_pic2}
                            alt="card_pic2"
                          />
                          <div className="media-body">
                            <h5 className="mb-sm-4 mb-3">
                              <Link
                                className="text-black"
                                to="ecom-product-detail"
                              >
                                Mozarella Pizza with Random Topping
                              </Link>
                            </h5>
                            <div className="d-flex mb-2">
                              <svg
                                className="me-2"
                                width={15}
                                height={15}
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.500488"
                                  width="2.04545"
                                  height={15}
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="4.59131"
                                  y="4.09082"
                                  width="2.04545"
                                  height="10.9091"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="8.68213"
                                  y="10.2271"
                                  width="2.04545"
                                  height="4.77273"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="12.7729"
                                  y="2.04541"
                                  width="2.04545"
                                  height="12.9545"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                              </svg>
                              <span className="fs-14 text-black">
                                <strong className="me-1">3,515</strong> Total
                                Sales
                              </span>
                            </div>
                            <div className="star-review2 d-flex align-items-center flex-wrap fs-12">
                              <div className="mb-2">
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-gray" />{" "}
                                <i className="fa fa-star text-gray" />
                              </div>
                              <span className="ms-3 text-dark mb-2">
                                (454 revies)
                              </span>
                            </div>
                          </div>
                          <div className="d-inline-block relative donut-chart-sale">
                            <DoughnutChart3
                              backgroundColor="#EA7A9A"
                              backgroundColor2="#ECECEC"
                              height="100"
                              width="100"
                              value="85"
                            />
                            <small>85%</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="media mb-4 align-items-center">
                          <img
                            className="rounded me-3 food-img"
                            src={card_pic8}
                            alt="card_pic8"
                          />
                          <div className="media-body">
                            <h5 className="mb-sm-4 mb-3">
                              <Link
                                className="text-black"
                                to="ecom-product-detail"
                              >
                                Extreme Deluxe Pizza Super With Mozarella
                              </Link>
                            </h5>
                            <div className="d-flex mb-2">
                              <svg
                                className="me-2"
                                width={15}
                                height={15}
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.500488"
                                  width="2.04545"
                                  height={15}
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="4.59131"
                                  y="4.09082"
                                  width="2.04545"
                                  height="10.9091"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="8.68213"
                                  y="10.2271"
                                  width="2.04545"
                                  height="4.77273"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="12.7729"
                                  y="2.04541"
                                  width="2.04545"
                                  height="12.9545"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                              </svg>
                              <span className="fs-14 text-black">
                                <strong className="me-1">2,441</strong> Total
                                Sales
                              </span>
                            </div>
                            <div className="star-review2 d-flex align-items-center flex-wrap fs-12">
                              <div className="mb-2">
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-gray" />{" "}
                                <i className="fa fa-star text-gray" />
                              </div>
                              <span className="ms-3 text-dark mb-2">
                                (454 revies)
                              </span>
                            </div>
                          </div>
                          <div className="d-inline-block relative donut-chart-sale">
                            <DoughnutChart3
                              backgroundColor="#EA7A9A"
                              backgroundColor2="#ECECEC"
                              height="100"
                              width="100"
                              value="45"
                            />
                            <small>45%</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="media mb-4 align-items-center">
                          <img
                            className="rounded me-3 food-img"
                            src={card_pic11}
                            alt="card_pic11"
                          />
                          <div className="media-body">
                            <h5 className="mb-sm-4 mb-3">
                              <Link
                                className="text-black"
                                to="ecom-product-detail"
                              >
                                Medium Spicy Pizza with Kemangi Leaf
                              </Link>
                            </h5>
                            <div className="d-flex mb-2">
                              <svg
                                className="me-2"
                                width={15}
                                height={15}
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.500488"
                                  width="2.04545"
                                  height={15}
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="4.59131"
                                  y="4.09082"
                                  width="2.04545"
                                  height="10.9091"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="8.68213"
                                  y="10.2271"
                                  width="2.04545"
                                  height="4.77273"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="12.7729"
                                  y="2.04541"
                                  width="2.04545"
                                  height="12.9545"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                              </svg>
                              <span className="fs-14 text-black">
                                <strong className="me-1">2,441</strong> Total
                                Sales
                              </span>
                            </div>
                            <div className="star-review2 d-flex align-items-center flex-wrap fs-12">
                              <div className="mb-2">
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-gray" />{" "}
                                <i className="fa fa-star text-gray" />
                              </div>
                              <span className="ms-3 text-dark mb-2">
                                (454 revies)
                              </span>
                            </div>
                          </div>
                          <div className="d-inline-block relative donut-chart-sale">
                            <DoughnutChart3
                              backgroundColor="#EA7A9A"
                              backgroundColor2="#ECECEC"
                              height="100"
                              width="100"
                              value="52"
                            />
                            <small>52%</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="media mb-4 align-items-center">
                          <img
                            className="rounded me-3 food-img"
                            src={card_pic11}
                            alt="card_pic11"
                          />
                          <div className="media-body">
                            <h5 className="mb-sm-4 mb-3">
                              <Link
                                className="text-black"
                                to="ecom-product-detail"
                              >
                                Medium Spicy Pizza with Kemangi Leaf
                              </Link>
                            </h5>
                            <div className="d-flex mb-2">
                              <svg
                                className="me-2"
                                width={15}
                                height={15}
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.500488"
                                  width="2.04545"
                                  height={15}
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="4.59131"
                                  y="4.09082"
                                  width="2.04545"
                                  height="10.9091"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="8.68213"
                                  y="10.2271"
                                  width="2.04545"
                                  height="4.77273"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="12.7729"
                                  y="2.04541"
                                  width="2.04545"
                                  height="12.9545"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                              </svg>
                              <span className="fs-14 text-black">
                                <strong className="me-1">2,441</strong> Total
                                Sales
                              </span>
                            </div>
                            <div className="star-review2 d-flex align-items-center flex-wrap fs-12">
                              <div className="mb-2">
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-gray" />{" "}
                                <i className="fa fa-star text-gray" />
                              </div>
                              <span className="ms-3 text-dark mb-2">
                                (454 revies)
                              </span>
                            </div>
                          </div>
                          <div className="d-inline-block relative donut-chart-sale">
                            <DoughnutChart3
                              backgroundColor="#EA7A9A"
                              backgroundColor2="#ECECEC"
                              height="100"
                              width="100"
                              value="52"
                            />
                            <small>52%</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane
                    eventKey="dessert"
                    className="tab-pane fade"
                    id="dessert"
                  >
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="media mb-4 align-items-center">
                          <img
                            className="rounded me-3 food-img"
                            src={card_pic4}
                            alt="card_pic4"
                          />
                          <div className="media-body">
                            <h5 className="mb-sm-4 mb-3">
                              <Link
                                className="text-black"
                                to="ecom-product-detail"
                              >
                                Watermelon Juice with Ice
                              </Link>
                            </h5>
                            <div className="d-flex mb-2">
                              <svg
                                className="me-2"
                                width={15}
                                height={15}
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.500488"
                                  width="2.04545"
                                  height={15}
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="4.59131"
                                  y="4.09082"
                                  width="2.04545"
                                  height="10.9091"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="8.68213"
                                  y="10.2271"
                                  width="2.04545"
                                  height="4.77273"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="12.7729"
                                  y="2.04541"
                                  width="2.04545"
                                  height="12.9545"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                              </svg>
                              <span className="fs-14 text-black">
                                <strong className="me-1">2,441</strong> Total
                                Sales
                              </span>
                            </div>
                            <div className="star-review2 d-flex align-items-center flex-wrap fs-12">
                              <div className="mb-2">
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-gray" />{" "}
                                <i className="fa fa-star text-gray" />
                              </div>
                              <span className="ms-3 text-dark mb-2">
                                (454 revies)
                              </span>
                            </div>
                          </div>
                          <div className="d-inline-block relative donut-chart-sale">
                            <DoughnutChart3
                              backgroundColor="#EA7A9A"
                              backgroundColor2="#ECECEC"
                              height="100"
                              width="100"
                              value="52"
                            />
                            <small>75%</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="media mb-4 align-items-center">
                          <img
                            className="rounded me-3 food-img"
                            src={card_pic9}
                            alt="card_pic9"
                          />
                          <div className="media-body">
                            <h5 className="mb-sm-4 mb-3">
                              <Link
                                className="text-black"
                                to="ecom-product-detail"
                              >
                                Orange Juice Special Smoothy with Sugar
                              </Link>
                            </h5>
                            <div className="d-flex mb-2">
                              <svg
                                className="me-2"
                                width={15}
                                height={15}
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.500488"
                                  width="2.04545"
                                  height={15}
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="4.59131"
                                  y="4.09082"
                                  width="2.04545"
                                  height="10.9091"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="8.68213"
                                  y="10.2271"
                                  width="2.04545"
                                  height="4.77273"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="12.7729"
                                  y="2.04541"
                                  width="2.04545"
                                  height="12.9545"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                              </svg>
                              <span className="fs-14 text-black">
                                <strong className="me-1">3,515</strong> Total
                                Sales
                              </span>
                            </div>
                            <div className="star-review2 d-flex align-items-center flex-wrap fs-12">
                              <div className="mb-2">
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-gray" />{" "}
                                <i className="fa fa-star text-gray" />
                              </div>
                              <span className="ms-3 text-dark mb-2">
                                (454 revies)
                              </span>
                            </div>
                          </div>
                          <div className="d-inline-block relative donut-chart-sale">
                            <DoughnutChart3
                              backgroundColor="#EA7A9A"
                              backgroundColor2="#ECECEC"
                              height="100"
                              width="100"
                              value="21"
                            />
                            <small>21%</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="media mb-4 align-items-center">
                          <img
                            className="rounded me-3 food-img"
                            src={card_pic8}
                            alt="card_pic8"
                          />
                          <div className="media-body">
                            <h5 className="mb-sm-4 mb-3">
                              <Link
                                className="text-black"
                                to="ecom-product-detail"
                              >
                                Extreme Deluxe Pizza Super With Mozarella
                              </Link>
                            </h5>
                            <div className="d-flex mb-2">
                              <svg
                                className="me-2"
                                width={15}
                                height={15}
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.500488"
                                  width="2.04545"
                                  height={15}
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="4.59131"
                                  y="4.09082"
                                  width="2.04545"
                                  height="10.9091"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="8.68213"
                                  y="10.2271"
                                  width="2.04545"
                                  height="4.77273"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="12.7729"
                                  y="2.04541"
                                  width="2.04545"
                                  height="12.9545"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                              </svg>
                              <span className="fs-14 text-black">
                                <strong className="me-1">2,441</strong> Total
                                Sales
                              </span>
                            </div>
                            <div className="star-review2 d-flex align-items-center flex-wrap fs-12">
                              <div className="mb-2">
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-gray" />{" "}
                                <i className="fa fa-star text-gray" />
                              </div>
                              <span className="ms-3 text-dark mb-2">
                                (454 revies)
                              </span>
                            </div>
                          </div>
                          <div className="d-inline-block relative donut-chart-sale">
                            <DoughnutChart3
                              backgroundColor="#EA7A9A"
                              backgroundColor2="#ECECEC"
                              height="100"
                              width="100"
                              value="45"
                            />
                            <small>45%</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="media mb-4 align-items-center">
                          <img
                            className="rounded me-3 food-img"
                            src={card_pic11}
                            alt="card_pic11"
                          />
                          <div className="media-body">
                            <h5 className="mb-sm-4 mb-3">
                              <Link
                                className="text-black"
                                to="ecom-product-detail"
                              >
                                Medium Spicy Pizza with Kemangi Leaf
                              </Link>
                            </h5>
                            <div className="d-flex mb-2">
                              <svg
                                className="me-2"
                                width={15}
                                height={15}
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.500488"
                                  width="2.04545"
                                  height={15}
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="4.59131"
                                  y="4.09082"
                                  width="2.04545"
                                  height="10.9091"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="8.68213"
                                  y="10.2271"
                                  width="2.04545"
                                  height="4.77273"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="12.7729"
                                  y="2.04541"
                                  width="2.04545"
                                  height="12.9545"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                              </svg>
                              <span className="fs-14 text-black">
                                <strong className="me-1">2,441</strong> Total
                                Sales
                              </span>
                            </div>
                            <div className="star-review2 d-flex align-items-center flex-wrap fs-12">
                              <div className="mb-2">
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-gray" />{" "}
                                <i className="fa fa-star text-gray" />
                              </div>
                              <span className="ms-3 text-dark mb-2">
                                (454 revies)
                              </span>
                            </div>
                          </div>
                          <div className="d-inline-block relative donut-chart-sale">
                            <DoughnutChart3
                              backgroundColor="#EA7A9A"
                              backgroundColor2="#ECECEC"
                              height="100"
                              width="100"
                              value="52"
                            />
                            <small>52%</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="more" className="tab-pane fade" id="more">
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="media mb-4 align-items-center">
                          <img
                            className="rounded me-3 food-img"
                            src={card_pic11}
                            alt="card_pic11"
                          />
                          <div className="media-body">
                            <h5 className="mb-sm-4 mb-3">
                              <Link
                                className="text-black"
                                to="ecom-product-detail"
                              >
                                Watermelon Juice with Ice
                              </Link>
                            </h5>
                            <div className="d-flex mb-2">
                              <svg
                                className="me-2"
                                width={15}
                                height={15}
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.500488"
                                  width="2.04545"
                                  height={15}
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="4.59131"
                                  y="4.09082"
                                  width="2.04545"
                                  height="10.9091"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="8.68213"
                                  y="10.2271"
                                  width="2.04545"
                                  height="4.77273"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="12.7729"
                                  y="2.04541"
                                  width="2.04545"
                                  height="12.9545"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                              </svg>
                              <span className="fs-14 text-black">
                                <strong className="me-1">2,441</strong> Total
                                Sales
                              </span>
                            </div>
                            <div className="star-review2 d-flex align-items-center flex-wrap fs-12">
                              <div className="mb-2">
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-gray" />{" "}
                                <i className="fa fa-star text-gray" />
                              </div>
                              <span className="ms-3 text-dark mb-2">
                                (454 revies)
                              </span>
                            </div>
                          </div>
                          <div className="d-inline-block relative donut-chart-sale">
                            <DoughnutChart3
                              backgroundColor="#EA7A9A"
                              backgroundColor2="#ECECEC"
                              height="100"
                              width="100"
                              value="75"
                            />
                            <small>75%</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="media mb-4 align-items-center">
                          <img
                            className="rounded me-3 food-img"
                            src={card_pic9}
                            alt="card_pic9"
                          />
                          <div className="media-body">
                            <h5 className="mb-sm-4 mb-3">
                              <Link
                                className="text-black"
                                to="ecom-product-detail"
                              >
                                Orange Juice Special Smoothy with Sugar
                              </Link>
                            </h5>
                            <div className="d-flex mb-2">
                              <svg
                                className="me-2"
                                width={15}
                                height={15}
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.500488"
                                  width="2.04545"
                                  height={15}
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="4.59131"
                                  y="4.09082"
                                  width="2.04545"
                                  height="10.9091"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="8.68213"
                                  y="10.2271"
                                  width="2.04545"
                                  height="4.77273"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="12.7729"
                                  y="2.04541"
                                  width="2.04545"
                                  height="12.9545"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                              </svg>
                              <span className="fs-14 text-black">
                                <strong className="me-1">3,515</strong> Total
                                Sales
                              </span>
                            </div>
                            <div className="star-review2 d-flex align-items-center flex-wrap fs-12">
                              <div className="mb-2">
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-gray" />{" "}
                                <i className="fa fa-star text-gray" />
                              </div>
                              <span className="ms-3 text-dark mb-2">
                                (454 revies)
                              </span>
                            </div>
                          </div>
                          <div className="d-inline-block relative donut-chart-sale">
                            <DoughnutChart3
                              backgroundColor="#EA7A9A"
                              backgroundColor2="#ECECEC"
                              height="100"
                              width="100"
                              value="21"
                            />
                            <small>21%</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="media mb-4 align-items-center">
                          <img
                            className="rounded me-3 food-img"
                            src={card_pic11}
                            alt="card_pic11"
                          />
                          <div className="media-body">
                            <h5 className="mb-sm-4 mb-3">
                              <Link
                                className="text-black"
                                to="ecom-product-detail"
                              >
                                Medium Spicy Pizza with Kemangi Leaf
                              </Link>
                            </h5>
                            <div className="d-flex mb-2">
                              <svg
                                className="me-2"
                                width={15}
                                height={15}
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.500488"
                                  width="2.04545"
                                  height={15}
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="4.59131"
                                  y="4.09082"
                                  width="2.04545"
                                  height="10.9091"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="8.68213"
                                  y="10.2271"
                                  width="2.04545"
                                  height="4.77273"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                                <rect
                                  x="12.7729"
                                  y="2.04541"
                                  width="2.04545"
                                  height="12.9545"
                                  rx="1.02273"
                                  fill="#EA7A9A"
                                />
                              </svg>
                              <span className="fs-14 text-black">
                                <strong className="me-1">2,441</strong> Total
                                Sales
                              </span>
                            </div>
                            <div className="star-review2 d-flex align-items-center flex-wrap fs-12">
                              <div className="mb-2">
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-orange" />{" "}
                                <i className="fa fa-star text-gray" />{" "}
                                <i className="fa fa-star text-gray" />
                              </div>
                              <span className="ms-3 text-dark mb-2">
                                (454 revies)
                              </span>
                            </div>
                          </div>
                          <div className="d-inline-block relative donut-chart-sale">
                            <DoughnutChart3
                              backgroundColor="#EA7A9A"
                              backgroundColor2="#ECECEC"
                              height="100"
                              width="100"
                              value="52"
                            />
                            <small>52%</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </div>
              <div className="card-footer border-0">
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
            </Tab.Container>
          </div>
        </div>
        <div className="col-xl-3 col-xxl-12">
          <div className="card trending-menus">
            <div className="card-header d-sm-flex d-block pb-0 border-0">
              <div>
                <h4 className="text-black fs-20">Daily Trending Menus</h4>
                <p className="fs-13 mb-0 text-black">Lorem ipsum dolor</p>
              </div>
            </div>
            <div className="card-body dz-scroll height500" id="dailyMenus">
              <div className="d-flex pb-3 mb-3 border-bottom tr-row align-items-center">
                <span className="num">#1</span>
                <div className="me-auto pe-3">
                  <Link to="post-details">
                    <h2 className="text-black fs-14">
                      Medium Spicy Spagethi Italiano
                    </h2>
                  </Link>
                  <span className="text-black font-w600 d-inline-block me-3">
                    $5.6{" "}
                  </span>{" "}
                  <span className="fs-14">Order 89x</span>
                </div>
                <img src={menu9} alt="menu9" width={60} className="rounded" />
              </div>
              <div className="d-flex pb-3 mb-3 border-bottom tr-row align-items-center">
                <span className="num">#2</span>
                <div className="me-auto pe-3">
                  <Link to="post-details">
                    <h2 className="text-black fs-14">
                      Watermelon juice with ice
                    </h2>
                  </Link>
                  <span className="text-black font-w600 d-inline-block me-3">
                    $5.6{" "}
                  </span>{" "}
                  <span className="fs-14">Order 89x</span>
                </div>
                <img src={menu10} alt="menu9" width={60} className="rounded" />
              </div>
              <div className="d-flex pb-3 mb-3 border-bottom tr-row align-items-center">
                <span className="num">#3</span>
                <div className="me-auto pe-3">
                  <Link to="post-details">
                    <h2 className="text-black fs-14">
                      Chicken curry special with cucumber
                    </h2>
                  </Link>
                  <span className="text-black font-w600 d-inline-block me-3">
                    $5.6{" "}
                  </span>{" "}
                  <span className="fs-14">Order 89x</span>
                </div>
                <img src={menu11} alt="menu11" width={60} className="rounded" />
              </div>
              <div className="d-flex pb-3 mb-3 border-bottom tr-row align-items-center">
                <span className="num">#4</span>
                <div className="me-auto pe-3">
                  <Link to="post-details">
                    <h2 className="text-black fs-14">
                      Italiano Pizza With Garlic
                    </h2>
                  </Link>
                  <span className="text-black font-w600 d-inline-block me-3">
                    $5.6{" "}
                  </span>{" "}
                  <span className="fs-14">Order 89x</span>
                </div>
                <img src={menu12} alt="menu12" width={60} className="rounded" />
              </div>
              <div className="d-flex tr-row align-items-center">
                <span className="num">#5</span>
                <div className="me-auto pe-3">
                  <Link to="post-details">
                    <h2 className="text-black fs-14">
                      Tuna Soup spinach with himalaya salt
                    </h2>
                  </Link>
                  <span className="text-black font-w600 d-inline-block me-3">
                    $5.6{" "}
                  </span>{" "}
                  <span className="fs-14">Order 89x</span>
                </div>
                <img src={menu9} alt="menu9" width={60} className="rounded" />
              </div>
            </div>
            <div className="card-footer border-0 pt-0"></div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="row">
            <div className="col-xl-12">
              <div className="card">
                <Tab.Container defaultActiveKey="monthly">
                  <div className="card-header border-0 pb-0 d-sm-flex flex-wrap d-block">
                    <div>
                      <h4 className="card-title mb-1">Most Selling Items</h4>
                      <small className="mb-0">
                        Lorem ipsum dolor sit amet, consectetur
                      </small>
                    </div>
                    <div className="card-action card-tabs mt-3 mt-sm-0">
                      <Nav as="ul" className="nav nav-tabs" role="tablist">
                        <Nav.Item as="li" className="nav-item">
                          <Nav.Link
                            className="nav-link"
                            eventKey="monthly"
                            role="tab"
                          >
                            Monthly
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li" className="nav-item">
                          <Nav.Link
                            className="nav-link"
                            eventKey="weekly"
                            role="tab"
                          >
                            Weekly
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li" className="nav-item">
                          <Nav.Link
                            className="nav-link"
                            eventKey="today"
                            role="tab"
                          >
                            Today
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </div>
                  </div>
                  <Tab.Content className="card-body p-0 tab-content">
                    <Tab.Pane
                      eventKey="monthly"
                      className="tab-pane fade"
                      id="monthly"
                    >
                      <MonthlySelling />
                    </Tab.Pane>
                    <Tab.Pane
                      eventKey="weekly"
                      className="tab-pane fade"
                      id="weekly"
                    >
                      <WeeklySelling />
                    </Tab.Pane>
                    <Tab.Pane
                      eventKey="today"
                      className="tab-pane fade"
                      id="today"
                    >
                      <DailySelling />
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>
            </div>
            <div className="col-xl-12">
              <div className="card">
                <div className="card-header border-0 pb-0 d-sm-flex d-block">
                  <div>
                    <h4 className="card-title mb-1">Trending Items</h4>
                    <small className="mb-0">
                      Lorem ipsum dolor sit amet, consectetur
                    </small>
                  </div>
                  <Dropdown className="mt-3 mt-sm-0">
                    <Dropdown.Toggle
                      type="button"
                      className="btn btn-primary dropdown-toggle light fs-14"
                                            
                    >
                      Weekly
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu">
                      <Dropdown.Item className="dropdown-item" to="#;">
                        Daily
                      </Dropdown.Item>
                      <Dropdown.Item className="dropdown-item" to="#;">
                        Weekly
                      </Dropdown.Item>
                      <Dropdown.Item className="dropdown-item" to="#;">
                        Monthly
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div className="card-body p-0 pt-3">
                  <div className="media items-list-1">
                    <span className="number col-1 px-0 align-self-center">
                      #1
                    </span>
                    <Link to="ecom-product-detail">
                      <img
                        className="img-fluid rounded me-3"
                        width={85}
                        src={dish_pic1}
                        alt="dish_pic1"
                      />
                    </Link>
                    <div className="media-body col-sm-4 col-xxl-5 px-0">
                      <h5 className="mt-0 mb-3">
                        <Link className="text-black" to="ecom-product-detail">
                          Tuna soup spinach with himalaya salt
                        </Link>
                      </h5>
                      <small className="font-w500">
                        <strong className="text-secondary me-2">$12.56</strong>{" "}
                        <Link className="text-primary" to="#;">
                          PIZZA
                        </Link>
                      </small>
                    </div>
                    <div className="media-footer ms-auto col-sm-3 mt-sm-0 mt-3 px-0 d-flex align-self-center align-items-center">
                      <div className="me-3">
                        <span
                          className="peity-success"
                          data-style="width:100%;"
                          style={{ display: "none" }}
                        >
                          0,2,1,4
                        </span>
                        <svg className="peity" height={30} width={47}>
                          <polygon
                            fill="rgba(48, 194, 89, .2)"
                            points="0 28.5 0 28.5 15.666666666666666 15 31.333333333333332 21.75 47 1.5 47 28.5"
                          />
                          <polyline
                            fill="none"
                            points="0 28.5 15.666666666666666 15 31.333333333333332 21.75 47 1.5"
                            stroke="#30c259"
                            strokeWidth={3}
                            strokeLinecap="square"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="mb-0 font-w600 text-black">524</h3>
                        <span className="fs-14">Sales (12%)</span>
                      </div>
                    </div>
                  </div>
                  <div className="media items-list-1">
                    <span className="number col-1 px-0 align-self-center">
                      #2
                    </span>
                    <Link to="ecom-product-detail">
                      <img
                        className="img-fluid rounded me-3"
                        width={85}
                        src={dish_pic2}
                        alt="dish_pic2"
                      />
                    </Link>
                    <div className="media-body col-sm-4 col-xxl-5 px-0">
                      <h5 className="mt-0 mb-3 text-black">
                        <Link className="text-black" to="ecom-product-detail">
                          Tuna soup spinach with himalaya salt
                        </Link>
                      </h5>
                      <small className="font-w500">
                        <strong className="text-secondary me-2">$12.56</strong>{" "}
                        <Link className="text-primary" to="#;">
                          JUICE
                        </Link>
                      </small>
                    </div>
                    <div className="media-footer ms-auto col-sm-3 mt-sm-0 mt-3 px-0 d-flex align-self-center align-items-center">
                      <div className="me-3">
                        <span
                          className="peity-danger"
                          data-style="width:100%;"
                          style={{ display: "none" }}
                        >
                          4,1,2,0
                        </span>
                        <svg className="peity" height={30} width={47}>
                          <polygon
                            fill="rgba(248, 79, 78, .2)"
                            points="0 28.5 0 1.5 15.666666666666666 21.75 31.333333333333332 15 47 28.5 47 28.5"
                          />
                          <polyline
                            fill="none"
                            points="0 1.5 15.666666666666666 21.75 31.333333333333332 15 47 28.5"
                            stroke="#f84f4e"
                            strokeWidth={3}
                            strokeLinecap="square"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="mb-0 font-w600 text-black">215</h3>
                        <span className="fs-14">Sales (12%)</span>
                      </div>
                    </div>
                  </div>
                  <div className="media items-list-1">
                    <span className="number col-1 px-0 align-self-center">
                      #3
                    </span>
                    <Link to="ecom-product-detail">
                      <img
                        className="img-fluid rounded me-3"
                        width={85}
                        src={dish_pic3}
                        alt="dish_pic3"
                      />
                    </Link>
                    <div className="media-body col-sm-4 col-xxl-5 px-0">
                      <h5 className="mt-0 mb-3 text-black">
                        <Link className="text-black" to="ecom-product-detail">
                          Chicken curry special with cucumber
                        </Link>
                      </h5>
                      <small className="font-w500">
                        <strong className="text-secondary me-2">$12.56</strong>{" "}
                        <Link className="text-primary" to="#;">
                          PIZZA
                        </Link>
                      </small>
                    </div>
                    <div className="media-footer ms-auto col-sm-3 mt-sm-0 mt-3 px-0 d-flex align-self-center align-items-center">
                      <div className="me-3">
                        <span
                          className="peity-success"
                          data-style="width:100%;"
                          style={{ display: "none" }}
                        >
                          0,2,1,4
                        </span>
                        <svg className="peity" height={30} width={47}>
                          <polygon
                            fill="rgba(48, 194, 89, .2)"
                            points="0 28.5 0 28.5 15.666666666666666 15 31.333333333333332 21.75 47 1.5 47 28.5"
                          />
                          <polyline
                            fill="none"
                            points="0 28.5 15.666666666666666 15 31.333333333333332 21.75 47 1.5"
                            stroke="#30c259"
                            strokeWidth={3}
                            strokeLinecap="square"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="mb-0 font-w600 text-black">524</h3>
                        <span className="fs-14">Sales (12%)</span>
                      </div>
                    </div>
                  </div>
                  <div className="media items-list-1">
                    <span className="number col-1 px-0 align-self-center">
                      #4
                    </span>
                    <Link to="ecom-product-detail">
                      <img
                        className="img-fluid rounded me-3"
                        width={85}
                        src={dish_pic4}
                        alt="dish_pic4"
                      />
                    </Link>
                    <div className="media-body col-sm-4 col-xxl-5 px-0">
                      <h5 className="mt-0 mb-3 text-black">
                        <Link className="text-black" to="ecom-product-detail">
                          Watermelon juice with ice
                        </Link>
                      </h5>
                      <small className="font-w500">
                        <strong className="text-secondary me-2">$12.56</strong>{" "}
                        <Link className="text-primary" to="#;">
                          PIZZA
                        </Link>
                      </small>
                    </div>
                    <div className="media-footer ms-auto col-sm-3 mt-sm-0 mt-3 px-0 d-flex align-self-center align-items-center">
                      <div className="me-3">
                        <span
                          className="peity-success"
                          data-style="width:100%;"
                          style={{ display: "none" }}
                        >
                          0,2,1,4
                        </span>
                        <svg className="peity" height={30} width={47}>
                          <polygon
                            fill="rgba(48, 194, 89, .2)"
                            points="0 28.5 0 28.5 15.666666666666666 15 31.333333333333332 21.75 47 1.5 47 28.5"
                          />
                          <polyline
                            fill="none"
                            points="0 28.5 15.666666666666666 15 31.333333333333332 21.75 47 1.5"
                            stroke="#30c259"
                            strokeWidth={3}
                            strokeLinecap="square"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="mb-0 font-w600 text-black">76</h3>
                        <span className="fs-14">Sales (12%)</span>
                      </div>
                    </div>
                  </div>
                  <div className="media items-list-1">
                    <span className="number col-1 px-0 align-self-center">
                      #5
                    </span>
                    <Link to="ecom-product-detail">
                      <img
                        className="img-fluid rounded me-3"
                        width={85}
                        src={dish_pic5}
                        alt="dish_pic5"
                      />
                    </Link>
                    <div className="media-body col-sm-4 col-xxl-5 px-0">
                      <h5 className="mt-0 mb-3 text-black">
                        <Link className="text-black" to="ecom-product-detail">
                          Tuna soup spinach with himalaya salt
                        </Link>
                      </h5>
                      <small className="font-w500">
                        <strong className="text-secondary me-2">$12.56</strong>{" "}
                        <Link className="text-primary" to="#;">
                          BURGER
                        </Link>
                      </small>
                    </div>
                    <div className="media-footer ms-auto col-sm-3 mt-sm-0 mt-3 px-0 d-flex align-self-center align-items-center">
                      <div className="me-3">
                        <span
                          className="peity-danger"
                          data-style="width:100%;"
                          style={{ display: "none" }}
                        >
                          4,1,2,0
                        </span>
                        <svg className="peity" height={30} width={47}>
                          <polygon
                            fill="rgba(248, 79, 78, .2)"
                            points="0 28.5 0 1.5 15.666666666666666 21.75 31.333333333333332 15 47 28.5 47 28.5"
                          />
                          <polyline
                            fill="none"
                            points="0 1.5 15.666666666666666 21.75 31.333333333333332 15 47 28.5"
                            stroke="#f84f4e"
                            strokeWidth={3}
                            strokeLinecap="square"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="mb-0 font-w600 text-black">180</h3>
                        <span className="fs-14">Sales (12%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="row">
            <div className="col-xl-12">
              <div className="card">
                <div className="card-header border-0 pb-0 d-sm-flex d-block">
                  <div>
                    <h4 className="card-title mb-1">Chart Orders</h4>
                    <small className="mb-0">
                      Lorem ipsum dolor sit amet, consectetur
                    </small>
                  </div>
                  <Dropdown className="dropdown mt-3 mt-sm-0">
                    <Dropdown.Toggle
                      type="button"
                      className="btn btn-primary dropdown-toggle light fs-14"
                                            
                    >
                      Weekly
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu">
                      <Dropdown.Item className="dropdown-item" to="#;">
                        Daily
                      </Dropdown.Item>
                      <Dropdown.Item className="dropdown-item" to="#;">
                        Weekly
                      </Dropdown.Item>
                      <Dropdown.Item className="dropdown-item" to="#;">
                        Monthly
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div className="card-body revenue-chart px-3 pb-0">
                  <div className="d-flex align-items-end ps-3">
                    <div className="me-4">
                      <h3 className="font-w600 mb-0">
                        <img
                          src={IcStat3}
                          height={22}
                          width={22}
                          className="me-2 mb-1"
                          alt="IcStat3"
                        />
                        <CountUp start={1} end={257} duration={5} suffix=" k" />
                      </h3>
                      <small className="text-dark fs-14">Total Sales</small>
                    </div>
                    <div>
                      <h3 className="font-w600 mb-0">
                        <img
                          src={IcStat3}
                          height={22}
                          width={22}
                          className="me-2 mb-1"
                          alt="IcStat3"
                        />
                        <CountUp start={1} end={1245} duration={5} />
                      </h3>
                      <small className="text-dark fs-14">
                        Avg. Sales per day
                      </small>
                    </div>
                  </div>
                  <ActivityLineChart />
                </div>
              </div>
            </div>
            <div className="col-xl-12">
              <div className="card">
                <Tab.Container defaultActiveKey="monthly">
                  <div className="card-header border-0 pb-0 d-sm-flex flex-wrap d-block">
                    <div>
                      <h4 className="card-title mb-1">Most Favorites Items</h4>
                      <small className="mb-0">
                        Lorem ipsum dolor sit amet, consectetur
                      </small>
                    </div>
                    <div className="card-action card-tabs">
                      <Nav as="ul" className="nav nav-tabs" role="tablist">
                        <Nav.Item as="li" className="nav-item">
                          <Nav.Link className="nav-link" eventKey="monthly">
                            Monthly
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li" className="nav-item">
                          <Nav.Link className="nav-link" eventKey="weekly">
                            Weekly
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li" className="nav-item">
                          <Nav.Link className="nav-link" eventKey="today">
                            Today
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </div>
                  </div>
                  <Tab.Content className="card-body tab-content">
                    <Tab.Pane
                      eventKey="monthly"
                      className="tab-pane fade"
                      id="monthly1"
                    >
                      <MonthlyFavorites />
                    </Tab.Pane>
                    <Tab.Pane
                      eventKey="weekly"
                      className="tab-pane fade"
                      id="weekly1"
                    >
                      <WeeklyFavorites />
                    </Tab.Pane>
                    <Tab.Pane
                      eventKey="today"
                      className="tab-pane fade"
                      id="today1"
                    >
                      <DailyFavorites />
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Analytics;
