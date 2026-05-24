import mongoose from 'mongoose';

export interface ISettings {
  _id: string;
  adminMobile: string;
  developerMobile: string;
}

const schema = new mongoose.Schema<ISettings>({
  _id:             String,
  adminMobile:     { type: String, default: '' },
  developerMobile: { type: String, default: '' },
});

export const Settings = (mongoose.models.Settings as mongoose.Model<ISettings>) ||
  mongoose.model<ISettings>('Settings', schema);
