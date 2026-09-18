import express from 'express';
import { getSuperadminAnalytics } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Require SUPER_ADMIN role for global superadmin analytics
router.get('/superadmin', (req, res, next) => {
  if (req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({
      status: 'fail',
      message: 'Forbidden. Only Superadmin can access global platform analytics.',
    });
  }
  getSuperadminAnalytics(req, res, next);
});

export default router;
