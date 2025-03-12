const { z } = require('zod');

const baseSignupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
});

const clientSignupSchema = baseSignupSchema.extend({
  role: z.literal('Client'),
});

const adminSignupSchema = baseSignupSchema.extend({
  role: z.literal('Admin'),
});

const signupSchema = z.union([clientSignupSchema, adminSignupSchema]);

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const resetPasswordSchema = z.object({
  token: z.string().nonempty('Reset token is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  email: z.string().email(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const verifyEmailSchema = z.object({
  email: z.string().email(),
  code: z
    .string()
    .length(6, 'Verification code must be exactly 6 digits')
    .regex(/^\d{6}$/, 'Verification code must be numeric'),
});

const resendVerificationSchema = z.object({
  email: z.string().email(),
});

module.exports = {
  signupSchema,
  loginSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
  verifyEmailSchema, // ✅ New schema for verifying email
  resendVerificationSchema, // ✅ New schema for resending verification code
};
