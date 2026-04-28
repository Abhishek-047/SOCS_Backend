const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');

const { env } = require('./config/env');
const { apiLimiter, authLimiter } = require('./config/rateLimit');
const requestLogger = require('./middleware/requestLogger');
const sanitizeInput = require('./middleware/sanitizeInput');
const notFoundHandler = require('./middleware/notFoundHandler');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
    credentials: true
  })
);
app.use(compression());
app.use(requestLogger);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeInput);
app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SOCS backend is healthy'
  });
});

app.use('/api', routes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
