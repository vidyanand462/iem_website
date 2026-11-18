import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const ApplicationDecision = sequelize.define('ApplicationDecision', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  application_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  decision: {
    type: DataTypes.ENUM('ACCEPTED', 'REJECTED', 'FLAGGED'),
    allowNull: false,
  },
  rejection_reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  decided_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  decided_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  notes: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'application_decisions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default ApplicationDecision;
