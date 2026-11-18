import request from 'supertest';
import app from '../app.js';
import { connectDB, sequelize } from '../config/db.js';
import { initModelsAndSeed, Department, SeatAllocation } from '../models/index.js';

beforeAll(async () => {
  await connectDB();
  await initModelsAndSeed();
});

afterAll(async () => {
  await sequelize.close();
});

describe('Application & Admin Lifecycle Suite', () => {
  let candidateToken;
  let adminToken;
  let applicationId;
  let rawAppId;

  beforeAll(async () => {
    // Register candidate
    const candRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        first_name: 'Anirban',
        last_name: 'Chatterjee',
        email: `candidate_cycle_${Date.now()}@example.com`,
        phone: '+91 9831122334',
        password: 'Candidate@12345',
      });
    candidateToken = candRes.body.data.token;

    // Login Admin
    const adminRes = await request(app)
      .post('/api/v1/auth/admin/login')
      .send({
        email: 'admin@iemcal.com',
        password: 'Admin@12345',
      });
    adminToken = adminRes.body.data.token;
  });

  it('POST /api/v1/applications - Candidate creates a new application for CSE (Dept 1)', async () => {
    const res = await request(app)
      .post('/api/v1/applications')
      .set('Authorization', `Bearer ${candidateToken}`)
      .send({ department_id: 1 });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.application_id).toMatch(/^IEM-\d{4}-[A-Z0-9]+-\d{5}$/);
    expect(res.body.data.status).toBe('DRAFT');

    applicationId = res.body.data.id;
    rawAppId = res.body.data.application_id;
  });

  it('PUT /api/v1/applications/:id/personal - Updates personal details', async () => {
    const res = await request(app)
      .put(`/api/v1/applications/${applicationId}/personal`)
      .set('Authorization', `Bearer ${candidateToken}`)
      .send({
        first_name: 'Anirban',
        last_name: 'Chatterjee',
        date_of_birth: '2005-08-15',
        gender: 'MALE',
        category: 'GENERAL',
        nationality: 'Indian',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('PUT /api/v1/applications/:id/contact - Updates contact details', async () => {
    const res = await request(app)
      .put(`/api/v1/applications/${applicationId}/contact`)
      .set('Authorization', `Bearer ${candidateToken}`)
      .send({
        email: 'anirban.chat@example.com',
        phone: '+91 9831122334',
        address_line1: 'Sector V, Salt Lake City',
        city: 'Kolkata',
        state: 'West Bengal',
        pincode: '700091',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('PUT /api/v1/applications/:id/guardian - Updates guardian details', async () => {
    const res = await request(app)
      .put(`/api/v1/applications/${applicationId}/guardian`)
      .set('Authorization', `Bearer ${candidateToken}`)
      .send({
        father_name: 'Prabir Chatterjee',
        mother_name: 'Mousumi Chatterjee',
        annual_income: '5-10 Lakhs',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('PUT /api/v1/applications/:id/academic - Updates academic details', async () => {
    const res = await request(app)
      .put(`/api/v1/applications/${applicationId}/academic`)
      .set('Authorization', `Bearer ${candidateToken}`)
      .send({
        tenth_board: 'ICSE',
        tenth_school: 'St. Xaviers Collegiate',
        tenth_year: 2022,
        tenth_percentage: 92.4,
        twelfth_board: 'ISC',
        twelfth_school: 'St. Xaviers Collegiate',
        twelfth_year: 2024,
        twelfth_percentage: 94.2,
        physics_marks: 95,
        chemistry_marks: 92,
        maths_marks: 96,
        entrance_exam_name: 'WBJEE',
        entrance_roll_number: 'WBJEE-2026-9901',
        entrance_rank: 1420,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('POST /api/v1/applications/:id/submit - Blocks submission if required documents missing', async () => {
    const res = await request(app)
      .post(`/api/v1/applications/${applicationId}/submit`)
      .set('Authorization', `Bearer ${candidateToken}`);

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/admin/dashboard - Admin retrieves dashboard metrics & seat stats', async () => {
    const res = await request(app)
      .get('/api/v1/admin/dashboard')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.overview.totalApplications).toBeGreaterThan(0);
    expect(res.body.data.departmentStats).toBeDefined();
  });

  it('POST /api/v1/admin/applications/:id/reject - Rejection requires non-empty reason', async () => {
    const res = await request(app)
      .post(`/api/v1/admin/applications/${applicationId}/reject`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ reason: '' });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });
});
