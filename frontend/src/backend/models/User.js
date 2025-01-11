import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['buyer', 'seller'] },
});

const User = mongoose.model('User', userSchema);

export default User;  // Make sure to use default export
