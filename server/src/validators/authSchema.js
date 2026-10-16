import { z } from 'zod';

export const registerSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3, "Username must atleast be 3 characters long.")
        .max(30, 'Username cannot be more than 30 characters long.')
        .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can contain only letters, numbers, and underscores"
        ),
    
    password: z
        .string()
        .min(8, 'Password must be atleast 8 characters long.')
        .max(72, 'Password cannot be longer than 72 characters.'),
});

export const loginSchema = z.object({
    username: z
        .string()
        .trim()
        .min(1, "username is submitted.")
        .max(30, 'username cannot be longer than 30 characters.'),

    password: z
        .string()
        .min(1)
        .max(72)
});