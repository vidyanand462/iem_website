import ApplicationService from '../services/application.service.js';
import { sendSuccess } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

export class ApplicationController {
  static createApplication = asyncHandler(async (req, res) => {
    const { department_id } = req.body;
    const application = await ApplicationService.createApplication(req.user.id, department_id);
    return sendSuccess(res, application, 'Application created successfully.', 201);
  });

  static getMyApplications = asyncHandler(async (req, res) => {
    const applications = await ApplicationService.getMyApplications(req.user.id);
    return sendSuccess(res, applications, 'Applications fetched successfully.');
  });

  static getApplicationById = asyncHandler(async (req, res) => {
    const application = await ApplicationService.getApplicationById(req.params.id, req.user);
    return sendSuccess(res, application, 'Application details retrieved.');
  });

  static updatePersonalInfo = asyncHandler(async (req, res) => {
    const result = await ApplicationService.updatePersonalInfo(req.params.id, req.user.id, req.body);
    return sendSuccess(res, result, 'Personal information updated successfully.');
  });

  static updateContactInfo = asyncHandler(async (req, res) => {
    const result = await ApplicationService.updateContactInfo(req.params.id, req.user.id, req.body);
    return sendSuccess(res, result, 'Contact information updated successfully.');
  });

  static updateGuardianInfo = asyncHandler(async (req, res) => {
    const result = await ApplicationService.updateGuardianInfo(req.params.id, req.user.id, req.body);
    return sendSuccess(res, result, 'Guardian information updated successfully.');
  });

  static updateAcademicInfo = asyncHandler(async (req, res) => {
    const result = await ApplicationService.updateAcademicInfo(req.params.id, req.user.id, req.body);
    return sendSuccess(res, result, 'Academic information updated successfully.');
  });

  static submitApplication = asyncHandler(async (req, res) => {
    const result = await ApplicationService.submitApplication(req.params.id, req.user.id);
    return sendSuccess(res, result, 'Application submitted successfully for institutional review.');
  });

  static getApplicationStatus = asyncHandler(async (req, res) => {
    const status = await ApplicationService.getApplicationStatus(req.params.id, req.user);
    return sendSuccess(res, status, 'Application status retrieved.');
  });

  static getApplicationAcknowledgement = asyncHandler(async (req, res) => {
    const ack = await ApplicationService.getApplicationAcknowledgement(req.params.id, req.user);
    return sendSuccess(res, ack, 'Application acknowledgement retrieved.');
  });
}

export default ApplicationController;
