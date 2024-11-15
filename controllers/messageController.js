const Message = require('../models/messageModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Team = require('../models/teamModel');

exports.createMessage = catchAsync(async (req, res, next) => {
  const { content, userId } = req.body;
  const team = await Team.findById(req.params.teamId);
  if (!team) {
    return next(new AppError('No team found ', 404));
  }
  const user = await User.findById(userId);
  console.log(user);
  const teamMember = team.members.map(
    (memberId) => memberId.toString() === user._id.toString(),
  );
  console.log(teamMember);
  if (user.role !== 'admin' && Boolean(teamMember)) {
    return next(new AppError('This user is not part of this team', 404));
  }
  await Message.create({
    content,
    sender: user,
    team,
  });
  res.status(201).json({
    status: 'success',
    message: 'Message created successfully',
  });
});

exports.getTeamMessages = catchAsync(async (req, res, next) => {
  const team = await Team.findById(req.params.teamId);
  if (!team) {
    return next(new AppError('No team found ', 404));
  }
  const messages = await Message.find({ team: team._id })
    .populate('sender', 'name role')
    .sort({ createdAt: 1 });
  res.status(200).json({
    status: 'success',
    data: {
      messages,
    },
  });
});
