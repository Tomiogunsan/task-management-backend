const AppError = require('./appError');

module.exports = (req, res, next) => {
  if (req.user === 'admin') {
    return next();
  }
  return next(new AppError('Access denied. Admins only.', 403));
};
