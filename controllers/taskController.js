const Task = require('../models/taskModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Project = require('../models/projectModel');

exports.createTask = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;
  const project = await Project.findById(req.params.id);
  if (!project) {
    return next(new AppError('No project found ', 404));
  }
  const task = new Task({
    name,
    description,
    project: req.params.id,
  });
  await task.save();

  project.task.push(task);
  const savedProject = await project.save();
  if (!savedProject) {
    return next(new AppError('No project saved ', 404));
  }
  res.status(201).json({
    status: 'success',
    data: {
      task,
    },
  });
});

exports.getAllTask = catchAsync(async (req, res, next) => {
  // const { assignedUser } = req.query;
  const { id: projectId } = req.params;
  const filter = { project: projectId };
  // if (assignedUser) filter.assignedUser = assignedUser;
  const tasks = await Task.find(filter)
    .populate('project', '_id name')
    .populate('assignedUser', '_id name')
    .sort({ dateCreated: -1 });

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
  const { taskId, id } = req.params;
  const { userId } = req.body;
  const [project, task, user] = await Promise.all([
    Project.findById(id),
    Task.findById(taskId),
    User.findById(userId),
  ]);

  if (!project) return next(new AppError('No project found', 404));

  if (!task) return next(new AppError('No task found', 404));

  if (!user) return next(new AppError('No user found', 404));
  const checkTask = project.task.find((item) => item._id.toString() === taskId);
  if (!checkTask) {
    return next(new AppError('This task is not assigned to this project', 404));
  }
  const checkTeamUser = project.teamMembers.find(
    (item) => item._id.toString() === userId,
  );
  if (!checkTeamUser) {
    return next(new AppError('This user is not part of this team', 404));
  }
  if (!user.projects.map((item) => item._id.toString()).includes(id)) {
    user.projects.push(project);
    await user.save();
  }

  user.tasks.push(task);

  task.assignedUser.push(user);
  await Promise.all([user.save(), task.save()]);

  res.status(200).json({
    status: 'success',
    message: 'Task Assigned Successfully',
    data: {},
  });
});

exports.updateTaskStatus = catchAsync(async (req, res, next) => {
  const allowedTransitions = {
    pending: 'in-progress',
    'in-progress': 'completed',
  };

  const project = await Project.findById(req.params.id);
  if (!project) return next(new AppError('No project found', 404));
  const projectTask = project.task.find(
    (item) => item._id.toString() === req.params.taskId,
  );
  if (!projectTask) return next(new AppError('No task found', 404));
  const task = await Task.findById(req.params.taskId);

  if (!task) return next(new AppError('invalid ID', 404));
  if (task.assignedUser.length === 0) {
    return next(new AppError('Task is not assigned to any user', 404));
  }
  const currentStatus = task.status;
  const newStatus = allowedTransitions[currentStatus];
  if (!newStatus) {
    return next(
      new AppError(
        `Task is already completed. No further status updates allowed`,
        400,
      ),
    );
  }
  task.status = newStatus;
  await task.save();

  res.status(200).json({
    status: 'success',
    message: 'Task updated successfully',
  });
});
