import { Schema, model } from 'mongoose';
import { genSalt, hash, compare } from 'bcryptjs';

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return compare(candidatePassword, this.password);
};

const User = model('User', userSchema);

export default User;