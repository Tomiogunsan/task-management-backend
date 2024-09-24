const Team = require('../models/teamModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

exports.createTeam = catchAsync(async (req, res) => {
  const newTeam = await Team.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      team: newTeam,
    },
  });
});

exports.addMembers = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  console.log(req.body);
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
