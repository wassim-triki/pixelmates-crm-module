import React, { useState } from "react";
import { Link } from "react-router-dom";

//** Import Image */
import Product5 from "../../../../assets/images/card/pic5.jpg";
import Product6 from "../../../../assets/images/card/pic6.jpg";
import Product7 from "../../../../assets/images/card/pic7.jpg";

const OrderIdDada = () => {
  const [datas, setDatas] = useState([
    {
      img: Product5,
      course: "MAIN COURSE",
      details: "Watermelon juice with ice",
      reviews: "454",
      quantity: "1",
      price: "4.12",
      totalPrice: "4.12",
      star: [1, 1, 1, 0, 0],
    },
    {
      img: Product6,
      course: "MAIN COURSE",
      details: " Chicken curry special with cucumber",
      reviews: "454",
      quantity: "3",
      price: "14.99",
      totalPrice: "44.97",
      star: [1, 1, 1, 0, 0],
    },
    {
      img: Product7,
      course: "MAIN COURSE",
      details: "Italiano pizza with garlic",
      reviews: "454",
      quantity: "1",
      price: "15.44",
      totalPrice: "15.44",
      star: [1, 1, 1, 0, 0],
    },
  ]);

  const delateData = (index) => {
    const data = datas.filter((data, i) => i !== index && data);
    setDatas(data);
  };
  return (
    <div className="col-xl-12">
      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive order-list card-table">
            <table className="table items-table table-responsive-md">
              <tbody>
                <tr>
                  <th className="my-0 text-black font-w500 fs-20">Items</th>
                  <th
                    style={{ width: "10%" }}
                    className="my-0 text-black font-w500 fs-20"
                  >
                    Qty
                  </th>
                  <th
                    style={{ width: "10%" }}
                    className="my-0 text-black font-w500 fs-20"
                  >
                    Price
                  </th>
                  <th className="my-0 text-black font-w500 fs-20 wspace-no d-md-none d-lg-table-cell">
                    Total Price
                  </th>
                  <th />
                </tr>
                {datas &&
                  datas.map((data, index) => (
                    <tr
                      key={index}
                      className="alert alert-dismissible border-0"
                    >
                      <td>
                        <div className="media">
                          <Link to="ecom-product-detail">
                            <img
                              className="me-3 img-fluid rounded"
                              width={85}
                              src={data.img}
                              alt="Product5"
                            />
                          </Link>
                          <div className="media-body">
                            <small className="mt-0 mb-1 font-w500">
                              <Link className="text-primary" to="#">
                                MAIN COURSE{data.course}
                              </Link>
                            </small>
                            <h5 className="mt-0 mb-2 mb-4">
                              <Link
                                className="text-black"
                                to="ecom-product-detail"
                              >
                                {data.details}
                              </Link>
                            </h5>
                            <div className="star-review fs-14">
                              {data.star.map((icon, index) => {
                                return (
                                  <i
                                    key={index}
                                    className={`${
                                      icon === 1
                                        ? "fa fa-star text-orange me-1"
                                        : "fa fa-star text-gray me-1"
                                    }`}
                                  />
                                );
                              })}
                              <span className="ms-3 text-dark">
                                ({data.reviews} revies)
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <h4 className="my-0 text-black font-w600">
                          {data.quantity}x
                        </h4>
                      </td>
                      <td>
                        <h4 className="my-0 text-black font-w600">
                          ${data.price}
                        </h4>
                      </td>
                      <td className="d-md-none d-lg-table-cell">
                        <h4 className="my-0 text-black font-w600">
                          ${data.totalPrice}
                        </h4>
                      </td>
                      <td>
                        <Link
                          onClick={() => delateData(index)}
                          data-dismiss="alert"
                          aria-label="Close"
                          className=" fs-28 text-danger "
                        >
                          <i className="las la-times-circle" />
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderIdDada;
