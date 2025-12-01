import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    hashedPassword: { type: String, required: true },
    displayName: { type: String, required: true, trim: true },
    avatarUrl: { type: String },
    avatarId: { type: String },
    bio: {
      type: String,
      maxlength: 500
    },
    phone: {
      type: String,
      sparse: true // cho phép để trống trường này nhưng vẫn duy trì tính duy nhất nếu có dữ liệu
    }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
