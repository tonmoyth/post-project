import { z } from 'zod';

export const userValidationSchema = {
    register: z.object({
        body: z.object({
            email: z.string().email(),
            password: z.string().min(6),
            name: z.string(),
        }),
    }),
    login: z.object({
        body: z.object({
            email: z.string().email(),
            password: z.string().min(6),
        }),
    }),
};

