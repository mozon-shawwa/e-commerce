const ShoppingCart = require('../models/ShoppingCart');
const Product = require('../models/Product');
const createError = require('http-errors');
const {returnJson} = require('../my-modules/json-response');

const addItem = async (req,res,next)=>{
    try {
        const userId = req.user.id;
        const {product : productId ,quantity} = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return next(createError(404, 'Product Not Found'));
        }

        let cart = await ShoppingCart.findOne({user:userId});
        if(cart){
            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
            if(itemIndex > -1){
                cart.items[itemIndex].quantity +=quantity;
            }else{
                cart.items.push({product:productId,quantity:quantity})
            }

        }else{
            cart = new ShoppingCart({user:userId,items:[{product:productId,quantity:quantity}]});

        }
        await cart.save();
        returnJson(res,201,true,cart,'Item added Successfully');

    } catch (error) {
        if (error.name === 'ValidationError') {
        return next(createError(400, error.message));
        }
        console.log(error);
        return next(createError(500,'Error In Add Item To Cart.'));
    }

};

const removeItem = async (req,res,next)=>{
    try {
        const userId = req.user.id;
        const itemId = req.params.id;
        const item = await ShoppingCart.findOneAndUpdate({user:userId},{$pull:{items:{_id:itemId}}},{new:true});
        returnJson(res,200,true,item,'Item Removed Successfully');
    } catch (error) {

        console.log(error);
        return next(createError(500,'Error In Remove Item To Cart.'));
    }

};

const getCart = async (req,res,next)=>{
    try {
        const userId = req.user.id;
        const cart = await ShoppingCart.findOne({ user: userId }).populate('items.product');

        if(!cart){
           return returnJson(res, 200, true, { user: userId, items: [] }, 'Cart is empty.');
        }

        returnJson(res,200,true,cart,'Get Cart Successfully.');

    } catch (error) {
        
        console.log(error);
        return next(createError(500,'Error In Get Item To Cart.'));
    }

};

module.exports = {removeItem,getCart,addItem};