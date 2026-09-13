import Task from '../models/Task.js';

export const createTask = async (req, res, next) => {
  try {
    const { title, description, organizationId, projectId, priority, status, assigneeId, dueDate } = req.body;

    if (!title || !organizationId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Task title and organization ID are required',
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      organizationId,
      projectId: projectId || null,
      priority: priority || 'MEDIUM',
      status: status || 'TODO',
      assigneeId: assigneeId || null,
      createdBy: req.user._id,
      dueDate: dueDate || null,
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assigneeId', 'name email')
      .populate('createdBy', 'name email')
      .populate('projectId', 'name');

    res.status(201).json({
      status: 'success',
      task: populatedTask,
    });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const orgId = req.query.organizationId || req.headers['x-organization-id'];

    if (!orgId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Organization ID is required',
      });
    }

    const query = { organizationId: orgId };
    if (req.query.projectId) query.projectId = req.query.projectId;
    if (req.query.status) query.status = req.query.status;
    if (req.query.priority) query.priority = req.query.priority;

    const tasks = await Task.find(query)
      .populate('assigneeId', 'name email')
      .populate('createdBy', 'name email')
      .populate('projectId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, assigneeId, dueDate, projectId } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, assigneeId, dueDate, projectId },
      { new: true, runValidators: true }
    )
      .populate('assigneeId', 'name email')
      .populate('createdBy', 'name email')
      .populate('projectId', 'name');

    if (!task) {
      return res.status(404).json({
        status: 'fail',
        message: 'Task not found',
      });
    }

    res.status(200).json({
      status: 'success',
      task,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        status: 'fail',
        message: 'Task not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
