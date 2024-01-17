import React, { Fragment, useEffect } from 'react';
import "./Products.css";
import ProductCard from "../Home/ProductCard.js";
import {clearErrors, getProduct } from '../../actions/productActions.js';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../layout/Loader/Loader.js';
import {useAlert} from "react-alert";

const Products = () => {

    const alert = useAlert();
    const dispatch = useDispatch();
    const { loading, error, products, productCount } = useSelector(
      (state) => state.products
    );
  
    useEffect(() => {
      if (error){
        alert.error(error);
        dispatch(clearErrors());
      }
      dispatch(getProduct());
    }, [dispatch, error, alert]);

  return (
    <Fragment>

      {loading ? <Loader /> : <Fragment>
 
        <h2 className="productsHeading">Products</h2>

        <div className="products" id='products'>
          {products && products.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>

      </Fragment>}


    </Fragment>
  )
}

export default Products;