// src/schemas/patientSchema.ts
import { z } from "zod";

export const patientSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),
        // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        // .regex(/[0-9]/, "Password must contain at least one number"),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    medical_record_number: z.string().min(1, "Medical record number is required"),
    birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    sex: z.enum(["M", "F", "I", "O", "U", "P"], {
        required_error: "Please select a gender",
        invalid_type_error: "Please select a valid gender option"
    }),
    primary_doctor: z.string().uuid("Invalid UUID format for doctor ID"),
});