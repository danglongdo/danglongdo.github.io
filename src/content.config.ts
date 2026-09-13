import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const projectSchema = z.object({
  title: z.string(),
  slug: z.string(),
  locale: z.enum(['en', 'vi']),
  summary: z.string(),
  role: z.string(),
  timeline: z.string(),
  techStack: z.array(z.string()),
  highlight: z.boolean().default(false),
  repoUrl: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  securityNotice: z.string().optional(),
  // Case-study structural sections
  challenge: z.string(),
  ownership: z.string(),
  approach: z.string(),
  solution: z.string(),
  outcome: z.string(),
  reflection: z.string(),
  order: z.number().default(0),
});

export const experienceSchema = z.object({
  company: z.string(),
  role: z.string(),
  location: z.string(),
  period: z.string(),
  description: z.string(),
  skills: z.array(z.string()),
  order: z.number().default(0),
  locale: z.enum(['en', 'vi']).optional(),
});

export type ProjectFrontmatter = z.infer<typeof projectSchema>;
export type ExperienceFrontmatter = z.infer<typeof experienceSchema>;

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/projects',
    generateId: ({ entry }) => entry.replace(/\.[^/.]+$/, ''),
  }),
  schema: projectSchema,
});

const experience = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/experience',
    generateId: ({ entry }) => entry.replace(/\.[^/.]+$/, ''),
  }),
  schema: experienceSchema,
});

export const collections = {
  projects,
  experience,
};
