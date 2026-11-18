import { Router } from 'express';
import DocumentController from '../controllers/document.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import upload from '../config/multer.js';
import checkApplicationDeadline from '../middleware/deadline.middleware.js';

const router = Router();

// Protect all document endpoints
router.use(protect);

// Nested under applications/:id/documents or standalone /documents/:docId
router.post('/applications/:id/documents', checkApplicationDeadline, upload.single('file'), DocumentController.uploadDocument);
router.get('/applications/:id/documents', DocumentController.getApplicationDocuments);
router.get('/documents/:docId', DocumentController.getDocumentById);
router.delete('/documents/:docId', checkApplicationDeadline, DocumentController.deleteDocument);

export default router;
