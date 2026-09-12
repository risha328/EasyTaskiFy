import OrganizationMember from '../models/OrganizationMember.js';

// Jira-Style Organization Scope Permission Guard
export const requireOrgRole = (allowedRoles = ['ADMIN', 'MANAGER', 'MEMBER']) => {
  return async (req, res, next) => {
    try {
      // Global SUPER_ADMIN has unrestricted permission across all workspaces
      if (req.user && req.user.role === 'SUPER_ADMIN') {
        req.orgMember = { role: 'ADMIN' };
        return next();
      }

      const orgId =
        req.params.id ||
        req.params.orgId ||
        req.body.organizationId ||
        req.headers['x-organization-id'];

      if (!orgId) {
        return res.status(400).json({
          status: 'fail',
          message: 'Organization ID is required for access verification',
        });
      }

      const membership = await OrganizationMember.findOne({
        organizationId: orgId,
        userId: req.user._id,
      });

      if (!membership) {
        return res.status(403).json({
          status: 'fail',
          message: 'Access denied. You are not a member of this workspace.',
        });
      }

      if (!allowedRoles.includes(membership.role)) {
        return res.status(403).json({
          status: 'fail',
          message: `Forbidden. Action requires Jira role level: ${allowedRoles.join(' or ')}`,
        });
      }

      req.orgMember = membership;
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Jira-Style Project Scope Permission Guard (used in Phase 4 & 5)
export const requireProjectRole = (allowedRoles = ['ADMIN', 'MANAGER', 'MEMBER']) => {
  return async (req, res, next) => {
    try {
      // Global SUPER_ADMIN has unrestricted permission across all projects
      if (req.user && req.user.role === 'SUPER_ADMIN') {
        req.projectRole = 'ADMIN';
        return next();
      }

      const orgId = req.headers['x-organization-id'] || req.body.organizationId;

      if (!orgId) {
        return res.status(400).json({
          status: 'fail',
          message: 'Organization context is required for project access',
        });
      }

      const membership = await OrganizationMember.findOne({
        organizationId: orgId,
        userId: req.user._id,
      });

      if (!membership) {
        return res.status(403).json({
          status: 'fail',
          message: 'Forbidden. You do not belong to the project workspace.',
        });
      }

      if (!allowedRoles.includes(membership.role)) {
        return res.status(403).json({
          status: 'fail',
          message: `Forbidden. Requires ${allowedRoles.join(' or ')} permissions for this project operation.`,
        });
      }

      req.projectRole = membership.role;
      next();
    } catch (error) {
      next(error);
    }
  };
};
