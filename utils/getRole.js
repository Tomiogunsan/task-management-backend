const AppError = require('./appError');

// eslint-disable-next-line arrow-body-style
exports.getRole = (roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      return new AppError('Access denied', 403);
    }
    next();
  };
};
