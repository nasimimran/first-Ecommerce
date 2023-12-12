import React, { Fragment, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import {useSelector, useDispatch} from "react-redux";
import {getProductDetails} from "../../actions/productActions";
import {useAlert} from "react-alert";

const ProductDetails = () => {

    const alert = useAlert();
    const dispatch = useDispatch();
    const { id } = useParams();

    const {product, loading, error} = useSelector(
        (state) => state.productDetails
        );

    useEffect(() => {
        if (error){
            return alert.error(error);
          }
        dispatch(getProductDetails(id))
    }, [dispatch, id, error, alert]);

  return (
    <Fragment>
        <div className="productDetails">
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
        </div>
    </Fragment>
  )
}

export default ProductDetails;