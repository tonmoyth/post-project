import { z } from 'zod';

const createComment = z.object({
  body: z.object({
    postId: z.string().min(1, "Post ID is required"),
    content: z.string().min(1, "Content cannot be empty"),
  })
});

const updateComment = z.object({
  params: z.object({
    id: z.string().min(1, "Comment ID is required"),
  }),
  body: z.object({
    content: z.string().min(1, "Content cannot be empty"),
  })
});

export const commentValidationSchema = {
  createComment,
  updateComment
};
