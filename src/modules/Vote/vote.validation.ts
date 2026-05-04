import { z } from 'zod';

const votePost = z.object({
  body: z.object({
    value: z.number().refine(val => val === 1 || val === -1, {
      message: 'Value must be either 1 or -1'
    }),
  })
});

export const voteValidationSchema = {
  votePost
};
