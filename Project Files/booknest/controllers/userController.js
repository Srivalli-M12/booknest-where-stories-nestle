const User = require('../models/User');

// @desc    Get current logged in user
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
        businessName: req.body.businessName
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: user });
};

// @desc    Update password
// @route   PUT /api/users/updatepassword
// @access  Private
exports.updatePassword = async (req, res) => {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
        return res.status(401).json({ message: 'Password is incorrect' });
    }

    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
};

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('wishlist');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        // Filter out nulls in case books were deleted
        const wishlist = user.wishlist.filter(item => item !== null);
        res.status(200).json({ success: true, data: wishlist });
    } catch (err) {
        console.error('Get wishlist error:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// @desc    Add/Remove book from wishlist (toggle)
// @route   POST /api/users/wishlist/:id
// @access  Private
exports.toggleWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Initialize wishlist if it doesn't exist
        if (!user.wishlist) {
            user.wishlist = [];
        }

        const bookId = req.params.id;
        console.log(`[WISHLIST] Toggling for user: ${user.email}, bookId: ${bookId}`);

        const index = user.wishlist.findIndex(id => id && id.toString() === bookId);

        if (index === -1) {
            user.wishlist.push(bookId);
            await user.save();
            console.log('[WISHLIST] Added successfully');
            res.status(200).json({ success: true, message: 'Added to wishlist', isWishlisted: true });
        } else {
            user.wishlist.splice(index, 1);
            await user.save();
            console.log('[WISHLIST] Removed successfully');
            res.status(200).json({ success: true, message: 'Removed from wishlist', isWishlisted: false });
        }
    } catch (err) {
        console.error('Wishlist toggle error:', err);
        res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }
};
