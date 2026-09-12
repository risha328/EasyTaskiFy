import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide an organization name'],
      trim: true,
      maxlength: [100, 'Organization name cannot exceed 100 characters'],
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedAdminEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

const Organization = mongoose.model('Organization', organizationSchema);
export default Organization;
