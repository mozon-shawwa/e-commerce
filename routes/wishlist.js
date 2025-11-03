const express = require('express');
const { auth } = require('../middlewares/');
const { wishlistItems, getMyWishlist } = require('../controllers/wishlist');

const router = express.Router();

router.get('/my-wishlist', auth, getMyWishlist)
      .post('/add-remove', auth, wishlistItems);

module.exports = router;

