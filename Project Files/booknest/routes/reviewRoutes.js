const express = require('express');
const { addReview, getBookReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, addReview);
router.get('/book/:bookId', getBookReviews);

module.exports = router;
