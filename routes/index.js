const authRouter = require('./auth');
const productRouter = require('./product');
const cartRouter = require('./shoppingCart');
const orderRouter = require('./order');
const wishlistRouter = require('./wishlist');
const reviewRouter = require('./review');

module.exports =(app)=>{
    app.use('/auth',authRouter)
    app.use('/product',productRouter)
    app.use('/cart',cartRouter)
    app.use('/order',orderRouter)
    app.use('/wishlist',wishlistRouter)
    app.use('/review',reviewRouter)
}
