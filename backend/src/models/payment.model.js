import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  payment_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  application_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  applicant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  payment_type: {
    type: DataTypes.ENUM('APPLICATION_FEE', 'ADMISSION_FEE'),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'INR',
  },
  transaction_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  payment_method: {
    type: DataTypes.STRING,
    defaultValue: 'UPI',
  },
  payment_details: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'SUCCESS', 'FAILED'),
    defaultValue: 'SUCCESS',
  },
  paid_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'payments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Payment;
