const Review = require('../models/Review');
const Book = require('../models/Book');

// @desc    Add review
// @route   POST /api/reviews
// @access  Private
exports.addReview = async (req, res) => {
    const { rating, comment, bookId } = req.body;

    try {
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const alreadyReviewed = await Review.findOne({
            user: req.user._id,
            book: bookId,
        });

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Book already reviewed' });
        }

        const review = await Review.create({
            user: req.user._id,
            book: bookId,
            rating: Number(rating),
            comment,
        });

        // Update book rating and numReviews
        const reviews = await Review.find({ book: bookId });
        book.numReviews = reviews.length;
        book.ratings =
            reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

        await book.save();

        res.status(201).json({ success: true, data: review });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get book reviews
// @route   GET /api/reviews/book/:bookId
// @access  Public
exports.getBookReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ book: req.params.bookId }).populate(
            'user',
            'name'
        );
        res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
