// models/User.ts
import mongoose, { Schema, Model, Document, Types } from 'mongoose';

/**
 * Possible user roles: 
 *   GLOBAL_ADMIN | BOOKING_ADMIN | GROUP_CAPTAIN | TEAM_MEMBER
 * Adjust or add more roles as needed.
 */
export type UserRole = 'GLOBAL_ADMIN' | 'BOOKING_ADMIN' | 'GROUP_CAPTAIN' | 'TEAM_MEMBER';

/**
 * IUser interface extends Document so TS knows this is a Mongoose doc.
 * We explicitly define `_id: Types.ObjectId` so `_id` isn't unknown.
 */
export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  phone: string;
  passwordHash: string;
  name?: string;
  avatarUrl?: string;
  role: UserRole;
  // add more fields (avatarUrl, phone, etc.) if needed
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    passwordHash: { type: String, required: true },
    name: { type: String },
    avatarUrl: { type: String },
    role: {
      type: String,
      enum: ['GLOBAL_ADMIN', 'BOOKING_ADMIN', 'GROUP_CAPTAIN', 'TEAM_MEMBER'],
      default: 'TEAM_MEMBER',
    },
  },
  { timestamps: true }
);

/**
 * In Next.js dev, hot reloading can cause model re-compilation,
 * so we check if the model already exists in `mongoose.models`.
 */
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
