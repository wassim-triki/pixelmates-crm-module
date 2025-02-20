import React, { useState } from "react";
import { Link } from "react-router-dom";

// Dish
import dish_pic6 from "../../../../assets/images/dish/pic6.jpg";
import dish_pic7 from "../../../../assets/images/dish/pic7.jpg";
import dish_pic9 from "../../../../assets/images/dish/pic9.jpg";
import dish_pic10 from "../../../../assets/images/dish/pic10.jpg";

const WeeklyFavorites = () => {
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [datas, setDatas] = useState([
    {
      img: dish_pic7,
      details: "Meidum Spicy Spagethi Italiano",
      reviews: "451",
      likes: "256k",
    },
    {
      img: dish_pic9,
      details: "Pizza Meal for Kids (Small size)",
      reviews: "451",
      likes: "256k",
    },
    {
      img: dish_pic10,
      details: "Meidum Spicy Spagethi Italiano",
      reviews: "451",
      likes: "256k",
    },
    {
      img: dish_pic6,
      details: "Medium Spicy Pizza with Kemangi Leaf",
      reviews: "451",
      likes: "256k",
    },
  ]);

  //Load more Function
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
  return (
    <div>
      <div
        className="row height750 dz-scroll loadmore-content"
        id="favourite-itemsContent"
      >
        {datas &&
          datas.map((data, index) => (
            <div
              key={index}
              className="col-md-4 col-xl-4 col-xxl-6 col-sm-6 mb-5"
            >
              <div className="media mb-4">
                <Link to="ecom-product-detail">
                  <img
                    src={data.img}
                    className="rounded w-100"
                    alt="dish_pic6"
                  />
                </Link>
              </div>
              <div className="info">
                <h5 className="mb-3">
                  <Link className="text-black" to="ecom-product-detail">
                    {data.details}
                  </Link>
                </h5>
                <div className="star-review fs-14 mb-3">
                  <i className="fa fa-star text-orange" />{' '}
                  <i className="fa fa-star text-orange" />{' '}
                  <i className="fa fa-star text-orange" />{' '}
                  <i className="fa fa-star text-gray" />{' '}
                  <i className="fa fa-star text-gray" />
                  <span className="ms-3 text-dark">{data.reviews} reviews</span>
                </div>
                <Link
                  to="#;"
                  className="btn btn-primary light btn-sm btn-rounded px-4"
                >
                  <i className="fa fa-heart-o me-2 scale5 " />{" "}
                  <strong>{data.likes}</strong> Like it
                </Link>
              </div>
            </div>
          ))}
      </div>
      <div className="bg-white pt-3 text-center">
        <Link
          onClick={() => hendelClick()}
          to="#;"
          className="btn-link dz-load-more text-primary"
          id="favourite-items"
        >
          View more{" "} <i className="fa fa-angle-down ms-2 scale-1 align-middle" />
          {refreshToggle && <i className="fa fa-refresh"/>}
        </Link>
      </div>
    </div>
  );
};

export default WeeklyFavorites;
