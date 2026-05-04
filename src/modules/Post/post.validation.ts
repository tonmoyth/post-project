import { z } from 'zod';

const createPost = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters long'),
    description: z.string().min(3, 'Description must be at least 3 characters long'),
    url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  })
});

const getSinglePost = z.object({
  params: z.object({
    id: z.string(),
  })
});

const updatePost = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters long').optional(),
    description: z.string().min(3, 'Description must be at least 3 characters long').optional(),
    url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  })
});

export const postValidationSchema = {
  createPost,
  getSinglePost,
  updatePost
};
