import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI!); // Use non-null assertion (!) since we know it's defined
    console.log('MongoDB Connected...');
  } catch (err: any) { // Use 'any' type for now, you can create a more specific error type if needed
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;