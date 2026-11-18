import { Sequelize } from 'sequelize';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { env } from './env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let sequelize;

const initDatabase = () => {
  if (env.DB_DIALECT === 'mysql') {
    sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
      host: env.DB_HOST,
      port: env.DB_PORT,
      dialect: 'mysql',
      logging: env.DB_LOGGING ? console.log : false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      define: {
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
    });
  } else {
    // Default SQLite mode for effortless zero-config development
    const isVercel = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME;
    const dataDir = isVercel ? '/tmp' : path.resolve(__dirname, '../../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const storagePath = path.join(dataDir, 'iem_admission.sqlite');

    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: storagePath,
      logging: env.DB_LOGGING ? console.log : false,
      define: {
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
    });
  }

  return sequelize;
};

sequelize = initDatabase();

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`[DB] Database connection established successfully (${sequelize.getDialect()})`);
    return sequelize;
  } catch (error) {
    if (env.DB_DIALECT === 'mysql') {
      console.warn('[DB] MySQL connection failed. Falling back to local SQLite database for uninterrupted development...');
      const isVercel = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME;
      const dataDir = isVercel ? '/tmp' : path.resolve(__dirname, '../../data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const storagePath = path.join(dataDir, 'iem_admission.sqlite');
      sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: storagePath,
        logging: false,
        define: {
          underscored: true,
          timestamps: true,
          createdAt: 'created_at',
          updatedAt: 'updated_at',
        },
      });
      await sequelize.authenticate();
      console.log('[DB] Fallback SQLite database connected successfully.');
      return sequelize;
    }
    console.error('[DB] Unable to connect to the database:', error.message);
    throw error;
  }
};

export { sequelize };
export default sequelize;
