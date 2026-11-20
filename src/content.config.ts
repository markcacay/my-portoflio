import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { makeWorkSchema } from './lib/work-schema';

const work = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/work' }),
  schema: ({ image }) => makeWorkSchema(image),
});

export const collections = { work };
