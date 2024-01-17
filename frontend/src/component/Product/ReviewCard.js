import React, { Fragment } from 'react';
import ReactStars from 'react-rating-stars-component';
import profilePng from "../../images/Profile.png";
import "./ProductDetails.css";
import { useSelector } from "react-redux";
import Loader from '../layout/Loader/Loader.js';


const ReviewCard = (props) => {


  const {loading } = useSelector(
    (state) => state.productDetails
  );


  const option = {
    edit: false,
    color: "rgba(20, 20, 20,0.l)",
    activeColor: "tomato",
    size: window.innerWidth < 600 ? 15 : 20,
    value: props.review.rating,
    isHalf: true,
  };

  return (
    <Fragment>
      {loading ? <Loader /> : <Fragment>
        <div className='reviewCard'>
          <img src={profilePng} alt="User" />
          <p>{props.review.name}</p>
          <ReactStars {...option} />
          <span>{props.review.comment}</span>
        </div>


      </Fragment>}

    </Fragment>
  )
}

export default ReviewCard;