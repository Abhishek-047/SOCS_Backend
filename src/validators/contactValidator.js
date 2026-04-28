const { z } = require('zod');

const submitContactSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120),
    email: z.string().email(),
    message: z.string().min(10).max(5000)
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

module.exports = {
  submitContactSchema
};
