import ApplicationDeadline from '../models/deadline.model.js';
import AppError from '../utils/AppError.js';
import { ERROR_CODES } from '../constants/errorCodes.js';

export class DeadlineService {
  /**
   * Get current active admission deadline
   */
  static async getActiveDeadline() {
    const deadline = await ApplicationDeadline.findOne({
      order: [['end_date', 'DESC']],
    });
    return deadline;
  }

  /**
   * Update or create application deadline
   */
  static async updateDeadline({ academic_year, start_date, end_date, status, announcement_notice }) {
    let deadline = await ApplicationDeadline.findOne({ where: { academic_year } });

    if (deadline) {
      await deadline.update({
        start_date,
        end_date,
        status: status || deadline.status,
        announcement_notice: announcement_notice || deadline.announcement_notice,
      });
    } else {
      deadline = await ApplicationDeadline.create({
        academic_year,
        start_date,
        end_date,
        status: status || 'OPEN',
        announcement_notice: announcement_notice || '',
      });
    }

    return deadline;
  }
}

export default DeadlineService;
