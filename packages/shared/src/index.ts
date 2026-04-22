import {z} from 'zod';

export const NuggetSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  content: z.string().min(1),
  category: z.string(),
  createdAt: z.date(),
});

export type Nugget = z.infer<typeof NuggetSchema>;

