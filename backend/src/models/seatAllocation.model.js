import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const SeatAllocation = sequelize.define('SeatAllocation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  total_seats: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 60,
    validate: {
      min: 0,
    },
  },
  occupied_seats: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  available_seats: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 60,
    validate: {
      min: 0,
    },
  },
  status: {
    type: DataTypes.ENUM('AVAILABLE', 'FILLING_FAST', 'FULL'),
    defaultValue: 'AVAILABLE',
  },
}, {
  tableName: 'seat_allocations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default SeatAllocation;
