import AdminService from '../services/admin.service.js';
import ApplicationService from '../services/application.service.js';
import { sendSuccess } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

export class AdminController {
  static getDashboard = asyncHandler(async (req, res) => {
    const data = await AdminService.getDashboardMetrics();
    return sendSuccess(res, data, 'Admin dashboard metrics retrieved.');
  });

  static getApplications = asyncHandler(async (req, res) => {
    const result = await AdminService.getApplications(req.query);
    return sendSuccess(res, result, 'Applications list retrieved.');
  });

  static getApplicationById = asyncHandler(async (req, res) => {
    const application = await ApplicationService.getApplicationById(req.params.id, req.user);
    return sendSuccess(res, application, 'Application details retrieved for review.');
  });

  static markUnderReview = asyncHandler(async (req, res) => {
    const application = await AdminService.markUnderReview(req.params.id, req.user.id);
    return sendSuccess(res, application, 'Application marked as under review.');
  });

  static acceptApplication = asyncHandler(async (req, res) => {
    const { notes } = req.body;
    const application = await AdminService.acceptApplication(req.params.id, req.user.id, notes);
    return sendSuccess(res, application, 'Application accepted and seat allocated successfully.');
  });

  static rejectApplication = asyncHandler(async (req, res) => {
    const { reason, notes } = req.body;
    const application = await AdminService.rejectApplication(req.params.id, req.user.id, reason, notes);
    return sendSuccess(res, application, 'Application rejected and decision recorded.');
  });

  static flagApplication = asyncHandler(async (req, res) => {
    const { reason, notes } = req.body;
    const application = await AdminService.flagApplication(req.params.id, req.user.id, reason, notes);
    return sendSuccess(res, application, 'Application flagged for candidate correction and form unlocked.');
  });

  static getApplicants = asyncHandler(async (req, res) => {
    const result = await AdminService.getApplicantsList(req.query);
    return sendSuccess(res, result, 'Registered applicants list retrieved.');
  });

  static getReports = asyncHandler(async (req, res) => {
    const report = await AdminService.getReports();
    return sendSuccess(res, report, 'Admissions report generated.');
  });
}

export default AdminController;
