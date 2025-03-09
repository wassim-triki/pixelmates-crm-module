import React, { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import pMinDelay from "p-min-delay";
import loadable from "@loadable/component";
import { Dropdown, Nav, Tab } from "react-bootstrap";
import ChartDonught2 from "../Sego/Home/donught2";
import ChartDonught3 from "../Sego/Home/donught3";

import ActivityLineChart from "../Sego/Home/ActivityLineChart";
import TimeLineChart from "../Sego/Home/TimeLineChart";
import TimeLineChart2 from "../Sego/Home/TimeLineChart2";
import TimeLineChart3 from "../Sego/Home/TimeLineChart3";

//** Import Image */
import menu9 from "../../../assets/images/menus/9.png";
import menu10 from "../../../assets/images/menus/10.png";
import menu11 from "../../../assets/images/menus/11.png";
import menu12 from "../../../assets/images/menus/12.png";

const BarChart = loadable(() =>
  pMinDelay(import("../Sego/Home/BarChart"), 1000)
);
const RadialBarChart = loadable(() =>
  pMinDelay(import("../Sego/Home/RadialBarChart"), 1000)
);

function Home() {  
	const [session, setSession] = useState('Monthly');
  return (
    <>
      <div className="row">
        <div className="col-xl-3 col-xxl-6 col-sm-6">
          <div className="card grd-card">
            <div className="card-body">
              <div className="media align-items-center">
                <div className="media-body me-2">
                  <h2 className="text-white font-w600">459</h2>
                  <span className="text-white">Total Menus</span>
                </div>
                <div className="d-inline-block position-relative donut-chart-sale">
                  <ChartDonught3
                    backgroundColor="#FFFFFF"
                    backgroundColor2="#F6B4AF"
                    height="100"
                    width="100"
                    value="75"
                  />
                  <small className="text-primary">
                    <svg
                      width={30}
                      height={30}
                      viewBox="0 0 30 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0)">
                        <path
                          d="M30 7.03697H21.4497V1.75781H27.7137V0H19.6918V7.03697H11.1417V12.3132H12.9572L13.1193 14.7549H8.50227C5.03494 14.7549 2.17072 17.3859 1.80038 20.7561C0.75531 21.1073 0 22.0953 0 23.2571C0 24.4244 0.762405 25.4164 1.81526 25.7632C2.1769 28.1582 4.24873 30 6.74286 30H27.0115L28.1845 12.3132H30V7.03697ZM8.50227 16.5127H16.2202C18.669 16.5127 20.7097 18.2881 21.1263 20.6188H3.59619C4.01276 18.2881 6.05324 16.5127 8.50227 16.5127ZM2.63809 22.3766H22.0841C22.5696 22.3766 22.9646 22.7717 22.9646 23.2569C22.9646 23.7424 22.5696 24.1372 22.0841 24.1372H2.63809C2.15263 24.1372 1.75781 23.7424 1.75781 23.2569C1.75781 22.7717 2.15263 22.3766 2.63809 22.3766ZM6.74286 28.2422C5.26886 28.2422 4.02351 27.2479 3.63968 25.8952H21.0825C20.6989 27.2479 19.4536 28.2422 17.9794 28.2422H6.74286ZM25.3665 28.2422H21.7738C22.3618 27.5517 22.7655 26.7002 22.907 25.7632C23.9598 25.4164 24.7224 24.4244 24.7224 23.2571C24.7224 22.0953 23.9671 21.1073 22.9221 20.7561C22.5517 17.3859 19.6877 14.7549 16.2202 14.7549H14.881L14.7189 12.3132H26.4228L25.3665 28.2422ZM28.2422 10.5553H12.8996V8.79478H28.2422V10.5553Z"
                          fill="#EA7A9A"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0">
                          <rect width={30} height={30} fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </small>
                  <span className="circle bg-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-xxl-6 col-sm-6">
          <div className="card grd-card">
            <div className="card-body">
              <div className="media align-items-center">
                <div className="media-body me-2">
                  <h2 className="text-white font-w600">$ 87,561</h2>
                  <span className="text-white">Total Revenue</span>
                </div>
                <div className="d-inline-block position-relative donut-chart-sale">
                  <ChartDonught3
                    backgroundColor="#FFFFFF"
                    backgroundColor2="#F6B4AF"
                    height="100"
                    width="100"
                    value="40"
                  />
                  <small className="text-primary">
                    <svg
                      width={20}
                      height={36}
                      viewBox="0 0 20 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.08 24.36C19.08 25.64 18.76 26.8667 18.12 28.04C17.48 29.1867 16.5333 30.1467 15.28 30.92C14.0533 31.6933 12.5733 32.1333 10.84 32.24V35.48H8.68V32.24C6.25333 32.0267 4.28 31.2533 2.76 29.92C1.24 28.56 0.466667 26.84 0.44 24.76H4.32C4.42667 25.88 4.84 26.8533 5.56 27.68C6.30667 28.5067 7.34667 29.0267 8.68 29.24V19.24C6.89333 18.7867 5.45333 18.32 4.36 17.84C3.26667 17.36 2.33333 16.6133 1.56 15.6C0.786667 14.5867 0.4 13.2267 0.4 11.52C0.4 9.36 1.14667 7.57333 2.64 6.16C4.16 4.74666 6.17333 3.96 8.68 3.8V0.479998H10.84V3.8C13.1067 3.98667 14.9333 4.72 16.32 6C17.7067 7.25333 18.5067 8.89333 18.72 10.92H14.84C14.7067 9.98667 14.2933 9.14667 13.6 8.4C12.9067 7.62667 11.9867 7.12 10.84 6.88V16.64C12.6 17.0933 14.0267 17.56 15.12 18.04C16.24 18.4933 17.1733 19.2267 17.92 20.24C18.6933 21.2533 19.08 22.6267 19.08 24.36ZM4.12 11.32C4.12 12.6267 4.50667 13.6267 5.28 14.32C6.05333 15.0133 7.18667 15.5867 8.68 16.04V6.8C7.29333 6.93333 6.18667 7.38667 5.36 8.16C4.53333 8.90667 4.12 9.96 4.12 11.32ZM10.84 29.28C12.28 29.12 13.4 28.6 14.2 27.72C15.0267 26.84 15.44 25.7867 15.44 24.56C15.44 23.2533 15.04 22.2533 14.24 21.56C13.44 20.84 12.3067 20.2667 10.84 19.84V29.28Z"
                        fill="#EA7A9A"
                      />
                    </svg>
                  </small>
                  <span className="circle bg-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-xxl-6 col-sm-6">
          <div className="card grd-card">
            <div className="card-body">
              <div className="media align-items-center">
                <div className="media-body me-2">
                  <h2 className="text-white font-w600">247</h2>
                  <span className="text-white">Total Oders</span>
                </div>
                <div className="d-inline-block position-relative donut-chart-sale">
                  <ChartDonught3
                    backgroundColor="#FFFFFF"
                    backgroundColor2="#F6B4AF"
                    height="100"
                    width="100"
                    value="50"
                  />
                  <small className="text-primary">
                    <svg
                      width={40}
                      height={40}
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 32.5H28.75C29.7442 32.4989 30.6974 32.1035 31.4004 31.4004C32.1035 30.6974 32.4989 29.7442 32.5 28.75V18.75C32.5 18.4185 32.3683 18.1005 32.1339 17.8661C31.8995 17.6317 31.5815 17.5 31.25 17.5C30.9185 17.5 30.6005 17.6317 30.3661 17.8661C30.1317 18.1005 30 18.4185 30 18.75V28.75C29.9997 29.0814 29.8679 29.3992 29.6336 29.6336C29.3992 29.8679 29.0814 29.9997 28.75 30H10C9.66857 29.9997 9.3508 29.8679 9.11645 29.6336C8.88209 29.3992 8.7503 29.0814 8.75 28.75V11.25C8.7503 10.9186 8.88209 10.6008 9.11645 10.3664C9.3508 10.1321 9.66857 10.0003 10 10H21.25C21.5815 10 21.8995 9.8683 22.1339 9.63388C22.3683 9.39946 22.5 9.08152 22.5 8.75C22.5 8.41848 22.3683 8.10054 22.1339 7.86612C21.8995 7.6317 21.5815 7.5 21.25 7.5H10C9.00577 7.50109 8.05258 7.89653 7.34956 8.59956C6.64653 9.30258 6.25109 10.2558 6.25 11.25V28.75C6.25109 29.7442 6.64653 30.6974 7.34956 31.4004C8.05258 32.1035 9.00577 32.4989 10 32.5Z"
                        fill="#EA7A9A"
                      />
                      <path
                        d="M31.25 2.5C30.0138 2.5 28.8055 2.86656 27.7777 3.55331C26.7498 4.24007 25.9488 5.21619 25.4757 6.35823C25.0027 7.50027 24.8789 8.75693 25.1201 9.96931C25.3612 11.1817 25.9565 12.2953 26.8306 13.1694C27.7046 14.0435 28.8183 14.6388 30.0307 14.8799C31.243 15.1211 32.4997 14.9973 33.6417 14.5242C34.7838 14.0512 35.7599 13.2501 36.4466 12.2223C37.1334 11.1945 37.5 9.98613 37.5 8.75C37.498 7.093 36.8389 5.50442 35.6672 4.33274C34.4955 3.16106 32.907 2.50195 31.25 2.5ZM31.25 12.5C30.5083 12.5 29.7833 12.2801 29.1666 11.868C28.5499 11.456 28.0692 10.8703 27.7854 10.1851C27.5016 9.49984 27.4273 8.74584 27.572 8.01841C27.7167 7.29098 28.0739 6.6228 28.5983 6.09835C29.1228 5.5739 29.7909 5.21675 30.5184 5.07206C31.2458 4.92736 31.9998 5.00162 32.685 5.28545C33.3702 5.56928 33.9559 6.04993 34.368 6.66661C34.78 7.2833 35 8.00832 35 8.75C34.9989 9.74423 34.6034 10.6974 33.9004 11.4004C33.1974 12.1035 32.2442 12.4989 31.25 12.5Z"
                        fill="#EA7A9A"
                      />
                      <path
                        d="M12.5 15H18.75C19.0815 15 19.3995 14.8683 19.6339 14.6339C19.8683 14.3995 20 14.0815 20 13.75C20 13.4185 19.8683 13.1005 19.6339 12.8661C19.3995 12.6317 19.0815 12.5 18.75 12.5H12.5C12.1685 12.5 11.8505 12.6317 11.6161 12.8661C11.3817 13.1005 11.25 13.4185 11.25 13.75C11.25 14.0815 11.3817 14.3995 11.6161 14.6339C11.8505 14.8683 12.1685 15 12.5 15Z"
                        fill="#EA7A9A"
                      />
                      <path
                        d="M11.25 18.75C11.25 19.0815 11.3817 19.3995 11.6161 19.6339C11.8505 19.8683 12.1685 20 12.5 20H23.75C24.0815 20 24.3995 19.8683 24.6339 19.6339C24.8683 19.3995 25 19.0815 25 18.75C25 18.4185 24.8683 18.1005 24.6339 17.8661C24.3995 17.6317 24.0815 17.5 23.75 17.5H12.5C12.1685 17.5 11.8505 17.6317 11.6161 17.8661C11.3817 18.1005 11.25 18.4185 11.25 18.75Z"
                        fill="#EA7A9A"
                      />
                    </svg>
                  </small>
                  <span className="circle bg-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-xxl-6 col-sm-6">
          <div className="card grd-card">
            <div className="card-body">
              <div className="media align-items-center">
                <div className="media-body me-2">
                  <h2 className="text-white font-w600">872</h2>
                  <span className="text-white">Total Customers</span>
                </div>
                <div className="d-inline-block position-relative donut-chart-sale">
                  <ChartDonught3
                    backgroundColor="#FFFFFF"
                    backgroundColor2="#F6B4AF"
                    height="100"
                    width="100"
                    value="90"
                  />
                  <small className="text-primary">
                    <svg
                      width={40}
                      height={40}
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.2501 21.25C17.239 21.25 18.2057 20.9568 19.0279 20.4074C19.8502 19.8579 20.491 19.0771 20.8695 18.1634C21.2479 17.2498 21.3469 16.2445 21.154 15.2746C20.9611 14.3046 20.4849 13.4137 19.7856 12.7145C19.0863 12.0152 18.1954 11.539 17.2255 11.3461C16.2556 11.1531 15.2503 11.2522 14.3366 11.6306C13.423 12.009 12.6421 12.6499 12.0927 13.4722C11.5433 14.2944 11.2501 15.2611 11.2501 16.25C11.2514 17.5757 11.7786 18.8467 12.716 19.7841C13.6534 20.7215 14.9244 21.2487 16.2501 21.25ZM16.2501 13.75C16.7445 13.75 17.2279 13.8966 17.639 14.1713C18.0501 14.446 18.3705 14.8365 18.5598 15.2933C18.749 15.7501 18.7985 16.2528 18.702 16.7377C18.6056 17.2227 18.3675 17.6681 18.0178 18.0178C17.6682 18.3674 17.2227 18.6055 16.7378 18.702C16.2528 18.7984 15.7502 18.7489 15.2934 18.5597C14.8365 18.3705 14.4461 18.0501 14.1714 17.6389C13.8967 17.2278 13.7501 16.7445 13.7501 16.25C13.751 15.5872 14.0146 14.9519 14.4833 14.4832C14.9519 14.0146 15.5873 13.7509 16.2501 13.75Z"
                        fill="#EA7A9A"
                      />
                      <path
                        d="M35.78 24.4625C36.1927 23.9099 36.4684 23.2672 36.5844 22.5873C36.7005 21.9074 36.6537 21.2097 36.4478 20.5514L35.6543 17.9697C35.2817 16.7452 34.5244 15.6734 33.4946 14.9133C32.4648 14.1532 31.2174 13.7453 29.9375 13.75H24.3287C23.9971 13.75 23.6792 13.8817 23.4448 14.1162C23.2103 14.3506 23.0787 14.6685 23.0787 15C23.0787 15.3316 23.2103 15.6495 23.4448 15.8839C23.6792 16.1183 23.9971 16.25 24.3287 16.25H29.9375C30.6823 16.2475 31.4081 16.485 32.0073 16.9274C32.6064 17.3698 33.0471 17.9935 33.2639 18.706L34.0574 21.2867C34.145 21.5713 34.1645 21.8725 34.1145 22.1661C34.0645 22.4597 33.9463 22.7375 33.7694 22.977C33.5925 23.2166 33.3619 23.4114 33.0961 23.5456C32.8302 23.6799 32.5366 23.7499 32.2388 23.75H20.7777C20.7423 23.75 20.7127 23.7672 20.6777 23.7702C20.5937 23.7669 20.5125 23.75 20.4273 23.75H12.5898C11.2007 23.745 9.84705 24.188 8.72972 25.0132C7.61239 25.8385 6.79097 27.0021 6.3874 28.3313L5.45415 31.3625C5.23616 32.0719 5.18764 32.8225 5.31248 33.5541C5.43732 34.2856 5.73204 34.9777 6.17296 35.5746C6.61388 36.1715 7.18869 36.6567 7.85119 36.9911C8.51369 37.3255 9.24541 37.4998 9.98753 37.5H23.0287C23.7708 37.4999 24.5026 37.3256 25.1652 36.9913C25.8277 36.6569 26.4026 36.1717 26.8436 35.5748C27.2845 34.9778 27.5793 34.2858 27.7042 33.5542C27.829 32.8226 27.7805 32.0719 27.5625 31.3625L26.6299 28.3315C26.3936 27.5767 26.0217 26.8713 25.5323 26.25H32.2388C32.9283 26.2532 33.6088 26.0929 34.2244 25.7821C34.8399 25.4714 35.3731 25.0192 35.78 24.4625ZM24.8328 34.089C24.6255 34.3727 24.3539 34.6031 24.0403 34.7615C23.7267 34.9198 23.38 35.0016 23.0287 35H9.98753C9.63653 35 9.29043 34.9176 8.97708 34.7594C8.66373 34.6012 8.39187 34.3718 8.18337 34.0894C7.97487 33.807 7.83555 33.4797 7.77661 33.1337C7.71767 32.7876 7.74077 32.4326 7.84403 32.0971L8.77665 29.0661C9.02442 28.249 9.52925 27.5335 10.2161 27.0262C10.903 26.5188 11.7352 26.2466 12.5892 26.25H20.4267C21.2806 26.2466 22.1128 26.5188 22.7997 27.0262C23.4865 27.5335 23.9914 28.249 24.2392 29.0661L25.1718 32.0971C25.2769 32.4324 25.301 32.7877 25.2421 33.1341C25.1832 33.4804 25.0429 33.8078 24.8328 34.0894V34.089Z"
                        fill="#EA7A9A"
                      />
                      <path
                        d="M26.8751 11.25C27.7403 11.25 28.5862 10.9934 29.3057 10.5127C30.0251 10.0319 30.5859 9.34866 30.917 8.54923C31.2482 7.74981 31.3348 6.87014 31.166 6.02148C30.9972 5.17281 30.5805 4.39326 29.9686 3.78141C29.3568 3.16955 28.5772 2.75288 27.7286 2.58407C26.8799 2.41526 26.0002 2.5019 25.2008 2.83303C24.4014 3.16416 23.7181 3.72492 23.2374 4.44438C22.7567 5.16384 22.5001 6.0097 22.5001 6.875C22.5015 8.03489 22.9628 9.14688 23.783 9.96705C24.6032 10.7872 25.7152 11.2486 26.8751 11.25ZM26.8751 5C27.2459 5 27.6084 5.10997 27.9167 5.31599C28.2251 5.52202 28.4654 5.81485 28.6073 6.15747C28.7492 6.50008 28.7864 6.87708 28.714 7.24079C28.6417 7.6045 28.4631 7.9386 28.2009 8.20082C27.9387 8.46304 27.6046 8.64162 27.2408 8.71397C26.8771 8.78631 26.5001 8.74918 26.1575 8.60727C25.8149 8.46535 25.5221 8.22503 25.3161 7.91669C25.11 7.60835 25.0001 7.24584 25.0001 6.875C25.0006 6.37789 25.1983 5.9013 25.5499 5.54979C25.9014 5.19829 26.3779 5.00056 26.8751 5Z"
                        fill="#EA7A9A"
                      />
                    </svg>
                  </small>
                  <span className="circle bg-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="card">
            <Tab.Container defaultActiveKey="monthly">
              <div className="card-header d-sm-flex flex-wrap d-block pb-0 border-0">
                <div className="me-auto pe-3">
                  <h4 className="text-black fs-20">Orders Summary</h4>
                  <p className="fs-13 mb-0 text-black">
                    Lorem ipsum dolor sit amet, consectetur
                  </p>
                </div>
                <div className="card-action card-tabs mt-3 mt-sm-0 mt-3 mb-sm-0 mb-3 mt-sm-0">
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
              <div className="card-body">
                <Tab.Content className="tab-content">
                  <Tab.Pane
                    eventKey="monthly"
                    className="tab-pane fade"
                    id="Monthly"
                  >
                    <div className="row align-items-center">
                      <div className="col-sm-6">
                        <RadialBarChart series={85} />
                      </div>
                      <div className="col-sm-6 mb-sm-0 mb-3 text-center">
                        <h3 className="fs-28 text-black font-w600">
                          $456,005.56
                        </h3>
                        <span className="mb-3 d-block">from $500,000.00</span>
                        <p className="fs-14">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do{" "}
                        </p>
                        <Link
                          to="post-details"
                          className="btn btn-primary light btn-rounded"
                        >
                          More Details
                        </Link>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-4 mb-md-0 mb-3">
                        <div className="p-3 border rounded">
                          <h3 className="fs-32 text-black font-w600 mb-1">
                            25
                          </h3>
                          <span className="fs-18 text-primary text-primary">On Delivery</span>
                        </div>
                      </div>
                      <div className="col-sm-4 mb-md-0 mb-3">
                        <div className="p-3 border rounded">
                          <h3 className="fs-32 text-black font-w600 mb-1">
                            60
                          </h3>
                          <span className="fs-18 text-primary text-primary">Delivered</span>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="p-3 border rounded">
                          <h3 className="fs-32 text-black font-w600 mb-1">7</h3>
                          <span className="fs-18 text-primary text-primary">Canceled</span>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane
                    eventKey="weekly"
                    className="tab-pane fade"
                    id="Weekly"
                  >
                    <div className="row align-items-center">
                      <div className="col-sm-6">
                        <RadialBarChart series={40} />
                      </div>
                      <div className="col-sm-6 mb-sm-0 mb-3 text-center">
                        <h3 className="fs-28 text-black font-w600">
                          $150,002.00
                        </h3>
                        <span className="mb-3 d-block">from $400,000.00</span>
                        <p className="fs-14">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do{" "}
                        </p>
                        <Link
                          to="post-details"
                          className="btn btn-primary light btn-rounded"
                        >
                          More Details
                        </Link>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-4 mb-md-0 mb-3">
                        <div className="p-3 border rounded">
                          <h3 className="fs-32 text-black font-w600 mb-1">
                            30
                          </h3>
                          <span className="fs-18 text-primary">On Delivery</span>
                        </div>
                      </div>
                      <div className="col-sm-4 mb-md-0 mb-3">
                        <div className="p-3 border rounded">
                          <h3 className="fs-32 text-black font-w600 mb-1">
                            55
                          </h3>
                          <span className="fs-18 text-primary">Delivered</span>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="p-3 border rounded">
                          <h3 className="fs-32 text-black font-w600 mb-1">9</h3>
                          <span className="fs-18 text-primary">Canceled</span>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane
                    eventKey="today"
                    className="tab-pane fade"
                    id="Today"
                  >
                    <div className="row align-items-center">
                      <div className="col-sm-6">
                        <RadialBarChart series={55} />
                      </div>
                      <div className="col-sm-6 mb-sm-0 mb-3 text-center">
                        <h3 className="fs-28 text-black font-w600">
                          $856,005.56
                        </h3>
                        <span className="mb-3 d-block">from $800,000.00</span>
                        <p className="fs-14">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do{" "}
                        </p>
                        <Link
                          to="post-details"
                          className="btn btn-primary light btn-rounded"
                        >
                          More Details
                        </Link>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-4 mb-md-0 mb-3">
                        <div className="p-3 border rounded">
                          <h3 className="fs-32 text-black font-w600 mb-1">
                            45
                          </h3>
                          <span className="fs-18 text-primary">On Delivery</span>
                        </div>
                      </div>
                      <div className="col-sm-4 mb-md-0 mb-3">
                        <div className="p-3 border rounded">
                          <h3 className="fs-32 text-black font-w600 mb-1">
                            90
                          </h3>
                          <span className="fs-18 text-primary">Delivered</span>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="p-3 border rounded">
                          <h3 className="fs-32 text-black font-w600 mb-1">3</h3>
                          <span className="fs-18 text-primary">Canceled</span>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </div>
            </Tab.Container>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header d-sm-flex d-block pb-0 border-0">
              <div className="me-auto pe-3">
                <h4 className="text-black fs-20">Revenue</h4>
                <p className="fs-13 mb-0 text-black">
                  Lorem ipsum dolor sit amet, consectetur
                </p>
              </div>
               <Dropdown className="dropdown mt-sm-0 mt-3">
                <Dropdown.Toggle type="button" className="btn btn-primary light  dropdown-toggle">{session}</Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu dropdown-menu-right" align="end">
                  <Dropdown.Item onClick={()=>setSession("Month")} to="/">Month</Dropdown.Item>
                  <Dropdown.Item onClick={()=>setSession("Day")} to="/">Day</Dropdown.Item>
                  <Dropdown.Item onClick={()=>setSession("Week")} to="/">Week</Dropdown.Item>
                  <Dropdown.Item onClick={()=>setSession("Year")} to="/">Year</Dropdown.Item>
                </Dropdown.Menu>
               </Dropdown>
            </div>
            <div className="card-body" id="user-activity">
              <Tab.Container defaultActiveKey="all-food">
                <div className="d-flex flex-wrap mb-4">
                  <div className="me-auto mb-2 pe-3 d-flex align-items-center">
                    <svg
                      width={25}
                      height={26}
                      viewBox="0 0 25 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        width="3.54545"
                        height={26}
                        rx="1.77273"
                        fill="#EA7A9A"
                      />
                      <rect
                        x="7.09088"
                        y="7.09082"
                        width="3.54545"
                        height="18.9091"
                        rx="1.77273"
                        fill="#EA7A9A"
                      />
                      <rect
                        x="14.1819"
                        y="17.7271"
                        width="3.54545"
                        height="8.27273"
                        rx="1.77273"
                        fill="#EA7A9A"
                      />
                      <rect
                        x="21.2727"
                        y="3.54541"
                        width="3.54545"
                        height="22.4545"
                        rx="1.77273"
                        fill="#EA7A9A"
                      />
                    </svg>
                    <div className="ms-3">
                      <p className="fs-12 mb-1">Income</p>
                      <span className="fs-22 text-black font-w600">
                        $126,000
                      </span>
                    </div>
                  </div>
                  <div className="card-action revenue-tabs">
                    <Nav as="ul" className="nav nav-tabs" role="tablist">
                      <Nav.Item as="li" className="nav-item">
                        <Nav.Link
                          className="nav-link"
                          data-toggle="tab"
                          eventKey="all-food"
                          role="tab"
                        >
                          All Food
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li" className="nav-item">
                        <Nav.Link
                          className="nav-link"
                          data-toggle="tab"
                          eventKey="food"
                          role="tab"
                        >
                          Food
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li" className="nav-item">
                        <Nav.Link
                          className="nav-link"
                          data-toggle="tab"
                          eventKey="beverages"
                          role="tab"
                        >
                          Beverages
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </div>
                </div>
                <Tab.Content className="tab-content" id="myTabContent">
                  <Tab.Pane
                    className="tab-pane fade"
                    eventKey="all-food"                   
                  >
                    <ActivityLineChart dataActive={0} />
                  </Tab.Pane>
                  <Tab.Pane
                    className="tab-pane fade"
                    eventKey="food"                    
                  >
                    <ActivityLineChart dataActive={1} />
                  </Tab.Pane>
                  <Tab.Pane
                    className="tab-pane fade"
                    eventKey="beverages"                    
                  >
                    <ActivityLineChart dataActive={2} />
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </div>
          </div>
        </div>
        <div className="col-xl-9 col-xxl-8">
          <div className="row">
            <div className="col-xl-12">
              <div className="card">
                <Tab.Container defaultActiveKey="monthly">
                  <div className="card-header d-sm-flex d-block pb-0 border-0">
                    <div className="me-auto pe-3">
                      <h4 className="text-black fs-20">Customer Map</h4>
                      <p className="fs-13 mb-0 text-black">
                        Lorem ipsum dolor sit amet, consectetur
                      </p>
                    </div>
                    <div className="card-action card-tabs mt-3 mt-sm-0 mt-3 mb-sm-0 mb-3 mt-sm-0">
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
                  <div className="card-body pb-0">
                    <Tab.Content className="tab-content" id="myTabContent">
                      <Tab.Pane
                        className="tab-pane fade"
                        eventKey="monthly"
                        id="tab1"
                      >
                        <TimeLineChart />
                      </Tab.Pane>
                      <Tab.Pane
                        className="tab-pane fade"
                        eventKey="weekly"
                        id="tab2"
                      >
                        <TimeLineChart2 />
                      </Tab.Pane>
                      <Tab.Pane
                        className="tab-pane fade"
                        eventKey="today"
                        id="tab3"
                      >
                        <TimeLineChart3 />
                      </Tab.Pane>
                    </Tab.Content>
                  </div>
                </Tab.Container>
              </div>
            </div>
            <div className="col-xl-8 col-xxl-12 col-lg-8">
              <div className="card">
                <div className="card-header border-0 pb-0">
                  <h4 className="text-black fs-20 mb-0">
                    Transactions Summary
                  </h4>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-6 mb-sm-0 mb-3">
                      <div className="media align-items-center">
                        <div className="d-inline-block me-3 position-relative donut-chart-sale2">
                          <ChartDonught2
                            backgroundColor="#53CB50"
                            backgroundColor2="#FAFAFA"
                            height="100"
                            width="100"
                            value="75"
                          />
                          <small className="text-black">86%</small>
                        </div>
                        <div>
                          <h4 className="fs-28 font-w600 text-black mb-0">
                            585
                          </h4>
                          <span>Succesfull Order</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="media align-items-center">
                        <div className="d-inline-block me-3 position-relative donut-chart-sale2">
                          <ChartDonught2
                            backgroundColor="#FD376F"
                            backgroundColor2="#FAFAFA"
                            height="100"
                            width="100"
                            value="40"
                          />
                          <small className="text-black">14%</small>
                        </div>
                        <div>
                          <h4 className="fs-28 font-w600 text-black mb-0">
                            165
                          </h4>
                          <span>Unsuccesfull Order</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-xxl-12 col-lg-4">
              <div className="card">
                <div className="card-header border-0 pb-0">
                  <h4 className="text-black fs-20 mb-0">Average</h4>
                </div>
                <div className="card-body">
                  <div className="d-flex align-items-end" id="BarChart">
                    <div>
                      <h4 className="fs-28 font-w600 text-black mb-0">
                        87,456
                      </h4>
                      <span>Order</span>
                    </div>
                    <BarChart />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-xxl-4">
          <div className="row">
            <div className="col-xl-12">
              <div className="card trending-menus">
                <div className="card-header d-sm-flex d-block pb-0 border-0">
                  <div>
                    <h4 className="text-black fs-20">Daily Trending Menus</h4>
                    <p className="fs-13 mb-0 text-black">Lorem ipsum dolor</p>
                  </div>
                </div>
                <div className="card-body">
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
                    <img
                      src={menu9}
                      alt="menu9"
                      width={60}
                      className="rounded"
                    />
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
                    <img
                      src={menu10}
                      alt="menu10"
                      width={60}
                      className="rounded"
                    />
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
                    <img
                      src={menu11}
                      alt="menu11"
                      width={60}
                      className="rounded"
                    />
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
                    <img
                      src={menu12}
                      alt="menu12"
                      width={60}
                      className="rounded"
                    />
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
                    <img
                      src={menu9}
                      alt="menu9"
                      width={60}
                      className="rounded"
                    />
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

export default Home;
