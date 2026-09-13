import express from 'express';
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createProject)
  .get(getProjects);

router.route('/:id')
  .patch(updateProject)
  .delete(deleteProject);

export default router;
