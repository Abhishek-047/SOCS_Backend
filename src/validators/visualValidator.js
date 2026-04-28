const { z } = require('zod');

const visualPayload = z.object({
  title: z.string().min(3).max(180),
  category: z.string().max(100),
  src: z.string().url().max(255)
});

const visualIdParams = z.object({
  id: z.string().uuid()
});

const createVisualSchema = z.object({
  body: visualPayload,
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

const updateVisualSchema = z.object({
  body: visualPayload.partial(),
  query: z.object({}).optional(),
  params: visualIdParams
});

const getVisualSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: visualIdParams
});

const listVisualSchema = z.object({
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
  createVisualSchema,
  updateVisualSchema,
  getVisualSchema,
  listVisualSchema
};
