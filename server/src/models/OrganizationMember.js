import mongoose from 'mongoose';

const organizationMemberSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['ADMIN', 'MANAGER', 'MEMBER'],
      default: 'MEMBER',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only be added to an organization once
organizationMemberSchema.index({ organizationId: 1, userId: 1 }, { unique: true });

const OrganizationMember = mongoose.model('OrganizationMember', organizationMemberSchema);
export default OrganizationMember;
