import React, { Fragment, useEffect, useState } from 'react';
import "./Products.css";
import ProductCard from "../Home/ProductCard.js";
import {clearErrors, getProduct } from '../../actions/productActions.js';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../layout/Loader/Loader.js';
import {useAlert} from "react-alert";
import { useParams } from 'react-router-dom';
import Pagination from "react-js-pagination";
import { MdOutlineNextPlan, MdOutlinePreview } from "react-icons/md";
import { SiFirst, SiLastpass } from "react-icons/si";
import {Slider, Typography} from "@mui/material";

const Products = () => {

    const alert = useAlert();
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 100000]);

    const { 
      loading, 
      error, 
      products, 
      productCount, 
      resultPerPage,
      filteredProductsCount 
    } = useSelector(
      (state) => state.products
    );

    const { keyword } = useParams();

    const setCurrentPageNo = (e) => {
      setCurrentPage(e)
    }

    const priceHandler = (event, newPrice) => {
      setPrice(newPrice)
    }


  
    useEffect(() => {
      if (error){
        alert.error(error);
        dispatch(clearErrors());
      }
      dispatch(getProduct(keyword, currentPage, price));
    }, [dispatch, keyword, currentPage, price, error, alert]);

    let count = filteredProductsCount;

  return (
    <Fragment>

      {loading ? <Loader /> : <Fragment>
 
        <h2 className="productsHeading">Products</h2>

        <div className="products" id='products'>
          {products && products.map((product) => 
          <ProductCard key={product._id} product={product} />)}
        </div>

        <div className='filterBox'>
          <Typography>Price</Typography>
          <Slider
            value={price}
            onChange={priceHandler}
            valueLabelDisplay='auto'
            aria-labelledby='range-slider'
            min={0}
            max={100000}
          />


        </div>

        {resultPerPage < count && (
          <div className='paginationBox'>
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={resultPerPage}
            totalItemsCount={productCount}
            onChange={setCurrentPageNo}
            nextPageText={<MdOutlineNextPlan fontSize={18} />}
            prevPageText={<MdOutlinePreview fontSize={18} />}
            firstPageText={<SiFirst fontSize={18} />}
            lastPageText={<SiLastpass fontSize={18} />}
            itemClass='page-item'
            linkClass='page-link'
            activeClass='pageItemActive'
            activeLinkClass='pageLinkActive'
          />
        </div>
        )}

      </Fragment>}
    </Fragment>
  )
}

export default Products;