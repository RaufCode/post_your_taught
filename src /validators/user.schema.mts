import { z } from "zod";

// Helper transform functions
const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const normalizeEmail = (email: string) => email.trim().toLowerCase();


// Create User Schema (password required)
export const createUserSchema = z.object({
  first_name: z
    .string()
    .min(3, { message: "First name must be at least 3 characters" })
    .transform((val) => capitalize(val)),
  last_name: z
    .string()
    .min(3, { message: "Last name must be at least 3 characters" })
    .transform((val) => capitalize(val)),
  user_name: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .transform((val) => normalizeEmail(val)),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must include at least one special character" }),
  role: z.enum(["user", "admin"]).optional()
});

// Update User Schema (all fields optional, password optional)
export const updateUserSchema = z.object({
  first_name: z
    .string()
    .min(3, { message: "First name must be at least 3 characters" })
    .optional()
    .transform((val) => val ? capitalize(val) : val),
  last_name: z
    .string()
    .min(3, { message: "Last name must be at least 3 characters" })
    .optional()
    .transform((val) => val ? capitalize(val) : val),
  user_name: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .optional(),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .optional()
    .transform((val) => val ? normalizeEmail(val) : val),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must include at least one special character" })
    .optional(),
  role: z.enum(["user", "admin"]).optional()
});
