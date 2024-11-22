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
  const { teamId } = req.query;
  let teams = await Team.find()
    .populate('projects', ' _id, name')
    .sort({ dateCreated: -1 });

  if (teamId) {
    teams = teams.filter((team) => team._id.toString() === teamId);
  }
  if (!teams.length) {
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

  const userId = users.map((item) => item._id);

  if (userId.toString() !== memberId) {
    return next(new AppError(' User not found', 404));
  }
  const existingTeams = await Team.find({ members: { $in: memberId } });

  if (existingTeams.length > 0) {
    return next(
      new AppError(
        `This user is already assigned to another team: ${existingTeams.map((teams) => teams.name).join(', ')}`,
        400,
      ),
    );
  }

  await Promise.all(
    users.map(async (user) => {
      if (!user.teams.includes(team._id)) {
        user.teams.push(team._id);
        await user.save();
      }
    }),
  );
  const updatedTeam = await Team.findByIdAndUpdate(
    id,
    {
      $addToSet: { members: memberId },
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

  const teamProjectId = team.projects
    ? team.projects.map((item) => item._id)
    : [];

  if (teamProjectId && teamProjectId.includes(projectId)) {
    return next(new AppError('This team already has a project', 404));
  }

  team.projects.push(project);
  await team.save();
  await Promise.all(
    team.members.map(async (memberId) => {
      const user = await User.findById(memberId);
      if (!user) return next(new AppError('This team has no member', 404));
      project.teamMembers.push(user);

      const projectIds = user.projects
        ? user.projects.map((item) => item._id)
        : [];
      if (projectIds.includes(projectId)) {
        return next(
          new AppError('This Project has already been assigned', 404),
        );
      }
      if (!projectIds.includes(projectId)) {
        user.projects.push(project);
      }
      await user.save();
    }),
  );
  await project.save();
  res.status(200).json({
    status: 'success',
    message: 'Project Added Successfully',
    data: {},
  });
});

exports.getAllTeamMembers = catchAsync(async (req, res, next) => {
  const team = await Team.findById(req.params.id);

  if (!team) return next(new AppError('No Team Found', 404));

  const members = await User.find({ _id: { $in: team.members } })
    .populate({
      path: 'projects',
      select: '_id name',
      populate: {
        path: 'task',
        select: '_id name description status project dateCreated',
      },
    })
    .sort({
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

exports.getTeamMemberDetails = catchAsync(async (req, res, next) => {
  const { id: teamId, memberId } = req.params;
  const team = await Team.findById(teamId);
  if (!team) return next(new AppError('No Team Found', 404));
  if (!team.members.includes(memberId)) {
    return next(new AppError('Member not found in this team', 404));
  }
  const member = await User.findById(memberId).populate([
    {
      path: 'tasks',
      select: '_id name description status dateCreated',
      populate: {
        path: 'projects',
        select: '_id name',
      },
    },
  ]);
  if (!member) return next(new AppError('No member found', 404));
  res.status(200).json({
    status: 'success',
    data: {
      member,
    },
  });
});
