import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const GuardianInfo = sequelize.define('GuardianInfo', {
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
  father_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  father_occupation: {
    type: DataTypes.STRING,
  },
  father_phone: {
    type: DataTypes.STRING,
  },
  mother_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mother_occupation: {
    type: DataTypes.STRING,
  },
  mother_phone: {
    type: DataTypes.STRING,
  },
  guardian_name: {
    type: DataTypes.STRING,
  },
  guardian_relation: {
    type: DataTypes.STRING,
  },
  annual_income: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'guardian_information',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default GuardianInfo;
