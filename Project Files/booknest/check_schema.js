const mongoose = require('mongoose');
const User = require('./models/User');

console.log('--- USER SCHEMA PATHS ---');
console.log(Object.keys(User.schema.paths).join(', '));
process.exit();
