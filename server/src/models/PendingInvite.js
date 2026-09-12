import mongoose from 'mongoose';

const pendingInviteSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'MEMBER'],
      default: 'MEMBER',
      required: true,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

pendingInviteSchema.index({ organizationId: 1, email: 1 }, { unique: true });

const PendingInvite = mongoose.model('PendingInvite', pendingInviteSchema);
export default PendingInvite;
