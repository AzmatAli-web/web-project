const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://azmat:123@cluster0.rj8jj3z.mongodb.net/campus-marketplace?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};


module.exports = connectDB;