import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { APPLICATION_STATUS } from '../constants/applicationStatus.js';

export const StatusHistory = sequelize.define('StatusHistory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  application_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  from_status: {
    type: DataTypes.ENUM(
      APPLICATION_STATUS.DRAFT,
      APPLICATION_STATUS.SUBMITTED,
      APPLICATION_STATUS.UNDER_REVIEW,
      APPLICATION_STATUS.ACCEPTED,
      APPLICATION_STATUS.REJECTED
    ),
    allowNull: true,
  },
  to_status: {
    type: DataTypes.ENUM(
      APPLICATION_STATUS.DRAFT,
      APPLICATION_STATUS.SUBMITTED,
      APPLICATION_STATUS.UNDER_REVIEW,
      APPLICATION_STATUS.ACCEPTED,
      APPLICATION_STATUS.REJECTED
    ),
    allowNull: false,
  },
  changed_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  remarks: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'status_history',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

export default StatusHistory;
