const Order = require('../models/Order');
const ShoppingCart = require('../models/ShoppingCart');
const {returnJson} = require('../my-modules/json-response');
const createError = require('http-errors');
const {createPaymentIntent} = require('../controllers/payment');

const createOrder = async (req,res,next)=>{
    try {
        const userId = req.user.id;
        const {payment,address} = req.body;

        const cart = await ShoppingCart.findOne({user : userId}).populate('items.product');
        if(!cart || cart.items.length === 0){
            return next(createError(404,'Not Found Cart For you.'))
        }

        const orderProducts = cart.items.map(item => {
        return {
             product: item.product._id, 
             quantity: item.quantity, 
             priceAtPurchase: item.product.price 
             };
        });
        const totalAmount = cart.items.reduce((amount,item)=>{
                return amount + (item.quantity * item.product.price);
        },0);

        const order = new Order ({buyer:userId,products:orderProducts,
              payment : { amount:totalAmount }, shippingStatus:'Not Processed',shippingAddress:address
        });
        await order.save();


      returnJson(res, 201, true, {
             orderId: order._id,
             amount: order.payment.amount,
              // نقوم بضرب المبلغ في 100 وتحويله إلى عدد صحيح
            stripeAmount: Math.round(order.payment.amount * 100)
        }, 'Order Successfully');

    }catch (error) {
        console.log(error);
        return next(createError(500,'Error In Create Order.'));
    }

};

const getAllOrders = async (req,res,next)=>{
    try {
        const orders = await Order.find({})
                                  .populate("buyer","name email")
                                  .populate("products.product","name price")
                                  .sort("-createdAt");

        returnJson(res,200,true,orders,'Get All Orders Successfully.');


    }catch (error) {
        console.log(error);
        return next(createError(500,'Error In Get Orders.'));
    }
};

const getMyOrders = async(req,res,next)=>{
    try {
        const userId = req.user.id;
        const orders = await Order.find({buyer:userId})
                                  .populate("buyer","name email")
                                  .populate("products.product","name price")
                                  .sort("-createdAt");

        returnJson(res,200,true,orders,'Get Your Orders Successfully.');
    }catch (error) {
        console.log(error);
        return next(createError(500,'Error In Get Your Orders.'));
    }

};

const updateOrderStatus = async(req,res,next)=>{
    try {
        const orderId = req.params.id;
        const {status} = req.body;
    
        const order = await Order.findByIdAndUpdate(orderId,{shippingStatus:status},{new:true,runValidators: true});

        if (!order) {
            return next(createError(404, 'Order Not Found.'));
        }

        returnJson(res,200,true,order,'order status updated successfully.')
    }catch (error) {

        if (error.name === 'ValidationError') {
                return next(createError(400, error.message));
        }
        console.log(error);
        return next(createError(500,'Error In Update Order Status.'));
    }

};

const getOrderById  = async(req,res,next)=>{
    try {
        const userId = req.user.id;
        const orderId = req.params.id;
        const order = await Order.findOne({buyer:userId,_id:orderId})
                                  .populate("buyer","name email")
                                  .populate("products.product","name price");

        returnJson(res,200,true,order,'Get  Order Successfully.'); 
    }catch (error) {
        console.log(error);
        return next(createError(500,'Error In get spacific order.'));
    }
 
};

module.exports = {createOrder,getAllOrders,getMyOrders,updateOrderStatus,getOrderById };