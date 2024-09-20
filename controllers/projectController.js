const Project = require('../models/projectModel');
const catchAsync = require('../utils/catchAsync');

// exports.createTour = catchAsync(async (req, res) => {
//   const newTour = await Tour.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour,
//     },
//   });
// });

exports.create = catchAsync(async (req, res) => {
  const newProject = await Project.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      project: newProject,
    },
  });
});
