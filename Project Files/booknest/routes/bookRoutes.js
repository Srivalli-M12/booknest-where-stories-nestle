const express = require('express');
const {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
} = require('../controllers/bookController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(getBooks).post(protect, authorize('seller', 'admin'), createBook);

router
    .route('/:id')
    .get(getBook)
    .put(protect, authorize('seller', 'admin'), updateBook)
    .delete(protect, authorize('seller', 'admin'), deleteBook);

module.exports = router;
