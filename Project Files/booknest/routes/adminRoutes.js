const express = require('express');
const { getUsers, updateUser, deleteUser, approveSeller, adminGetBooks } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin')); // All admin routes require admin role

router.route('/users').get(getUsers);
router.route('/users/:id').put(updateUser).delete(deleteUser);
router.put('/sellers/:id/approve', approveSeller);
router.get('/books', adminGetBooks);

module.exports = router;
