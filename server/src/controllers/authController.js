import User from '../models/User.js';
import Organization from '../models/Organization.js';
import OrganizationMember from '../models/OrganizationMember.js';

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
    const isSuperAdminEmail =
      cleanEmail.startsWith('admin@') ||
      cleanEmail.startsWith('superadmin@');

    // Check if user was assigned as Admin for any workspace by Superadmin
    const pendingOrgAssignments = await Organization.find({ assignedAdminEmail: cleanEmail });

    let systemRole = isFirstUser || isSuperAdminEmail ? 'SUPER_ADMIN' : 'MEMBER';
    if (pendingOrgAssignments.length > 0 && systemRole !== 'SUPER_ADMIN') {
      systemRole = 'ADMIN';
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
  res.status(200).json({
    status: 'success',
    user: formatUserResponse(req.user),
  });
};
