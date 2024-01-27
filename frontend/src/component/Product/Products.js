import React, { Fragment, useEffect, useState } from 'react';
import "./Products.css";
import ProductCard from "../Home/ProductCard.js";
import {clearErrors, getProduct } from '../../actions/productActions.js';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../layout/Loader/Loader.js';
import {useAlert} from "react-alert";
import { useParams } from 'react-router-dom';
import Pagination from "react-js-pagination";

const Products = () => {

    const alert = useAlert();
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);

    const { loading, error, products, productCount, resultPerPage } = useSelector(
      (state) => state.products
    );

    const { keyword } = useParams();

    const setCurrentPageNo = (e) => {
      setCurrentPage(e)
    }
  
    useEffect(() => {
      if (error){
        alert.error(error);
        dispatch(clearErrors());
      }
      dispatch(getProduct(keyword, currentPage));
    }, [dispatch, keyword, currentPage, error, alert]);

  return (
    <Fragment>

      {loading ? <Loader /> : <Fragment>
 
        <h2 className="productsHeading">Products</h2>

        <div className="products" id='products'>
          {products && products.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>

        {resultPerPage < productCount && (
          <div className='paginationBox'>
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={resultPerPage}
            totalItemsCount={productCount}
            onChange={setCurrentPageNo}
            nextPageText="Next"
            prevPageText="Prev"
            firstPageText="1st"
            lastPageText="Last"
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