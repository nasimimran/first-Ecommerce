import React from 'react';
import { Link } from 'react-router-dom';
import ReactStars from 'react-rating-stars-component';
import "./Home.css";


const ProductCard = ({ product }) => {
  const option = {
    edit: false,
    color: "rgba(20, 20, 20,0.l)",
    activeColor: "tomato",
    size: window.innerWidth < 600 ? 15 : 20,
    value: product.ratings,
    isHalf: true,
  };
  return (
    <Link className='productCard' to={`/product/${product._id}`}>
      <img src={product.images[0].url} alt={product.name} />
      <p>{product.name}</p>
      <div>
        <ReactStars {...option} />
        <span className='productCardSpan'>({product.numOfReviews} Reviews)</span>
      </div>
      <span>{`৳ ${product.price}`}</span>
    </Link>
  )
}

export default ProductCard;