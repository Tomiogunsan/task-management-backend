const AppError = require('./appError');

// eslint-disable-next-line arrow-body-style
// exports.getRole = (roles) => {
//   return (req, res, next) => {
//     const userRole = req.user.role;
//     if (!roles.includes(userRole)) {
//       return new AppError('Access denied', 403);
//     }
//     next();
//   };
// };

// eslint-disable-next-line arrow-body-style
const getRole = (roles) => {
  return (req, res, next) => {
    const userRole = req.session.user.role;
    if (userRole === roles) {
      next();
    } else {
      return new AppError('Access is denied', 403);
    }
  };
};

module.exports = getRole;
