const pickRequestMeta = (req) => ({
  ip: req.ip,
  userAgent: req.get('user-agent') || 'unknown'
});

module.exports = pickRequestMeta;
