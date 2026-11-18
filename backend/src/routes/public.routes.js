import { Router } from 'express';
import PublicController from '../controllers/public.controller.js';

const router = Router();

router.get('/programs', PublicController.getPrograms);
router.get('/stats', PublicController.getStats);
router.get('/news', PublicController.getNews);

export default router;
