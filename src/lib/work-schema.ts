import { z } from 'astro/zod';

// `image` is Astro's schema helper; injected so tests can run without Astro.
export const makeWorkSchema = (image: () => z.ZodType) =>
  z.object({
    title: z.string(),
    client: z.string(),
    summary: z.string(),
    role: z.string(),
    stack: z.array(z.string()).min(1),
    problem: z.string(),
    approach: z.string(),
    result: z.string(),
    metrics: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
    url: z.url().optional(),
    cover: image(),
    gallery: z.array(image()).optional(),
    featured: z.boolean(),
    order: z.number(),
    kind: z.enum(['wordpress', 'saas', 'ghl']),
  });
