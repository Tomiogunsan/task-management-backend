const User = require('../models/userModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const signToken = require('../utils/signToken');

const blacklistedToken = new Set();

exports.signup = catchAsync(async (req, res, next) => {
  const allowedRoles = ['team-member', 'project-manager', 'admin'];
  let userRole = 'team-member';
  const adminExists = await User.findOne({ role: 'admin' });

  if (!adminExists && req.body.role === 'admin') {
    userRole = 'admin';
  } else if (req.body.role === 'admin' || req.body.role === 'project-manager') {
    return next(new AppError('Unauthorized to create this role', 403));
  }

  if (req.body.role && allowedRoles.includes(req.body.role)) {
    userRole = req.body.role;
  }
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: userRole,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    message: 'Registration is successful',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    next(new AppError('Incorrect email or password', 401));
  }
  if (user) {
    req.session.user = { id: user._id, role: user.role };

    req.session.save((err) => {
      if (err) {
        return next(new AppError('Session save failed', 500));
      }
      // Continue with your response or next action
    });
  }
  const payload = {
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const token = signToken(payload);

  res.status(200).json({
    status: 'success',
    message: 'Logged in successfully',
    token,
  });
});

exports.logOut = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  if (token) {
    blacklistedToken.add(token);
    res.status(200).json({
      message: 'Logged out successfully',
    });
  } else {
    res.status(400).json({ message: 'No token provided' });
  }
};
