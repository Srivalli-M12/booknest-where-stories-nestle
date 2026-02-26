const Book = require('../models/Book');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find().populate('seller', 'name email');
        res.status(200).json({ success: true, count: books.length, data: books });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
exports.getBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('seller', 'name email');

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json({ success: true, data: book });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Create new book
// @route   POST /api/books
// @access  Private (Seller/Admin)
exports.createBook = async (req, res) => {
    try {
        // Add user to req.body
        req.body.seller = req.user.id;

        const book = await Book.create(req.body);

        res.status(201).json({ success: true, data: book });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private (Seller/Admin)
exports.updateBook = async (req, res) => {
    try {
        let book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Make sure user is book owner
        if (book.seller.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to update this book' });
        }

        book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ success: true, data: book });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private (Seller/Admin)
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Make sure user is book owner
        if (book.seller.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to delete this book' });
        }

        await book.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
