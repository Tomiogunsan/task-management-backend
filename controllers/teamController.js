const Team = require('../models/teamModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Project = require('../models/projectModel');

exports.createTeam = catchAsync(async (req, res) => {
  const newTeam = await Team.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      team: newTeam,
    },
  });
});

exports.getAllTeam = catchAsync(async (req, res, next) => {
  const teams = await Team.find()
    .populate('projects', ' name')
    .sort({ createdAt: -1 });
  if (!teams) {
    return next(new AppError('No team found ', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      teams,
    },
  });
});

exports.addMembers = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const { memberId } = req.body;
  const team = await Team.findById(id);

  if (!team) return next(new AppError('No Team Found', 404));
  const users = await User.find({ _id: { $in: memberId } });
  if (users.length !== memberId.length) {
    return next(new AppError('Some users not found', 404));
  }
  const updatedTeam = await Team.findByIdAndUpdate(
    id,
    {
      $addToSet: { members: { $each: memberId } },
    },
    { new: true, runValidators: true },
  );

  res.status(200).json({
    status: 'success',
    data: {
      team: updatedTeam,
    },
  });
});

exports.assignProject = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { projectId } = req.body;
  const team = await Team.findById(id);
  if (!team) return next(new AppError('No Team Found', 404));
  const project = await Project.findById(projectId);
  if (!project) return next(new AppError('No Project Found', 404));

  const updatedTeam = await Team.findByIdAndUpdate(
    id,
    {
      $addToSet: { projects: projectId },
    },
    { new: true, runValidators: true },
  );
  res.status(200).json({
    status: 'success',
    message: 'Project Added Successfully',
    data: {
      team: updatedTeam,
    },
  });
});
