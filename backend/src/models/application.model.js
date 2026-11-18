import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { APPLICATION_STATUS } from '../constants/applicationStatus.js';

export const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  application_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  applicant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(
      APPLICATION_STATUS.DRAFT,
      APPLICATION_STATUS.SUBMITTED,
      APPLICATION_STATUS.UNDER_REVIEW,
      APPLICATION_STATUS.FLAGGED,
      APPLICATION_STATUS.ACCEPTED,
      APPLICATION_STATUS.REJECTED
    ),
    defaultValue: APPLICATION_STATUS.DRAFT,
  },
  current_step: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  submitted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'applications',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Application;
