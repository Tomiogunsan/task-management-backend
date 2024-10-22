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
    .sort({ dateCreated: -1 });
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
  const existingTeams = await Team.find({ members: { $in: memberId } });
  if (existingTeams.length > 0) {
    const assignedUsers = existingTeams.flatMap((teams) => teams.members);
    const alreadyAssigned = users.filter((user) =>
      assignedUsers.includes(user._id.toString()),
    );

    return next(
      new AppError(
        `Some users are already assigned to another team: ${alreadyAssigned.map((user) => user.name).join(', ')}`,
        400,
      ),
    );
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

exports.getAllTeamMembers = catchAsync(async (req, res, next) => {
  const team = await Team.findById(req.params.id);
  if (!team) return next(new AppError('No Team Found', 404));
  const members = await User.find({ _id: { $in: team.members } }).sort({
    createdAt: -1,
  });
  if (members.length === 0) {
    return res.status(200).json({
      status: 'success',
      data: {
        members: [],
      },
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      members,
    },
  });
});
