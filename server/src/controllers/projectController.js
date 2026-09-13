import Project from '../models/Project.js';
import Task from '../models/Task.js';
import OrganizationMember from '../models/OrganizationMember.js';

export const createProject = async (req, res, next) => {
  try {
    const { name, description, organizationId, status, managerId, members } = req.body;

    if (!name || !organizationId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Project name and organization ID are required',
      });
    }

    const project = await Project.create({
      name: name.trim(),
      description: description ? description.trim() : '',
      organizationId,
      ownerId: req.user._id,
      managerId: managerId || null,
      members: Array.isArray(members) ? members : [],
      status: status || 'ACTIVE',
    });

    const populatedProject = await Project.findById(project._id)
      .populate('ownerId', 'name email')
      .populate('managerId', 'name email')
      .populate('members', 'name email');

    res.status(201).json({
      status: 'success',
      project: populatedProject,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const orgId = req.query.organizationId || req.headers['x-organization-id'];

    if (!orgId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Organization ID is required',
      });
    }

    // Determine user role within this organization
    const orgMember = await OrganizationMember.findOne({
      organizationId: orgId,
      userId: req.user._id,
    });

    const effectiveRole = orgMember?.role || req.user.role || 'MEMBER';
    const userId = req.user._id;

    let query = { organizationId: orgId };

    // Role-based Project Filtering:
    // ADMIN / SUPER_ADMIN -> Can see ALL projects in the workspace
    // MANAGER -> Can see projects where they are assigned as managerId, listed in members, or ownerId
    // MEMBER -> Can see projects where they are listed in members, managerId, or ownerId
    if (effectiveRole === 'MANAGER' || effectiveRole === 'MEMBER' || effectiveRole === 'USER') {
      query.$or = [
        { managerId: userId },
        { members: userId },
        { ownerId: userId },
      ];
    }

    const projects = await Project.find(query)
      .populate('ownerId', 'name email')
      .populate('managerId', 'name email')
      .populate('members', 'name email')
      .sort({ createdAt: -1 });

    // Populate tasks count for each project
    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const totalTasks = await Task.countDocuments({ projectId: project._id });
        const completedTasks = await Task.countDocuments({ projectId: project._id, status: 'DONE' });
        return {
          ...project.toObject(),
          totalTasks,
          completedTasks,
        };
      })
    );

    res.status(200).json({
      status: 'success',
      results: projectsWithCounts.length,
      projects: projectsWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { name, description, status, managerId, members } = req.body;

    const updateFields = {};
    if (name !== undefined) updateFields.name = name.trim();
    if (description !== undefined) updateFields.description = description.trim();
    if (status !== undefined) updateFields.status = status;
    if (managerId !== undefined) updateFields.managerId = managerId || null;
    if (members !== undefined) updateFields.members = Array.isArray(members) ? members : [];

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    )
      .populate('ownerId', 'name email')
      .populate('managerId', 'name email')
      .populate('members', 'name email');

    if (!project) {
      return res.status(404).json({
        status: 'fail',
        message: 'Project not found',
      });
    }

    res.status(200).json({
      status: 'success',
      project,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        status: 'fail',
        message: 'Project not found',
      });
    }

    await Task.deleteMany({ projectId: req.params.id });

    res.status(200).json({
      status: 'success',
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
