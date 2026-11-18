import request from 'supertest';
import app from '../app.js';
import { connectDB, sequelize } from '../config/db.js';
import { initModelsAndSeed, User } from '../models/index.js';

beforeAll(async () => {
  await connectDB();
  await initModelsAndSeed();
});

afterAll(async () => {
  await sequelize.close();
});

describe('Authentication API Suite', () => {
  const testCandidate = {
    first_name: 'Subhas',
    last_name: 'Bose',
    email: `test_candidate_${Date.now()}@example.com`,
    phone: '+91 9830012345',
    password: 'Password@12345',
  };

  it('POST /api/v1/auth/register - Successfully registers candidate', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testCandidate);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testCandidate.email.toLowerCase());
    expect(res.body.data.token).toBeDefined();
  });

  it('POST /api/v1/auth/register - Rejects duplicate email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testCandidate);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/auth/register - Validates short password and missing fields', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'bademail', password: '123' });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/auth/login - Successfully logs in registered candidate', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testCandidate.email,
        password: testCandidate.password,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  it('POST /api/v1/auth/login - Rejects invalid password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testCandidate.email,
        password: 'WrongPassword!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/auth/admin/login - Successfully logs in seeded admin', async () => {
    const res = await request(app)
      .post('/api/v1/auth/admin/login')
      .send({
        email: 'admin@iemcal.com',
        password: 'Admin@12345',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('ADMIN');
  });
});
