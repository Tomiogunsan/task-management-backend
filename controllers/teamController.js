const Team = require('../models/teamModel');
const catchAsync = require('../utils/catchAsync');

exports.createTeam = catchAsync(async (req, res) => {
  const newTeam = await Team.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      team: newTeam,
    },
  });
});
