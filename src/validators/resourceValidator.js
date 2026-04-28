const { z } = require('zod');

const resourcePayload = z.object({
  title: z.string().min(3).max(180),
  description: z.string().min(10).max(5000),
  url: z.string().url().max(255),
  category: z.string().max(100),
  tags: z.array(z.string()).default([])
});

const resourceIdParams = z.object({
  id: z.string().uuid()
});

const createResourceSchema = z.object({
  body: resourcePayload,
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

const updateResourceSchema = z.object({
  body: resourcePayload.partial(),
  query: z.object({}).optional(),
  params: resourceIdParams
});

const getResourceSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: resourceIdParams
});

const listResourceSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().max(100).optional(),
    category: z.string().max(100).optional()
  }).optional(),
  params: z.object({}).optional()
});

module.exports = {
  createResourceSchema,
  updateResourceSchema,
  getResourceSchema,
  listResourceSchema
};
