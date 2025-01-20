import { createTransport } from 'nodemailer';
import logger from '../config/logger';

const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  logger.info('Sending verification email', { email });

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Verify your email',
    html: `
      <h1>Email Verification</h1>
      <p>Please click the link below to verify your email:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    `
  });
};

const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  logger.info('Sending password reset email', { email });

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset</h1>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you didn't request this, please ignore this email.</p>
    `
  });
};

export default {
  sendVerificationEmail,
  sendPasswordResetEmail
};