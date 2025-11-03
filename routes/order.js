const express = require('express');
const {auth,admin} = require('../middlewares/')
const {createOrder,
       getAllOrders,
       getMyOrders,
       updateOrderStatus,
       getOrderById}= require('../controllers/order');

const router =  express.Router();

router.post('/create',auth,createOrder)
      .get('/getById/:id',auth,getOrderById)
      .get('/getMyOrders',auth,getMyOrders)
      .put('/updateStatus/:id',auth,admin,updateOrderStatus)
      .get('/getAll',auth,admin,getAllOrders)

module.exports = router;