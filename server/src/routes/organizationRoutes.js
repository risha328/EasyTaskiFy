import express from 'express';
import {
  createOrganization,
  getMyOrganizations,
  getOrganizationById,
  getOrganizationMembers,
  addOrganizationMember,
  removeOrganizationMember,
} from '../controllers/organizationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireOrgRole } from '../middleware/checkRole.js';

const router = express.Router();

// Apply auth protection to all org routes
router.use(protect);

router.post('/', createOrganization);
router.get('/my', getMyOrganizations);
router.get('/:id', requireOrgRole(['ADMIN', 'MANAGER', 'MEMBER']), getOrganizationById);
router.get('/:id/members', requireOrgRole(['ADMIN', 'MANAGER', 'MEMBER']), getOrganizationMembers);
router.post('/:id/members', requireOrgRole(['ADMIN', 'MANAGER']), addOrganizationMember);
router.delete('/:id/members/:userId', requireOrgRole(['ADMIN']), removeOrganizationMember);

export default router;
