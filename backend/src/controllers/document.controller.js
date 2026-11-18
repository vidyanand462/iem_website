import path from 'path';
import DocumentService from '../services/document.service.js';
import { sendSuccess } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

export class DocumentController {
  static uploadDocument = asyncHandler(async (req, res) => {
    const { documentType } = req.body;
    const document = await DocumentService.uploadDocument(
      req.params.id,
      req.file,
      documentType || 'other',
      req.user
    );
    return sendSuccess(res, document, 'Document uploaded successfully.', 201);
  });

  static getApplicationDocuments = asyncHandler(async (req, res) => {
    const documents = await DocumentService.getDocumentsByApplication(req.params.id, req.user);
    return sendSuccess(res, documents, 'Documents fetched successfully.');
  });

  static getDocumentById = asyncHandler(async (req, res) => {
    const document = await DocumentService.getDocumentById(req.params.docId, req.user);
    return res.sendFile(path.resolve(document.storage_path));
  });

  static deleteDocument = asyncHandler(async (req, res) => {
    await DocumentService.deleteDocument(req.params.docId, req.user);
    return sendSuccess(res, null, 'Document deleted successfully.');
  });
}

export default DocumentController;
