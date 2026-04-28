const { z } = require('zod');

const projectPayload = z.object({
  title: z.string().min(3).max(180),
  description: z.string().min(10).max(5000),
  techStack: z.array(z.string().min(1)).min(1).max(50),
  githubLink: z.string().url().optional().or(z.literal(''))
});

const projectIdParams = z.object({
  id: z.string().uuid()
});

const createProjectSchema = z.object({
  body: projectPayload,
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

const updateProjectSchema = z.object({
  body: projectPayload.partial(),
  query: z.object({}).optional(),
  params: projectIdParams
});

const getProjectSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: projectIdParams
});

const listProjectsSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().max(100).optional(),
    createdById: z.string().uuid().optional()
  }),
  params: z.object({}).optional()
});

module.exports = {
  createProjectSchema,
  updateProjectSchema,
  getProjectSchema,
  listProjectsSchema
};
