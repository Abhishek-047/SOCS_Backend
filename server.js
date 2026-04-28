require('dotenv').config();

const app = require('./src/app');
const { env } = require('./src/config/env');
const logger = require('./src/utils/logger');
const { prisma } = require('./src/config/database');

const server = app.listen(env.PORT, () => {
  logger.info(`SOCS backend listening on port ${env.PORT}`);
});

const shutdown = async (signal) => {
  logger.warn(`Received ${signal}. Shutting down gracefully.`);

  server.close(async () => {
    try {
      await prisma.$disconnect();
      logger.info('Prisma disconnected successfully.');
      process.exit(0);
    } catch (error) {
      logger.error('Error during Prisma disconnect.', error);
      process.exit(1);
    }
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

