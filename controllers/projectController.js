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
  console.log(projects)
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

exports.getProject = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project)
    return next(new AppError('No project found with that id ', 404));
  res.status(200).json({
    status: 'success',
    data: {
      project,
    },
  });
});

exports.updateProject = catchAsync(async (req, res, next) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!project) return next(new AppError('invalid ID', 404));
  res.status(200).json({
    status: 'success',
    data: {
      project,
    },
  });
});

exports.deleteProject = catchAsync(async (req, res, next) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return next(new AppError('invalid ID', 404));
  res.status(200).json({
    status: 'success',
    message: 'Project deleted successfully',
  });
});
