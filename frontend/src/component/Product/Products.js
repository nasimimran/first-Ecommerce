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
import MetaData from '../layout/MetaData.js';


const categories = [
  "phone",
  "laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhones",
];

const Products = () => {

    const alert = useAlert();
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 100000]);
    const [category, setCategory] = useState("");
    const [ratings, setRatings] = useState(0);

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
      dispatch(getProduct(keyword, currentPage, price, category, ratings));
    }, [dispatch, keyword, currentPage, price, category, ratings, error, alert]);

    let count = filteredProductsCount;

  return (
    <Fragment>

      {loading ? <Loader /> : <Fragment>

        <MetaData title="PRODUCTS -- ECOMMERCE" />
 
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

          <Typography>Categories</Typography>
            <ul className='categoryBox'>
            {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>

            <fieldset>
              <Typography component="legend">Ratings Above</Typography>
              <Slider
                value={ratings}
                onChange={(e, newRating) => {
                  setRatings(newRating);
                }}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </fieldset>

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