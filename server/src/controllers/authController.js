import User from '../models/User.js';
import Organization from '../models/Organization.js';
import OrganizationMember from '../models/OrganizationMember.js';
import PendingInvite from '../models/PendingInvite.js';

// Helper to sanitize user output
const formatUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide name, email, and password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: 'fail',
        message: 'Password must be at least 6 characters long',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'A user with this email address already exists',
      });
    }

    const isFirstUser = (await User.countDocuments({})) === 0;
    const isSuperAdminEmail = cleanEmail.startsWith('superadmin@');

    // Check if user was assigned as Admin for any workspace by Superadmin
    const pendingOrgAssignments = await Organization.find({ assignedAdminEmail: cleanEmail });
    const pendingInvites = await PendingInvite.find({ email: cleanEmail });

    let systemRole = isFirstUser || isSuperAdminEmail ? 'SUPER_ADMIN' : 'MEMBER';

    if (systemRole !== 'SUPER_ADMIN') {
      if (pendingOrgAssignments.length > 0 || pendingInvites.some((inv) => inv.role === 'ADMIN') || cleanEmail.startsWith('admin@')) {
        systemRole = 'ADMIN';
      } else if (pendingInvites.some((inv) => inv.role === 'MANAGER') || cleanEmail.startsWith('manager@')) {
        systemRole = 'MANAGER';
      } else if (pendingInvites.some((inv) => inv.role === 'MEMBER')) {
        systemRole = 'MEMBER';
      }
    }

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      passwordHash: password,
      role: systemRole,
    });

    // Auto-claim and link user as ADMIN for assigned workspaces
    for (const org of pendingOrgAssignments) {
      const existingMember = await OrganizationMember.findOne({
        organizationId: org._id,
        userId: user._id,
      });

      if (!existingMember) {
        await OrganizationMember.create({
          organizationId: org._id,
          userId: user._id,
          role: 'ADMIN',
        });
      }

      org.ownerId = user._id;
      await org.save();
    }

    // Auto-claim and link user for all pending workspace invites
    for (const inv of pendingInvites) {
      const existingMember = await OrganizationMember.findOne({
        organizationId: inv.organizationId,
        userId: user._id,
      });

      if (!existingMember) {
        await OrganizationMember.create({
          organizationId: inv.organizationId,
          userId: user._id,
          role: inv.role,
        });
      }

      await PendingInvite.deleteOne({ _id: inv._id });
    }

    const token = user.generateJWT();

    res.status(201).json({
      status: 'success',
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide both email and password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password',
      });
    }

    // Correct role if non-superadmin email was incorrectly marked as SUPER_ADMIN
    if (user.role === 'SUPER_ADMIN' && !user.email.startsWith('superadmin@')) {
      const firstUser = await User.findOne().sort({ createdAt: 1 });
      if (firstUser && firstUser._id.toString() !== user._id.toString()) {
        user.role = user.email.startsWith('manager@') ? 'MANAGER' : 'ADMIN';
        await user.save();
      }
    }

    // Sync system role with highest OrganizationMember role if not SUPER_ADMIN
    if (user.role !== 'SUPER_ADMIN') {
      const memberships = await OrganizationMember.find({ userId: user._id });
      if (memberships.length > 0) {
        const hasAdmin = memberships.some((m) => m.role === 'ADMIN');
        const hasManager = memberships.some((m) => m.role === 'MANAGER');

        let highestOrgRole = 'MEMBER';
        if (hasAdmin) highestOrgRole = 'ADMIN';
        else if (hasManager) highestOrgRole = 'MANAGER';

        if (user.role !== highestOrgRole) {
          user.role = highestOrgRole;
          await user.save();
        }
      }
    }

    const token = user.generateJWT();

    res.status(200).json({
      status: 'success',
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'User logged out successfully',
  });
};

export const getMe = async (req, res) => {
  if (req.user) {
    // Correct role if non-superadmin email was incorrectly marked as SUPER_ADMIN
    if (req.user.role === 'SUPER_ADMIN' && !req.user.email.startsWith('superadmin@')) {
      const firstUser = await User.findOne().sort({ createdAt: 1 });
      if (firstUser && firstUser._id.toString() !== req.user._id.toString()) {
        req.user.role = req.user.email.startsWith('manager@') ? 'MANAGER' : 'ADMIN';
        await req.user.save();
      }
    }

    // Sync system role with highest OrganizationMember role if not SUPER_ADMIN
    if (req.user.role !== 'SUPER_ADMIN') {
      const memberships = await OrganizationMember.find({ userId: req.user._id });
      if (memberships.length > 0) {
        const hasAdmin = memberships.some((m) => m.role === 'ADMIN');
        const hasManager = memberships.some((m) => m.role === 'MANAGER');

        let highestOrgRole = 'MEMBER';
        if (hasAdmin) highestOrgRole = 'ADMIN';
        else if (hasManager) highestOrgRole = 'MANAGER';

        if (req.user.role !== highestOrgRole) {
          req.user.role = highestOrgRole;
          await req.user.save();
        }
      }
    }
  }

  res.status(200).json({
    status: 'success',
    user: formatUserResponse(req.user),
  });
};
