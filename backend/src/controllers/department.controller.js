import DepartmentService from '../services/department.service.js';
import { sendSuccess } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

export class DepartmentController {
  static getDepartments = asyncHandler(async (req, res) => {
    const departments = await DepartmentService.getAllDepartments();
    return sendSuccess(res, departments, 'Departments retrieved successfully.');
  });

  static updateSeats = asyncHandler(async (req, res) => {
    const { total_seats, occupied_seats } = req.body;
    const result = await DepartmentService.updateSeats(req.params.id, { total_seats, occupied_seats });
    return sendSuccess(res, result, 'Department seat allocation updated.');
  });
}

export default DepartmentController;
