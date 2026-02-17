import { z } from 'zod';
import { ResourceType, Privacy } from '../types';

// Resource Upload Schema
export const resourceSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
    subject: z.string().min(2, "Subject is required"),
    semester: z.string().min(1, "Semester is required"),
    type: z.nativeEnum(ResourceType),
    year: z.string().regex(/^\d{4}$/, "Year must be a 4-digit number (e.g. 2023)"),
    description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters"),
    privacy: z.nativeEnum(Privacy),
    tags: z.array(z.string()).min(1, "At least one tag is required"),
});

// Review Schema
export const reviewSchema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string()
        .min(5, "Review must be at least 5 characters long")
        .max(1000, "Review cannot exceed 1000 characters")
});

// Auth Schema
export const passwordRequirements = {
    minLength: 8,
    hasUpperCase: (v: string) => /[A-Z]/.test(v),
    hasLowerCase: (v: string) => /[a-z]/.test(v),
    hasNumber: (v: string) => /[0-9]/.test(v),
    hasSpecialChar: (v: string) => /[^A-Za-z0-9]/.test(v),
};

export const passwordSchema = z.string()
    .min(passwordRequirements.minLength, `Password must be at least ${passwordRequirements.minLength} characters`)
    .refine(passwordRequirements.hasUpperCase, "Password must contain at least one uppercase letter")
    .refine(passwordRequirements.hasLowerCase, "Password must contain at least one lowercase letter")
    .refine(passwordRequirements.hasNumber, "Password must contain at least one number")
    .refine(passwordRequirements.hasSpecialChar, "Password must contain at least one special character");

