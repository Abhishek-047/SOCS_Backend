const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    return value
      .replace(/<script.*?>.*?<\/script>/gi, '')
      .replace(/[<>]/g, '')
      .trim();
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === 'object') {
    return Object.keys(value).reduce((accumulator, key) => {
      accumulator[key] = sanitizeValue(value[key]);
      return accumulator;
    }, {});
  }

  return value;
};

module.exports = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }

  if (req.query) {
    req.query = sanitizeValue(req.query);
  }

  next();
};
