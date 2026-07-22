const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables. Please check your .env file.');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Please ensure:');
    console.error('1. MongoDB is installed and running');
    console.error('2. .env file exists in the backend directory with MONGO_URI');
    console.error('3. MONGO_URI is correctly formatted (e.g., mongodb://localhost:27017/portivo)');
    process.exit(1);
  }
};

module.exports = connectDB;

