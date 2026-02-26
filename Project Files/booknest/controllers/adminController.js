const User = require('../models/User');
const Book = require('../models/Book');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res) => {
    const users = await User.find();
    res.status(200).json({ success: true, count: users.length, data: users });
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
exports.updateUser = async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({ success: true, data: user });
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
};

// @desc    Approve seller
// @route   PUT /api/admin/sellers/:id/approve
// @access  Private (Admin)
exports.approveSeller = async (req, res) => {
    const seller = await User.findByIdAndUpdate(req.params.id, { isApproved: true }, {
        new: true,
        runValidators: true
    });
    res.status(200).json({ success: true, data: seller });
};

// @desc    Get all books (Admin view)
// @route   GET /api/admin/books
// @access  Private (Admin)
exports.adminGetBooks = async (req, res) => {
    const books = await Book.find().populate('seller', 'name email businessName');
    res.status(200).json({ success: true, count: books.length, data: books });
};
