const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { returnJson } = require('../my-modules/json-response');
const createError = require('http-errors' );

const createReview = async (req, res, next) => {
    try {
        const { rating, comment, productId } = req.body;
        const userId = req.user.id;

        const hasPurchased = await Order.findOne({
            'buyer': userId,
            'products.product': productId,
            'payment.status': 'Paid' 
        });

        if (!hasPurchased) {
            return next(createError(403, 'You can only review products you have purchased.'));
        }

        const alreadyReviewed = await Review.findOne({ product: productId, user: userId });
        if (alreadyReviewed) {
            return next(createError(400, 'You have already reviewed this product.'));
        }

        const review = await Review.create({
            rating,
            comment,
            product: productId,
            user: userId
        });

        returnJson(res, 201, true, review, 'Review submitted successfully.');

    } catch (error) {
        if (error.code === 11000) {
            return next(createError(400, 'You have already reviewed this product.'));
        }
        console.log(error);
        return next(createError(500, 'Error creating review.'));
    }
};

const getProductReviews = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.find({ product: productId }).populate('user', 'username'); 

        returnJson(res, 200, true, reviews, 'Reviews fetched successfully.');

    } catch (error) {
        console.log(error);
        return next(createError(500, 'Error fetching reviews.'));
    }
};

module.exports = {createReview,getProductReviews};