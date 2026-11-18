import mongoose from 'mongoose';
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

// 1. Mongoose Schema
const documentSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    required: true,
    index: true,
  },
  applicantId: {
    type: Number,
    required: true,
    index: true,
  },
  documentType: {
    type: String,
    required: true,
    enum: ['photograph', 'id_proof', 'marksheet_10th', 'marksheet_12th', 'entrance_rank_card', 'other'],
  },
  originalName: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  storagePath: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

export const MongoDocument = mongoose.models.ApplicationDocument || mongoose.model('ApplicationDocument', documentSchema);

// 2. Relational SQL Fallback Model (ensures persistent metadata if Mongo is offline)
export const SQLDocument = sequelize.define('ApplicationDocument', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  application_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  applicant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  document_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  original_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mime_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  storage_path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  uploaded_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'application_documents',
  timestamps: false,
});

export default { MongoDocument, SQLDocument };
