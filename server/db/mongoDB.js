import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB is connected...');
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
}

connectToDatabase();

export { mongoose };
