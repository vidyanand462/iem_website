import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const AcademicInfo = sequelize.define('AcademicInfo', {
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
  tenth_board: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tenth_school: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tenth_year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tenth_percentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
  twelfth_board: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  twelfth_school: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  twelfth_year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  twelfth_percentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
  physics_marks: {
    type: DataTypes.DECIMAL(5, 2),
  },
  chemistry_marks: {
    type: DataTypes.DECIMAL(5, 2),
  },
  maths_marks: {
    type: DataTypes.DECIMAL(5, 2),
  },
  entrance_exam_name: {
    type: DataTypes.STRING, // WBJEE, JEE Main, IEMJEE
  },
  entrance_roll_number: {
    type: DataTypes.STRING,
  },
  entrance_rank: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'academic_information',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default AcademicInfo;
