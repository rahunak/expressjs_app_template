import express from 'express';
import fileController from '../controllers/fileController';
import authMiddleware from '../middleware/auth';
import upload from '../middleware/upload';

const router = express.Router();

router.post('/upload', authMiddleware, upload.single('file'), fileController.upload);
router.get('/list', authMiddleware, fileController.list);
router.get('/:id', authMiddleware, fileController.getById);
router.get('/download/:id', authMiddleware, fileController.download);
router.delete('/delete/:id', authMiddleware, fileController.delete);
router.put('/update/:id', authMiddleware, upload.single('file'), fileController.update);

export default router;
