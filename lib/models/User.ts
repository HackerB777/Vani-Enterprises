import mongoose from 'mongoose';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'admin' | 'user';
  createdAt: string;
}

const schema = new mongoose.Schema<IUser>({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true },
  phone:     String,
  role:      { type: String, enum: ['admin', 'user'], default: 'user' },
  createdAt: { type: String, default: () => new Date().toISOString() },
});

export const User = (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>('User', schema);
