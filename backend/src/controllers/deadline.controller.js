import DeadlineService from '../services/deadline.service.js';
import { sendSuccess } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

export class DeadlineController {
  static getDeadline = asyncHandler(async (req, res) => {
    const deadline = await DeadlineService.getActiveDeadline();
    return sendSuccess(res, deadline, 'Active deadline retrieved.');
  });

  static updateDeadline = asyncHandler(async (req, res) => {
    const result = await DeadlineService.updateDeadline(req.body);
    return sendSuccess(res, result, 'Application deadline updated successfully.');
  });
}

export default DeadlineController;
