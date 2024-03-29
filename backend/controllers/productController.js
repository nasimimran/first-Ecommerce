const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");



// Create product   --Admin
exports.createProduct = catchAsyncError ( async (req, res, next) => {

    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    });
});


// Get all product
exports.getAllProducts = catchAsyncError ( async (req, res) => {

    const resultPerPage = 8;
    const productCount = await Product.countDocuments();

    const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();
    
    let products = await apiFeatures.query;

    const filteredProductsCount = products.length;

    apiFeatures.pagination(resultPerPage)

    products = await apiFeatures.query.clone();

    res.status(200).json({
        success: true,
        products,
        productCount,
        resultPerPage,
        filteredProductsCount
    });
});


// Get product details
exports.getProductDetails = catchAsyncError ( async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product){
        return next(new ErrorHandler("Product not found",404));
    }

    res.status(200).json({
        success: true,
        product
    });
});


// Update product   --Admin
exports.updateProduct = catchAsyncError ( async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if (!product){
        return next(new ErrorHandler("Product not found",404));
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    });
});


// Delete product   --Admin
exports.deleteProduct = catchAsyncError ( async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product){
        return next(new ErrorHandler("Product not found",404));
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Product Deleted'
    });
});

// Create new review or update the review
exports.createProductReview = catchAsyncError ( async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString());

    if (isReviewed){
        product.reviews.forEach((rev) =>{
            if (rev.user.toString() === req.user._id.toString())
            (rev.rating = rating), (rev.comment = comment);
        });

    }
    else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;
    product.reviews.forEach((rev) =>{
        avg += rev.rating;
    });
    
    product.ratings = avg/product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});

// Get all reviews for a product
exports.getProductReviews = catchAsyncError ( async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product){
        return next(new ErrorHandler("Product not found",404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    });
});

// Delete review
exports.deleteReview = catchAsyncError ( async (req, res, next) => {

    const product = await Product.findById(req.params.productId);

    if (!product){
        return next(new ErrorHandler("Product not found",404));
    }

    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.params.id.toString()
        );

    let avg = 0;
    reviews.forEach((rev) =>{
        avg += rev.rating;
    });
    
    const ratings = avg/reviews.length;

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
        req.params.productId,
        {
            reviews, 
            ratings, 
            numOfReviews
        },
        {
            new: true, 
            runValidators: true, 
            useFindAndModify: false
        }
    );

    res.status(200).json({
        success: true,
    });
});