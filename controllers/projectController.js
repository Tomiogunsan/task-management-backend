const Project = require('../models/projectModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createProject = catchAsync(async (req, res) => {
  const newProject = await Project.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      project: newProject,
    },
  });
});

exports.getAllProject = catchAsync(async (req, res, next) => {
  const projects = await Project.find();
  if (!projects) {
    return next(new AppError('No project found ', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      project: projects,
    },
  });
});
