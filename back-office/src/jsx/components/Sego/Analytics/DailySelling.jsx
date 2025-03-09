import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

// Dish
import dish_pic1 from "../../../../assets/images/dish/pic1.jpg";
import dish_pic2 from "../../../../assets/images/dish/pic2.jpg";

const DailySelling = () => {
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [datas, setDatas] = useState([
    {
      img: dish_pic2,
      title: "Tuna soup spinach with himalaya salt",
      item: "PIZZA",
      service: "Serves for 4 Person",
      time: "24mins",
      price: "8.15",
    },
    {
      img: dish_pic1,
      title: "Watermelon juice with ice",
      item: "BURGER",
      service: "Serves for 4 Person",
      time: "24mins",
      price: "5.67",
    },
  ]);

  const hendelClick = () => {
    setRefreshToggle(true);
    setTimeout(() => {
      setDatas([
        ...datas,
        datas[Math.floor(Math.random() * Math.floor(datas.length - 1))],
        datas[Math.floor(Math.random() * Math.floor(datas.length - 1))],
      ]);
      setRefreshToggle(false);
    }, 1000);
  };

  const deleteData = (id) => {
    let data = datas.filter((data, i) => i !== id && data);
    setDatas(data);
  };

  return (
    <>
      <div
        className="height500 dz-scroll loadmore-content my-4 px-4"
        id="sellingItemsContent"
      >
        {datas &&
          datas.map((data, index) => (
            <div
              key={index}
              className="media p-0 mb-4 alert alert-dismissible items-list-2 border-0"
            >
              <Link to="ecom-product-detail">
                <img
                  className="img-fluid rounded me-3"
                  width={85}
                  src={data.img}
                  alt="dish_pic5"
                />
              </Link>
              <div className="media-body col-6 px-0">
                <h5 className="mt-0 mb-1">
                  <Link className="text-black" to="ecom-product-detail">
                    {data.title}
                  </Link>
                </h5>
                <small className="font-w500 mb-3">
                  <Link className="text-primary" to="#;">
                    {data.item}
                  </Link>
                </small>
                <span className="text-secondary me-2 fo" />
                <ul className="fs-14 list-inline">
                  <li className="me-3">{data.service}</li>
                  <li>{data.time}</li>
                </ul>
              </div>
              <div className="media-footer align-self-center ms-auto d-block align-items-center d-sm-flex">
                <h3 className="mb-0 font-w600 text-secondary">${data.price}</h3>
                <Dropdown className="dropdown ms-3 ">
                  <Dropdown.Toggle
                    type="button"
                    className="i-false btn btn-secondary sharp tp-btn-light "
                    data-toggle="dropdown"
                  >
                    <svg
                      width="24px"
                      height="24px"
                      viewBox="0 0 24 24"
                      version="1.1"
                    >
                      <g
                        stroke="none"
                        strokeWidth={1}
                        fill="none"
                        fillRule="evenodd"
                      >
                        <rect x={0} y={0} width={24} height={24} />
                        <circle fill="#000000" cx={5} cy={12} r={2} />
                        <circle fill="#000000" cx={12} cy={12} r={2} />
                        <circle fill="#000000" cx={19} cy={12} r={2} />
                      </g>
                    </svg>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                    <Dropdown.Item className="dropdown-item" to="#;">
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item
                      to="#;"
                      data-dismiss="alert"
                      aria-label="Close"
                      className="dropdown-item"
                      onClick={() => deleteData(index)}
                    >
                      Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          ))}
      </div>
      <div className="text-center bg-white pt-3 pb-3">
        <Link
          to="#;"
          className="btn-link dz-load-more text-primary"
          id="sellingItems"
          onClick={() => hendelClick()}
        >
          View more <i className="fa fa-angle-down ms-2 scale-1 align-middle" />{" "}
          {refreshToggle && <i className="fa fa-refresh"></i>}
        </Link>
      </div>
    </>
  );
};

export default DailySelling;
