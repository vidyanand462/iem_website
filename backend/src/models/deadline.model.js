import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const ApplicationDeadline = sequelize.define('ApplicationDeadline', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  academic_year: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('UPCOMING', 'OPEN', 'CLOSING_SOON', 'CLOSED'),
    defaultValue: 'OPEN',
  },
  announcement_notice: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'application_deadlines',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default ApplicationDeadline;
