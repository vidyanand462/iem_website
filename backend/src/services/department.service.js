import Department from '../models/department.model.js';
import SeatAllocation from '../models/seatAllocation.model.js';
import AppError from '../utils/AppError.js';
import { ERROR_CODES } from '../constants/errorCodes.js';

export class DepartmentService {
  /**
   * Get all active departments with seat allocations
   */
  static async getAllDepartments() {
    return Department.findAll({
      where: { is_active: true },
      include: [{ model: SeatAllocation, as: 'seatAllocation' }],
      order: [['id', 'ASC']],
    });
  }

  /**
   * Update department seat allocation (Admin only)
   */
  static async updateSeats(departmentId, { total_seats, occupied_seats }) {
    const dept = await Department.findByPk(departmentId, {
      include: [{ model: SeatAllocation, as: 'seatAllocation' }],
    });

    if (!dept) {
      throw new AppError('Department not found.', 404, ERROR_CODES.NOT_FOUND);
    }

    let seatAlloc = dept.seatAllocation;
    const currentOccupied = occupied_seats !== undefined ? parseInt(occupied_seats, 10) : (seatAlloc?.occupied_seats || 0);
    const newTotal = parseInt(total_seats, 10);

    if (newTotal < currentOccupied) {
      throw new AppError('Total seats cannot be less than currently occupied seats.', 400, ERROR_CODES.VALIDATION_ERROR);
    }

    const newAvailable = newTotal - currentOccupied;
    const newStatus = newAvailable === 0 ? 'FULL' : newAvailable <= 10 ? 'FILLING_FAST' : 'AVAILABLE';

    if (!seatAlloc) {
      seatAlloc = await SeatAllocation.create({
        department_id: dept.id,
        total_seats: newTotal,
        occupied_seats: currentOccupied,
        available_seats: newAvailable,
        status: newStatus,
      });
    } else {
      await seatAlloc.update({
        total_seats: newTotal,
        occupied_seats: currentOccupied,
        available_seats: newAvailable,
        status: newStatus,
      });
    }

    return seatAlloc;
  }
}

export default DepartmentService;
