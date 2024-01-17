import React, { Fragment, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { getProductDetails } from "../../actions/productActions";
import { useAlert } from "react-alert";
import ReactStars from 'react-rating-stars-component';
import ReviewCard from "./ReviewCard.js";
import Loader from '../layout/Loader/Loader.js';


const ProductDetails = () => {

    const alert = useAlert();
    const dispatch = useDispatch();
    const { id } = useParams();

    const { product, loading, error } = useSelector(
        (state) => state.productDetails
    );


    useEffect(() => {
        if (error) {
            return alert.error(error);
        }
        dispatch(getProductDetails(id))
    }, [dispatch, id, error, alert]);


    const option = {
        edit: false,
        color: "rgba(20, 20, 20,0.l)",
        activeColor: "tomato",
        size: window.innerWidth < 600 ? 15 : 20,
        value: product.ratings,
        isHalf: true,
    };

    return (
        <Fragment>
            {loading ? <Loader /> : <Fragment>
                <div className="ProductDetails">
                    <div>
                        <Carousel>
                            {
                                product.images && product.images.map((item, i) => (
                                    <img
                                        className='CarouselImage'
                                        key={i}
                                        src={item.url}
                                        alt={`${i} Slide`}
                                    />
                                ))
                            }
                        </Carousel>
                    </div>

                    <div>
                        <div className="detailsBlock-1">
                            <h2>{product.name}</h2>
                            <p>Product # {product._id}</p>
                        </div>
                        <div className="detailsBlock-2">
                            <ReactStars {...option} />
                            <span className="detailsBlock-2-span">
                                {" "}
                                ({product.numOfReviews} Reviews)
                            </span>
                        </div>
                        <div className="detailsBlock-3">
                            <h1>{`৳${product.price}`}</h1>
                            <div className="detailsBlock-3-1">
                                <div className="detailsBlock-3-1-1">
                                    <button onClick="{decreaseQuantity}">-</button>
                                    <input readOnly type="number" value="{quantity}" />
                                    <button onClick="{increaseQuantity}">+</button>
                                </div>
                                <button>
                                    Add to Cart
                                </button>
                            </div>

                            <p>
                                Status:
                                <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                                    {product.Stock < 1 ? "OutOfStock" : "InStock"}
                                </b>
                            </p>
                        </div>

                        <div className="detailsBlock-4">
                            Description : <p>{product.description}</p>
                        </div>

                        <button onClick="{submitReviewToggle}" className="submitReview">
                            Submit Review
                        </button>
                    </div>
                </div>

                <h3 className="reviewsHeading">Reviews</h3>

                {product.reviews && product.reviews[0] ? (
                    <div className="review">
                        {product.reviews.map((review) => (<ReviewCard key={review._id} review={review} />))}
                    </div>
                ) : (
                    <p className='noReview'>No reviews Yet</p>
                )}

            </Fragment>}

        </Fragment>
    )
}

export default ProductDetails;