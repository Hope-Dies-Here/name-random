const mongoose = require('mongoose');
const url = `process.env.DB_URL`
const connectDB = async () => {
    try {
        await mongoose.connect(url);
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

module.exports = connectDB;
