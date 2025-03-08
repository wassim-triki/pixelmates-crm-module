const { z } = require('zod');

const baseSignupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
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
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  email: z.string().email(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

module.exports = {
  signupSchema,
  loginSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
};
