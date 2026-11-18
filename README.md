# Institute of Engineering & Management (IEM), Kolkata — Centralized Admission System & University Platform

A full-stack, enterprise-grade, photography-driven admission platform and institutional web experience built for the **Institute of Engineering & Management (IEM), Kolkata**.

---

## 🏛️ System Architecture & Highlights

The platform integrates **three dedicated experiences**:
1. **Public Website**: Editorial, cinematic university web experience featuring the signature interactive **1989 → 2026 → Future Animated History Timeline Hero**, Program Explorer, "Where Ideas Become Impact" Research Lifecycle, "IEM Beyond Borders" Global Map, Campus Life & Techno-Management Fest showcase, and 7-Step Admissions Gateway.
2. **Applicant Portal**: Clean, accessible SaaS workflow with multi-step application stepper (Personal, Contact, Guardian, Academic Records, Document Scans with preview & delete), deadline validations, and downloadable/printable official Acknowledgement Slips.
3. **Admin Portal**: Operational command center with real-time metrics, Recharts departmental intake graphs, application review drawer with document verification, **transactional row-locking seat decrement upon acceptance**, and mandatory reason enforcement upon rejection.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, React Router v7, Tailwind CSS, Framer Motion, Lucide Icons, Axios, React Hook Form + Zod, Recharts, Canvas Confetti.
- **Backend**: Node.js, Express.js (ES Modules, Layered Architecture: `routes → controllers → services → models`).
- **Relational Storage**: MySQL 8.0+ / Sequelize (with ACID transactions, row locking `SELECT ... FOR UPDATE`, foreign key cascades, check constraints, and automatic zero-config SQLite development fallback).
- **Document Store**: MongoDB / Mongoose & local disk storage for verification documents.
- **Security & Middlewares**: JWT (httpOnly cookies / Bearer auth), bcrypt password hashing, role-based access control (`APPLICANT`, `ADMIN`), Multer upload restrictions, Helmet, CORS allowlisting, rate limiters, centralized error handler with custom `AppError`.

---

## 🚀 Quickstart & Local Installation

### Prerequisites
- Node.js v18+ and npm installed.
- (Optional) Docker for MySQL & MongoDB.

### 1. Database (Optional Docker Compose)
If you wish to run MySQL and MongoDB via Docker:
```bash
docker-compose up -d
```
*Note: If MySQL is not running, the backend automatically utilizes SQLite in `backend/data/iem_admission.sqlite` with identical relational schema and auto-seeding!*

### 2. Backend Setup & Run
```bash
cd backend
npm install
npm run dev
```
- Server starts on `http://localhost:5000`
- API Base endpoint: `http://localhost:5000/api/v1`

### 3. Frontend Setup & Run
```bash
cd ../frontend
npm install
npm run dev
```
- Web Application live at `http://localhost:5173`

---

## 🔑 Demo Credentials (Development Mode)

| Role | Email | Password | Access Area |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@iemcal.com` | `Admin@12345` | `/auth/admin/login` → `/admin/dashboard` |
| **New Candidate** | *Register at `/auth/register`* | *Any 8+ chars* | `/auth/login` → `/applicant/dashboard` |

---

## 📜 Key API Endpoints (`/api/v1`)

### Authentication
- `POST /auth/register`: Register new candidate profile.
- `POST /auth/login`: Candidate login.
- `POST /auth/admin/login`: Admin authentication.
- `POST /auth/logout`: Invalidate session cookie.
- `GET /auth/me`: Current session profile.

### Applications (Applicant)
- `GET /applications`: List candidate applications.
- `POST /applications`: Create draft application (`IEM-YYYY-XXXXXX`).
- `GET /applications/:id`: Application detail.
- `PUT /applications/:id/personal`: Save personal section.
- `PUT /applications/:id/contact`: Save contact section.
- `PUT /applications/:id/guardian`: Save guardian section.
- `PUT /applications/:id/academic`: Save academic section.
- `POST /applications/:id/submit`: Final submission (enforces deadline & required sections).
- `GET /applications/:id/status`: Evaluation lifecycle timeline.
- `GET /applications/:id/acknowledgement`: Printable verification slip.

### Document Management
- `POST /documents/applications/:id/documents`: Upload file (JPG/PNG/PDF, max 5MB).
- `GET /documents/applications/:id/documents`: List uploaded documents.
- `GET /documents/documents/:docId`: Stream / preview file.
- `DELETE /documents/documents/:docId`: Remove document.

### Administration
- `GET /admin/dashboard`: Metrics & Recharts breakdown.
- `GET /admin/applications`: Filter & search applications table.
- `POST /admin/applications/:id/review`: Move to `UNDER_REVIEW`.
- `POST /admin/applications/:id/accept`: Transactional seat decrement & acceptance.
- `POST /admin/applications/:id/reject`: Rejection with mandatory reason.
- `GET /departments`: Departmental seat balances.
- `PUT /departments/:id/seats`: Modify intake capacity.
- `GET /deadline` & `PUT /deadline`: Manage admissions cutoff window.
- `GET /admin/reports`: Export intake analytics.

---

## 🧪 Running Automated Tests

```bash
cd backend
npm test
```
Tests cover registration validation, duplicate prevention, password hashing, draft creation, multi-step updates, incomplete submission blocking, admin review, transactional seat decrement, and rejection reason enforcement.
