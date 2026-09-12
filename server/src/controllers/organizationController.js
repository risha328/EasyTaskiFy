import Organization from '../models/Organization.js';
import OrganizationMember from '../models/OrganizationMember.js';
import User from '../models/User.js';

export const createOrganization = async (req, res, next) => {
  try {
    const { name, adminEmail } = req.body;

    if (!name) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide an organization name',
      });
    }

    // Restrict workspace creation strictly to SUPER_ADMIN role
    const canCreateWorkspace = req.user.role === 'SUPER_ADMIN';

    if (!canCreateWorkspace) {
      return res.status(403).json({
        status: 'fail',
        message: 'Forbidden. Only Superadmin can create a new workspace.',
      });
    }

    let ownerId = req.user._id;
    let assignedUser = null;
    const cleanAdminEmail = adminEmail ? adminEmail.toLowerCase().trim() : null;

    if (cleanAdminEmail) {
      assignedUser = await User.findOne({ email: cleanAdminEmail });
      if (assignedUser) {
        ownerId = assignedUser._id;
        // Elevate user system role to ADMIN if currently MEMBER/MANAGER
        if (assignedUser.role !== 'SUPER_ADMIN' && assignedUser.role !== 'ADMIN') {
          assignedUser.role = 'ADMIN';
          await assignedUser.save();
        }
      }
    }

    const org = await Organization.create({
      name,
      ownerId,
      assignedAdminEmail: cleanAdminEmail,
    });

    // Add assigned user as ADMIN member if user exists
    if (assignedUser) {
      await OrganizationMember.create({
        organizationId: org._id,
        userId: assignedUser._id,
        role: 'ADMIN',
      });
    }

    // Always insert creator (SUPER_ADMIN or ADMIN) as ADMIN member if different
    if (!assignedUser || assignedUser._id.toString() !== req.user._id.toString()) {
      await OrganizationMember.create({
        organizationId: org._id,
        userId: req.user._id,
        role: 'ADMIN',
      });
    }

    res.status(201).json({
      status: 'success',
      organization: {
        id: org._id,
        name: org.name,
        ownerId: org.ownerId,
        assignedAdminEmail: org.assignedAdminEmail,
        role: 'ADMIN',
        createdAt: org.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrganizations = async (req, res, next) => {
  try {
    let organizations;

    if (req.user.role === 'SUPER_ADMIN') {
      const allOrgs = await Organization.find().sort({ createdAt: -1 });
      organizations = allOrgs.map((org) => ({
        id: org._id,
        name: org.name,
        ownerId: org.ownerId,
        assignedAdminEmail: org.assignedAdminEmail,
        role: 'ADMIN',
        createdAt: org.createdAt,
      }));
    } else {
      const memberships = await OrganizationMember.find({ userId: req.user._id })
        .populate('organizationId', 'name ownerId assignedAdminEmail createdAt')
        .sort({ createdAt: -1 });

      organizations = memberships
        .filter((m) => m.organizationId != null)
        .map((m) => ({
          id: m.organizationId._id,
          name: m.organizationId.name,
          ownerId: m.organizationId.ownerId,
          assignedAdminEmail: m.organizationId.assignedAdminEmail,
          role: m.role,
          createdAt: m.organizationId.createdAt,
        }));
    }

    res.status(200).json({
      status: 'success',
      results: organizations.length,
      organizations,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationById = async (req, res, next) => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org) {
      return res.status(404).json({
        status: 'fail',
        message: 'Organization not found',
      });
    }

    const membership = await OrganizationMember.findOne({
      organizationId: org._id,
      userId: req.user._id,
    });

    res.status(200).json({
      status: 'success',
      organization: {
        id: org._id,
        name: org.name,
        ownerId: org.ownerId,
        role: membership ? membership.role : null,
        createdAt: org.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationMembers = async (req, res, next) => {
  try {
    const members = await OrganizationMember.find({ organizationId: req.params.id })
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 });

    const formattedMembers = members.map((m) => ({
      id: m._id,
      userId: m.userId._id,
      name: m.userId.name,
      email: m.userId.email,
      role: m.role,
      joinedAt: m.createdAt,
    }));

    res.status(200).json({
      status: 'success',
      results: formattedMembers.length,
      members: formattedMembers,
    });
  } catch (error) {
    next(error);
  }
};

export const addOrganizationMember = async (req, res, next) => {
  try {
    const { email, role = 'MEMBER' } = req.body;
    const orgId = req.params.id;

    if (!email) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide user email to invite',
      });
    }

    const targetUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (!targetUser) {
      return res.status(404).json({
        status: 'fail',
        message: `User with email '${email}' is not registered on TaskFlow. Please ask them to sign up first.`,
      });
    }

    const existingMember = await OrganizationMember.findOne({
      organizationId: orgId,
      userId: targetUser._id,
    });

    if (existingMember) {
      return res.status(400).json({
        status: 'fail',
        message: 'User is already a member of this organization',
      });
    }

    const requestedRole = role.toUpperCase();

    // Elevate target user system role if added with ADMIN role
    if (requestedRole === 'ADMIN' && targetUser.role !== 'SUPER_ADMIN' && targetUser.role !== 'ADMIN') {
      targetUser.role = 'ADMIN';
      await targetUser.save();
    }

    const newMember = await OrganizationMember.create({
      organizationId: orgId,
      userId: targetUser._id,
      role: requestedRole,
    });

    res.status(201).json({
      status: 'success',
      member: {
        id: newMember._id,
        userId: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: newMember.role,
        joinedAt: newMember.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const removeOrganizationMember = async (req, res, next) => {
  try {
    const { id: orgId, userId } = req.params;

    const org = await Organization.findById(orgId);
    if (org.ownerId.toString() === userId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Cannot remove organization owner',
      });
    }

    const membership = await OrganizationMember.findOneAndDelete({
      organizationId: orgId,
      userId: userId,
    });

    if (!membership) {
      return res.status(404).json({
        status: 'fail',
        message: 'Member not found in this organization',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Member removed from organization',
    });
  } catch (error) {
    next(error);
  }
};
