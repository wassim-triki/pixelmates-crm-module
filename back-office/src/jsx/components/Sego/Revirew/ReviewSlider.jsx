import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Slider Image
import avatar1 from "../../../../assets/images/avatar/1.jpg";
import avatar2 from "../../../../assets/images/avatar/2.jpg";

const ReviewSlider = () => {
  const [asd, setAsd] = useState();
  const renderArrows = () => {
    return (
      <div className="">
        <span className="prev me-3" onClick={() => asd.slickPrev()}>
          <i class="fa fa-chevron-left"></i>
        </span>
        <span className="next" onClick={() => asd.slickNext()}>
          <i class="fa fa-chevron-right"></i>
        </span>
      </div>
    );
  };

  return (
    <>
      <div className="card-header border-0 pb-0 ">
        <div>
          <h3 className="card-title mb-1 fs-28 font-w600">🔥 Newest</h3>
        </div>
        <div className="testimonial-one-navigation owl-clienr-btn pull-left">
          {renderArrows()}
        </div>
      </div>
      <div className="card-body">
        <div className="testimonial-one owl-carousel">
          <Slider
            ref={(c) => setAsd(c)}
            dots={false}
            arrows={false}
            slidesToShow={1}
            slidesToScroll={1}
            initialSlide={0}
          >
            <div className="items">
              <div className="">
                <p className="mb-3">
                  “This was not just great cooking but exceptional cooking using
                  only the best ingredients.
                </p>
                <p className="mb-3">
                  Fast, professional and friendly service, we ordered the six
                  course tasting menu and every dish was spectacular”
                </p>
                <div className="media align-items-center mb-3">
                  <img
                    className="me-3 img-fluid rounded-circle"
                    width={50}
                    src={avatar1}
                    alt="avatar1"
                  />
                  <div className="media-body">
                    <h4 className="mt-0 mb-1 text-black">James Kowalski</h4>
                    <small className="mb-0">Head Marketing</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="items">
              <div className="">
                <p className="mb-3">
                  “This was not just great cooking but exceptional cooking using
                  only the best ingredients.
                </p>
                <p className="mb-3">
                  Fast, professional and friendly service, we ordered the six
                  course tasting menu and every dish was spectacular”
                </p>
                <div className="media align-items-center mb-3">
                  <img
                    className="me-3 img-fluid rounded-circle"
                    width={50}
                    src={avatar2}
                    alt="avatar2"
                  />
                  <div className="media-body">
                    <h4 className="mt-0 mb-1 text-black">James Kowalski</h4>
                    <small className="mb-0">Head Marketing</small>
                  </div>
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </div>
      <div className="card-footer border-0 text-center py-4 gradient-bg rounded-xl">
        <div className="star-review text-md-center d-flex justify-content-center align-items-center">
          <span className="text-white fs-32 font-w600 me-3">4.0</span>
          <i className="fa fa-star fs-22 mx-1 text-white" />
          <i className="fa fa-star fs-22 mx-1 text-white" />
          <i className="fa fa-star fs-22 mx-1 text-white" />
          <i className="fa fa-star fs-22 mx-1 text-white" />
          <i className="fa fa-star fs-22 mx-1 text-white op3" />
        </div>
      </div>
    </>
  );
};

export default ReviewSlider;
