import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface for User document
interface IUser extends Document {
  email: string;
  password?: string; // Make password optional, as it may not be present in all queries (e.g., when excluding it)
  role: 'recruiter' | 'candidate';
  name?: string;
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

// Define the schema
const UserSchema: Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['recruiter', 'candidate'],
    required: true,
  },
  name: {
    type: String,
    trim: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password!, salt); // Non-null assertion, as we checked isModified
  next();
});

// Method to compare password (using the correct `this` context)
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password!); // Non-null assertion
};

// Create and export the model
const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;