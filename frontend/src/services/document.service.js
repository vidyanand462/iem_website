import api from './api';

export const documentService = {
  async uploadDocument(applicationId, formData) {
    return api.post(`/documents/applications/${applicationId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async getDocuments(applicationId) {
    return api.get(`/documents/applications/${applicationId}/documents`);
  },

  getDocumentUrl(docId) {
    return `${api.defaults.baseURL}/documents/documents/${docId}`;
  },

  async deleteDocument(docId) {
    return api.delete(`/documents/documents/${docId}`);
  },
};

export default documentService;
