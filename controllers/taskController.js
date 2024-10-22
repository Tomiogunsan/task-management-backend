const Task = require('../models/taskModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

exports.createTask = catchAsync(async (req, res) => {
  const { name, description } = req.body;
  const task = new Task({
    name,
    description,
    project: req.params.id,
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
  const tasks = await Task.find()
    .populate('project', '_id name')
    .sort({ createdAt: -1 });
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

exports.getTask = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.taskId).populate(
    'project',
    '_id name',
  );
  if (!task) return next(new AppError('invalid ID', 404));
  res.status(200).json({
    status: 'success',
    data: {
      task,
    },
  });
});

exports.updateTask = catchAsync(async (req, res, next) => {
  const task = await Task.findByIdAndUpdate(req.params.taskId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!task) return next(new AppError('invalid ID', 404));
  res.status(200).json({
    status: 'success',
    data: {
      task,
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

exports.assignUsersToTask = catchAsync(async (req, res, next) => {
  const { taskId } = req.params;
  const { userId } = req.body;

  const task = await Task.findById(taskId);
  if (!task) return next(new AppError('No task found', 404));

  const user = await User.findById(userId);
  if (!user) return next(new AppError('No user found', 404));

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    {
      assignedUser: userId,
    },
    { new: true, runValidators: true },
  );
  res.status(200).json({
    status: 'success',
    message: 'User Assigned Successfully',
    data: {
      task: {
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        ...updatedTask.toObject(),
      },
    },
  });
});
