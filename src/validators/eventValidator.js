const { z } = require('zod');

const eventPayload = z.object({
  title: z.string().min(3).max(180),
  description: z.string().min(10).max(5000),
  date: z.string().datetime()
});

const eventIdParams = z.object({
  id: z.string().uuid()
});

const createEventSchema = z.object({
  body: eventPayload,
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

const updateEventSchema = z.object({
  body: eventPayload.partial(),
  query: z.object({}).optional(),
  params: eventIdParams
});

const getEventSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: eventIdParams
});

const listEventsSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().max(100).optional(),
    fromDate: z.string().datetime().optional(),
    toDate: z.string().datetime().optional()
  }),
  params: z.object({}).optional()
});

module.exports = {
  createEventSchema,
  updateEventSchema,
  getEventSchema,
  listEventsSchema
};
