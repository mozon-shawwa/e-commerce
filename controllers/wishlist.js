const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { returnJson } = require('../my-modules/json-response');
const createError = require('http-errors' );

const wishlistItems = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return next(createError(404, 'Product not found.'));
        }

        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            wishlist = new Wishlist({ user: userId, products: [productId] });
            await wishlist.save();
            return returnJson(res, 201, true, wishlist, 'Product added to new wishlist.');
        }

        const productIndex = wishlist.products.indexOf(productId);

        if (productIndex > -1) {
            // إذا كان المنتج موجودًا، احذفه (pull)
            wishlist.products.pull(productId);
            await wishlist.save();
            return returnJson(res, 200, true, wishlist, 'Product removed from wishlist.');
        } else {
            // إذا لم يكن المنتج موجودًا، أضفه (push)
            wishlist.products.push(productId);
            await wishlist.save();
            return returnJson(res, 200, true, wishlist, 'Product added to wishlist.');
        }

    } catch (error) {
        console.log(error);
        return next(createError(500, 'Error toggling wishlist item.'));
    }
};

const getMyWishlist = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const wishlist = await Wishlist.findOne({ user: userId }).populate('products');

        if (!wishlist) {
            return returnJson(res, 200, true, { user: userId, products: [] }, 'Wishlist is empty.');
        }

        returnJson(res, 200, true, wishlist, 'Wishlist fetched successfully.');

    } catch (error) {
        console.log(error);
        return next(createError(500, 'Error fetching wishlist.'));
    }
};

module.exports = {wishlistItems,getMyWishlist};

