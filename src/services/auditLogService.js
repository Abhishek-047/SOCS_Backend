const auditLogRepository = require('../repositories/auditLogRepository');

const log = async ({ userId = null, action, ip, userAgent }) =>
  auditLogRepository.create({
    userId,
    action,
    ip,
    userAgent
  });

module.exports = {
  log
};
