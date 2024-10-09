const mongoose = require('mongoose');
const url = `mongodb+srv://sarah:sarah@cluster0.xr5qdwo.mongodb.net/name`
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
