const express = require('express');
const { auth } = require('../middlewares/');
const { createReview, getProductReviews } = require('../controllers/review');

const router = express.Router();

router.post('/create', auth, createReview)
      .get('/:productId', getProductReviews);

module.exports = router;