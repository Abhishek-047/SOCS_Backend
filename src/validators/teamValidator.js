const { z } = require('zod');

const teamPayload = z.object({
  slug: z.string().min(1).max(120),
  name: z.string().min(1).max(120),
  role: z.string().min(1).max(120),
  skills: z.array(z.string()).default([]),
  image: z.string().url().max(255).optional().or(z.literal('')),
  github: z.string().url().max(255).optional().or(z.literal('')),
  linkedin: z.string().url().max(255).optional().or(z.literal('')),
  tier: z.string().max(50).default('member')
});

const teamIdParams = z.object({
  id: z.string().min(1).max(120)
});

const createTeamSchema = z.object({
  body: teamPayload,
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

const updateTeamSchema = z.object({
  body: teamPayload.partial(),
  query: z.object({}).optional(),
  params: teamIdParams
});

const getTeamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: teamIdParams
});

const listTeamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().max(100).optional()
  }).optional(),
  params: z.object({}).optional()
});

module.exports = {
  createTeamSchema,
  updateTeamSchema,
  getTeamSchema,
  listTeamSchema
};
