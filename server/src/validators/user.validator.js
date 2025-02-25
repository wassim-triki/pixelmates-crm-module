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
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

module.exports = { signupSchema, loginSchema, resetPasswordSchema };
