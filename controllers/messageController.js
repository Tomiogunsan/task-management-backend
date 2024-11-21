// const socketio = require('socket.io');

const Message = require('../models/messageModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Team = require('../models/teamModel');
// const server = require('../server');
// const io = socketio(server);

exports.createMessage = catchAsync(async (req, res, next) => {
  const { content, userId, teamId } = req.body;
  const team = await Team.findById(teamId);
  if (!team) {
    return next(new AppError('No team found ', 404));
  }
  const user = await User.findById(userId);

  const teamMember = team.members.find(
    (memberId) => memberId.toString() === user._id.toString(),
  );

  if (user.role !== 'admin' && !teamMember) {
    return next(new AppError('This user is not part of this team', 404));
  }

  const messageObject = await Message.create({
    content,
    sender: user._id,
    team: teamId,
  });

  const message = await Message.find({ _id: messageObject._id }).populate(
    'sender',
    'name role',
  );

  // io.to(req.params.teamId).emit('receiveMessage', message);

  res.status(201).json({
    status: 'success',
    message: 'Message created successfully',
    data: {
      message: message[0],
    },
  });
});

exports.getTeamMessages = catchAsync(async (req, res, next) => {
  const { teamId } = req.body;
  const team = await Team.findById(teamId);
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
