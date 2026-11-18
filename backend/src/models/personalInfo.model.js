import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const PersonalInfo = sequelize.define('PersonalInfo', {
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
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  middle_name: {
    type: DataTypes.STRING,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'),
    allowNull: false,
  },
  blood_group: {
    type: DataTypes.STRING,
  },
  category: {
    type: DataTypes.ENUM('GENERAL', 'OBC', 'SC', 'ST', 'EWS'),
    defaultValue: 'GENERAL',
  },
  nationality: {
    type: DataTypes.STRING,
    defaultValue: 'Indian',
  },
  aadhar_number: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'personal_information',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default PersonalInfo;
