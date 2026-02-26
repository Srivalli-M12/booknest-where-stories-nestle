const Order = require('../models/Order');
const Book = require('../models/Book');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.addOrderItems = async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    } else {
        try {
            const order = new Order({
                orderItems,
                user: req.user._id,
                shippingAddress,
                paymentMethod,
                totalPrice,
            });

            const createdOrder = await order.save();

            // Update stock for each book
            for (const item of orderItems) {
                await Book.findByIdAndUpdate(item.book, {
                    $inc: { stock: -item.quantity },
                });
            }

            res.status(201).json(createdOrder);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            'user',
            'name email'
        );

        if (order) {
            // Check if user is owner or admin
            if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized' });
            }
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
exports.updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Potential check for seller authorization could go here if needed
        // For now, let's just make the update robust

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                isDelivered: true,
                deliveredAt: Date.now(),
                status: 'Delivered'
            },
            { new: true, runValidators: false } // runValidators: false to ensure old orders don't break
        );

        res.json(updatedOrder);
    } catch (err) {
        console.error('Update order to delivered error:', err);
        res.status(500).json({ message: 'Update failed: ' + err.message });
    }
};
// @desc    Get seller orders
// @route   GET /api/orders/seller
// @access  Private/Seller
exports.getSellerOrders = async (req, res) => {
    try {
        // Find all books by this seller
        const books = await Book.find({ seller: req.user.id });
        const bookIds = books.map(b => b._id.toString());

        // Find orders containing any of these books
        // We look for orders where at least one orderItem has a book in bookIds
        const orders = await Order.find({
            'orderItems.book': { $in: bookIds }
        }).populate('user', 'name email');

        // Filter orderItems to only show books belonging to this seller? 
        // User probably wants to see the whole order but knows which items are theirs.
        // For now, let's return the full orders.
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (err) {
        console.error('Get seller orders error:', err);
        res.status(500).json({ message: err.message });
    }
};
