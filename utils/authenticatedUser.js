const jwt = require('jsonwebtoken');
const AppError = require('./appError');
const catchAsync = require('./catchAsync');

const authenticatedUser = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    return next(new AppError('Authentication required', 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decoded.user.role;

  next();
});

module.exports = authenticatedUser;
