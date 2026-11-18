import fs from 'fs';
import path from 'path';
import { SQLDocument, MongoDocument } from '../models/document.model.js';
import Application from '../models/application.model.js';
import Applicant from '../models/applicant.model.js';
import { getMongoStatus } from '../config/mongo.js';
import AppError from '../utils/AppError.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { ROLES } from '../constants/roles.js';

export class DocumentService {
  /**
   * Save uploaded document
   */
  static async uploadDocument(appIdOrId, file, documentType, user) {
    if (!file) {
      throw new AppError('No document file uploaded.', 400, ERROR_CODES.FILE_UPLOAD_ERROR);
    }

    const isNumeric = !isNaN(appIdOrId);
    const whereClause = isNumeric ? { id: parseInt(appIdOrId, 10) } : { application_id: appIdOrId };

    const application = await Application.findOne({ where: whereClause });
    if (!application) {
      // Clean up orphaned file on disk
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      throw new AppError('Target application not found.', 404, ERROR_CODES.NOT_FOUND);
    }

    // Ownership check
    if (user.role !== ROLES.ADMIN) {
      const applicant = await Applicant.findOne({ where: { user_id: user.id } });
      if (!applicant || application.applicant_id !== applicant.id) {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        throw new AppError('Access denied. You can only upload documents for your own application.', 403, ERROR_CODES.UNAUTHORIZED);
      }
    }

    // Delete existing document of this type for this application if any
    const existingDoc = await SQLDocument.findOne({
      where: {
        application_id: application.application_id,
        document_type: documentType,
      },
    });

    if (existingDoc) {
      if (fs.existsSync(existingDoc.storage_path)) {
        try { fs.unlinkSync(existingDoc.storage_path); } catch (e) { /* ignore */ }
      }
      await existingDoc.destroy();
    }

    // Create SQL Record
    const sqlDoc = await SQLDocument.create({
      application_id: application.application_id,
      applicant_id: application.applicant_id,
      document_type: documentType,
      original_name: file.originalname,
      mime_type: file.mimetype,
      size: file.size,
      storage_path: file.path,
    });

    // Save in Mongo if connected
    if (getMongoStatus()) {
      try {
        await MongoDocument.create({
          applicationId: application.application_id,
          applicantId: application.applicant_id,
          documentType,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          storagePath: file.path,
        });
      } catch (err) {
        console.warn('[Mongo] Error persisting to MongoDB:', err.message);
      }
    }

    return sqlDoc;
  }

  /**
   * Get all documents for an application
   */
  static async getDocumentsByApplication(appIdOrId, user) {
    const isNumeric = !isNaN(appIdOrId);
    const whereClause = isNumeric ? { id: parseInt(appIdOrId, 10) } : { application_id: appIdOrId };

    const application = await Application.findOne({ where: whereClause });
    if (!application) {
      throw new AppError('Application not found.', 404, ERROR_CODES.NOT_FOUND);
    }

    // Check ownership
    if (user.role !== ROLES.ADMIN) {
      const applicant = await Applicant.findOne({ where: { user_id: user.id } });
      if (!applicant || application.applicant_id !== applicant.id) {
        throw new AppError('Access denied.', 403, ERROR_CODES.UNAUTHORIZED);
      }
    }

    return SQLDocument.findAll({
      where: { application_id: application.application_id },
      order: [['uploaded_at', 'DESC']],
    });
  }

  /**
   * Get single document file path for download/preview
   */
  static async getDocumentById(docId, user) {
    const doc = await SQLDocument.findByPk(docId);
    if (!doc) {
      throw new AppError('Document not found.', 404, ERROR_CODES.NOT_FOUND);
    }

    if (user.role !== ROLES.ADMIN) {
      const applicant = await Applicant.findOne({ where: { user_id: user.id } });
      if (!applicant || doc.applicant_id !== applicant.id) {
        throw new AppError('Access denied. You cannot view other applicants documents.', 403, ERROR_CODES.UNAUTHORIZED);
      }
    }

    if (!fs.existsSync(doc.storage_path)) {
      throw new AppError('Physical document file is missing on server storage.', 404, ERROR_CODES.NOT_FOUND);
    }

    return doc;
  }

  /**
   * Delete a document
   */
  static async deleteDocument(docId, user) {
    const doc = await SQLDocument.findByPk(docId);
    if (!doc) {
      throw new AppError('Document not found.', 404, ERROR_CODES.NOT_FOUND);
    }

    if (user.role !== ROLES.ADMIN) {
      const applicant = await Applicant.findOne({ where: { user_id: user.id } });
      if (!applicant || doc.applicant_id !== applicant.id) {
        throw new AppError('Access denied.', 403, ERROR_CODES.UNAUTHORIZED);
      }
    }

    if (fs.existsSync(doc.storage_path)) {
      try {
        fs.unlinkSync(doc.storage_path);
      } catch (e) {
        console.warn('Failed to delete file from disk:', e.message);
      }
    }

    if (getMongoStatus()) {
      try {
        await MongoDocument.deleteOne({ applicationId: doc.application_id, documentType: doc.document_type });
      } catch (e) { /* ignore */ }
    }

    await doc.destroy();
    return true;
  }
}

export default DocumentService;
