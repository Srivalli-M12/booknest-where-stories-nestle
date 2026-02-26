const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const email = 'admin@example.com';
        const rawPassword = 'password123';

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            console.log('USER NOT FOUND IN DB');
            process.exit();
        }

        console.log('USER FOUND:', user.email);
        console.log('ROLE:', user.role);
        console.log('HASH IN DB:', user.password);

        const isMatch = await bcrypt.compare(rawPassword, user.password);
        console.log('BCRYPT MATCH RESULT:', isMatch);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

check();
