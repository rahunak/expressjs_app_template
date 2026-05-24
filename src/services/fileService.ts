import { AppDataSource } from '../config/database';
import { File } from '../entities';
import fs from 'fs/promises';
import path from 'path';
import { FileAttributes, PaginationResult } from '../types';
import { NotFoundError } from '../utils/errors';
import { ErrorMessage } from '../constants/errorMessages';

interface FileData {
  originalname: string;
  mimetype: string;
  size: number;
  path: string;
}

class FileService {
  private fileRepository = AppDataSource.getRepository(File);

  async uploadFile(fileData: FileData, userId: number): Promise<File> {
    const file = this.fileRepository.create({
      name: fileData.originalname,
      extension: path.extname(fileData.originalname),
      mimeType: fileData.mimetype,
      size: fileData.size,
      path: fileData.path,
      userId
    });

    await this.fileRepository.save(file);
    return file;
  }

  async getFileList(page: number = 1, listSize: number = 10, userId: number): Promise<PaginationResult<FileAttributes>> {
    const limit = parseInt(String(listSize));
    const offset = (parseInt(String(page)) - 1) * limit;

    const [files, count] = await this.fileRepository.findAndCount({
      where: { userId },
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
      select: {
        id: true,
        name: true,
        extension: true,
        mimeType: true,
        size: true,
        createdAt: true
      }
    });

    return {
      files: files as FileAttributes[],
      pagination: {
        total: count,
        page: parseInt(String(page)),
        pageSize: limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  async getFileById(fileId: number, userId: number): Promise<FileAttributes> {
    const file = await this.fileRepository.findOne({
      where: { id: fileId, userId },
      select: {
        id: true,
        name: true,
        extension: true,
        mimeType: true,
        size: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!file) {
      throw new NotFoundError(ErrorMessage.FILE_NOT_FOUND);
    }

    return file as FileAttributes;
  }

  async downloadFile(fileId: number, userId: number): Promise<{ path: string; name: string }> {
    const file = await this.fileRepository.findOne({
      where: { id: fileId, userId }
    });

    if (!file) {
      throw new NotFoundError(ErrorMessage.FILE_NOT_FOUND);
    }

    try {
      await fs.access(file.path);
    } catch (err) {
      throw new NotFoundError(ErrorMessage.FILE_NOT_FOUND_ON_DISK);
    }

    return {
      path: file.path,
      name: file.name
    };
  }

  async deleteFile(fileId: number, userId: number): Promise<{ message: string }> {
    const file = await this.fileRepository.findOne({
      where: { id: fileId, userId }
    });

    if (!file) {
      throw new NotFoundError(ErrorMessage.FILE_NOT_FOUND);
    }

    try {
      await fs.unlink(file.path);
    } catch (err) {
      console.error('Error deleting file from disk:', err);
    }

    await this.fileRepository.remove(file);

    return { message: 'File deleted successfully' };
  }

  async updateFile(fileId: number, newFileData: FileData, userId: number): Promise<File> {
    const file = await this.fileRepository.findOne({
      where: { id: fileId, userId }
    });

    if (!file) {
      throw new NotFoundError(ErrorMessage.FILE_NOT_FOUND);
    }

    const oldPath = file.path;

    file.name = newFileData.originalname;
    file.extension = path.extname(newFileData.originalname);
    file.mimeType = newFileData.mimetype;
    file.size = newFileData.size;
    file.path = newFileData.path;

    await this.fileRepository.save(file);

    try {
      await fs.unlink(oldPath);
    } catch (err) {
      console.error('Error deleting old file from disk:', err);
    }

    return file;
  }
}

export default new FileService();
