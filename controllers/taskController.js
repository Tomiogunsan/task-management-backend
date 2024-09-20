const Task = require('../models/taskModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createTask = catchAsync(async (req, res) => {
  const { name, description } = req.body;
  const task = new Task({
    name,
    description,
    project: req.params.projectId,
  });
  await task.save();
  res.status(201).json({
    status: 'success',
    data: {
      task,
    },
  });
});

exports.getAllTask = catchAsync(async (req, res, next) => {
  console.log(req.params.id);
  const tasks = await Task.find().populate('project');
  if (!tasks) {
    return next(new AppError('No task found ', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tasks,
    },
  });
});

exports.deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findByIdAndDelete(req.params.taskId);
  if (!task) return next(new AppError('invalid ID', 404));
  res.status(200).json({
    status: 'success',
    message: 'Task deleted successfully',
  });
});
