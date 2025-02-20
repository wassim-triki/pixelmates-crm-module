import React from 'react'

const ProductDetail = () => {
    return (
        <>
  <div className="modal fade" id="addOrderModalside">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Add Menus</h5>
          <button type="button" className="close" data-dismiss="modal"><span>×</span>
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
              <button type="button" className="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div className="page-titles">
    <ol className="breadcrumb">
      <li className="breadcrumb-item"><a href="javascript:void(0)">Layout</a></li>
      <li className="breadcrumb-item active"><a href="javascript:void(0)">Blank</a></li>
    </ol>
  </div>
  <div className="row">
    <div className="col-lg-12">
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-xl-3 col-lg-6  col-md-6 col-xxl-5 ">
              {/* Tab panes */}
              <div className="tab-content">
                <div role="tabpanel" className="tab-pane fade show active" id="first">
                  <img className="img-fluid" src="images/product/1.jpg" alt />
                </div>
                <div role="tabpanel" className="tab-pane fade" id="second">
                  <img className="img-fluid" src="images/product/2.jpg" alt />
                </div>
                <div role="tabpanel" className="tab-pane fade" id="third">
                  <img className="img-fluid" src="images/product/3.jpg" alt />
                </div>
                <div role="tabpanel" className="tab-pane fade" id="for">
                  <img className="img-fluid" src="images/product/4.jpg" alt />
                </div>
              </div>
              <div className="tab-slide-content new-arrival-product mb-4 mb-xl-0">
                {/* Nav tabs */}
                <ul className="nav slide-item-list mt-3" role="tablist">
                  <li role="presentation" className="show">
                    <a href="#first" role="tab" data-toggle="tab">
                      <img className="img-fluid" src="images/tab/1.jpg" alt width={50} />
                    </a>
                  </li>
                  <li role="presentation">
                    <a href="#second" role="tab" data-toggle="tab"><img className="img-fluid" src="images/tab/2.jpg" alt width={50} /></a>
                  </li>
                  <li role="presentation">
                    <a href="#third" role="tab" data-toggle="tab"><img className="img-fluid" src="images/tab/3.jpg" alt width={50} /></a>
                  </li>
                  <li role="presentation">
                    <a href="#for" role="tab" data-toggle="tab"><img className="img-fluid" src="images/tab/4.jpg" alt width={50} /></a>
                  </li>
                </ul>
              </div>
            </div>
            {/*Tab slider End*/}
            <div className="col-xl-9 col-lg-6  col-md-6 col-xxl-7 col-sm-12">
              <div className="product-detail-content">
                {/*Product details*/}
                <div className="new-arrival-content pr">
                  <h4>Solid Women's V-neck Dark T-Shirt</h4>
                  <div className="comment-review star-rating">
                    <ul>
                      <li><i className="fa fa-star" /></li>
                      <li><i className="fa fa-star" /></li>
                      <li><i className="fa fa-star" /></li>
                      <li><i className="fa fa-star-half-empty" /></li>
                      <li><i className="fa fa-star-half-empty" /></li>
                    </ul>
                    <span className="review-text">(34 reviews) / </span><a className="product-review" href data-toggle="modal" data-target="#reviewModal">Write a review?</a>
                  </div>
                  <div className="d-table mb-2">
                    <p className="price float-left d-block">$325.00</p>
                  </div>
                  <p>Availability: <span className="item"> In stock <i className="fa fa-shopping-basket" /></span>
                  </p>
                  <p>Product code: <span className="item">0405689</span> </p>
                  <p>Brand: <span className="item">Lee</span></p>
                  <p>Product tags:&nbsp;&nbsp;
                    <span className="badge badge-success light">bags</span>
                    <span className="badge badge-success light">clothes</span>
                    <span className="badge badge-success light">shoes</span>
                    <span className="badge badge-success light">dresses</span>
                  </p>
                  <p className="text-content">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.
                    If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing.</p>
                  <div className="filtaring-area my-3">
                    <div className="size-filter">
                      <h4 className="m-b-15">Select size</h4>
                      <div className="btn-group" data-toggle="buttons">
                        <label className="btn btn-outline-primary light btn-sm"><input type="radio" className="position-absolute invisible" name="options" id="option5" /> XS</label>
                        <label className="btn btn-outline-primary light btn-sm"><input type="radio" className="position-absolute invisible" name="options" id="option1" defaultChecked />SM</label>
                        <label className="btn btn-outline-primary light btn-sm"><input type="radio" className="position-absolute invisible" name="options" id="option2" /> MD</label>
                        <label className="btn btn-outline-primary light btn-sm"><input type="radio" className="position-absolute invisible" name="options" id="option3" /> LG</label>
                        <label className="btn btn-outline-primary light btn-sm"><input type="radio" className="position-absolute invisible" name="options" id="option4" /> XL</label>
                      </div>
                    </div>
                  </div>
                  {/*Quantity start*/}
                  <div className="col-2 px-0">
                    <input type="number" name="num" className="form-control input-btn input-number" defaultValue={1} />
                  </div>
                  {/*Quanatity End*/}
                  <div className="shopping-cart mt-3">
                    <a className="btn btn-primary btn-lg" href="javascript:void(0)"><i className="fa fa-shopping-basket me-2" />Add
                      to cart</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* review */}
    <div className="modal fade" id="reviewModal">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Review</h5>
            <button type="button" className="close" data-dismiss="modal"><span>×</span>
            </button>
          </div>
          <div className="modal-body">
            <form>
              <div className="text-center mb-4">
                <img className="img-fluid rounded" width={78} src="./images/avatar/1.jpg" alt="DexignZone" />
              </div>
              <div className="form-group">
                <div className="rating-widget mb-4 text-center">
                  {/* Rating Stars Box */}
                  <div className="rating-stars">
                    <ul id="stars">
                      <li className="star" title="Poor" data-value={1}>
                        <i className="fa fa-star fa-fw" />
                      </li>
                      <li className="star" title="Fair" data-value={2}>
                        <i className="fa fa-star fa-fw" />
                      </li>
                      <li className="star" title="Good" data-value={3}>
                        <i className="fa fa-star fa-fw" />
                      </li>
                      <li className="star" title="Excellent" data-value={4}>
                        <i className="fa fa-star fa-fw" />
                      </li>
                      <li className="star" title="WOW!!!" data-value={5}>
                        <i className="fa fa-star fa-fw" />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <textarea className="form-control" placeholder="Comment" rows={5} defaultValue={""} />
              </div>
              <button className="btn btn-success btn-block">RATE</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</>

    )
}

export default ProductDetail
