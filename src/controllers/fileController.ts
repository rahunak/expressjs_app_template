import { Response, NextFunction } from 'express';
import fileService from '../services/fileService';
import { AuthRequest } from '../types';
import { getAuthenticatedUserId } from '../utils/authHelpers';

class FileController {
  async upload(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
        return;
      }

      const file = await fileService.uploadFile(req.file, getAuthenticatedUserId(req));

      res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          id: file.id,
          name: file.name,
          extension: file.extension,
          mimeType: file.mimeType,
          size: file.size,
          uploadedAt: file.createdAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async list(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const list_size = parseInt(req.query.list_size as string) || 10;

      const result = await fileService.getFileList(page, list_size, getAuthenticatedUserId(req));

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      const file = await fileService.getFileById(id, getAuthenticatedUserId(req));

      res.status(200).json({
        success: true,
        data: file
      });
    } catch (error) {
      next(error);
    }
  }

  async download(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      const fileData = await fileService.downloadFile(id, getAuthenticatedUserId(req));

      res.download(fileData.path, fileData.name);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      await fileService.deleteFile(id, getAuthenticatedUserId(req));

      res.status(200).json({
        success: true,
        message: 'File deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
        return;
      }

      const file = await fileService.updateFile(id, req.file, getAuthenticatedUserId(req));

      res.status(200).json({
        success: true,
        message: 'File updated successfully',
        data: {
          id: file.id,
          name: file.name,
          extension: file.extension,
          mimeType: file.mimeType,
          size: file.size,
          updatedAt: file.updatedAt
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new FileController();
