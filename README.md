#  RentFlow — Rental Management System

A full-stack, multi-tenant SaaS platform for property managers and landlords.  
Built with **React + Vite**, **Node.js + Express**, and **MySQL**.

---

##  Features

### Super Admin
- System-wide dashboard & analytics
- Create/manage landlord (admin) accounts
- Activate/deactivate landlord accounts
- Reset user passwords
- View all houses and tenants across all landlords

### Admin (Landlord)
- Personal dashboard with portfolio stats
- Manage properties (add/edit/delete houses)
- Register tenants and assign them to houses
- Record rent payments (cash, M-Pesa, bank, cheque)
- Enter water meter readings → auto-generates bills
- Manage maintenance requests (update status/notes)

### Tenant
- View tenancy profile and landlord contact
- Submit and track maintenance requests
- View water bills and payment status
- Full rent payment history

---

## 🛠 Tech Stack

| Layer      | Technology                   |
|------------|------------------------------|
| Frontend   | React 18 + Vite + Tailwind CSS |
| Backend    | Node.js + Express.js          |
| Database   | MySQL 8+                      |
| Auth       | JWT + bcryptjs                |
| HTTP Client| Axios                         |

---

##  Project Structure

```
rental-management-system/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── api/               # Axios instance
│   │   ├── components/        # Shared UI components & layout
│   │   ├── context/           # Auth context
│   │   ├── pages/
│   │   │   ├── auth/          # Login page
│   │   │   ├── superadmin/    # Super admin pages
│   │   │   ├── admin/         # Landlord pages
│   │   │   └── tenant/        # Tenant pages
│   │   └── App.jsx            # Routes
│   └── package.json
│
├── server/                    # Express API
│   ├── config/                # Database connection
│   ├── controllers/           # Business logic
│   ├── middleware/            # Auth middleware
│   ├── routes/                # API routes
│   ├── utils/                 # Seed script
│   ├── index.js               # Entry point
│   └── package.json
│
├── database/
│   └── schema.sql             # Full database schema
│
└── .env.example               # Environment variables template
```

---

##  Setup Instructions

### Prerequisites
- Node.js v18+
- MySQL 8+
- npm

---

### 1. Clone and Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Set Up Database

```bash
# Create the database and tables
mysql -u root -p < database/schema.sql
```

### 3. Configure Environment

```bash
# Copy and edit the env file
cp .env.example server/.env
# Edit server/.env with your MySQL credentials and a strong JWT secret
```

### 4. Seed Demo Data

```bash
cd server
npm run seed
```

This creates:
| Role        | Email                       | Password        |
|-------------|-----------------------------|-----------------|
| Super Admin | superadmin@rentalsys.com    | SuperAdmin@123  |
| Admin       | admin@demo.com              | Admin@123       |
| Tenant      | tenant@demo.com             | Tenant@123      |

### 5. Start the Application

**Terminal 1 — Backend:**
```bash
cd server
npm run dev      # Development (nodemon)
# or
npm start        # Production
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

---

##  Security

- All passwords hashed with **bcrypt**
- JWT tokens expire after 7 days
- Role-based middleware on every protected route
- **Data isolation**: Admin queries always filter by `admin_id`
- Super Admin can access all data; Admins only see their own

---

##  Water Billing Logic

```
units_used   = current_reading - previous_reading
total_amount = units_used × rate_per_unit (default: KES 50)
```
Bills are auto-generated when a reading is entered.

---

##  Rent Logic

```
balance = expected_rent - amount_paid
```
Partial payments are tracked with outstanding balance shown.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint               | Access     |
|--------|------------------------|------------|
| POST   | /api/auth/login        | Public     |
| GET    | /api/auth/profile      | All roles  |
| PUT    | /api/auth/change-password | All roles |

### Super Admin
| Method | Endpoint                              |
|--------|---------------------------------------|
| GET    | /api/super-admin/dashboard            |
| GET/POST | /api/super-admin/admins             |
| PATCH  | /api/super-admin/admins/:id/toggle-status |
| PUT    | /api/super-admin/users/:id/reset-password |
| GET    | /api/super-admin/tenants              |
| GET    | /api/super-admin/houses               |

### Admin
| Method | Endpoint               |
|--------|------------------------|
| GET/POST | /api/houses          |
| PUT/DELETE | /api/houses/:id    |
| GET/POST | /api/tenants         |
| PATCH  | /api/tenants/:id/vacate |
| GET/POST | /api/rent            |
| GET    | /api/rent/dashboard    |
| GET/POST | /api/water/readings  |
| GET    | /api/water/bills       |
| PATCH  | /api/water/bills/:id/pay |
| GET    | /api/maintenance       |
| PATCH  | /api/maintenance/:id/status |

### Tenant
| Method | Endpoint                  |
|--------|---------------------------|
| GET    | /api/tenants/my-profile   |
| GET    | /api/maintenance          |
| POST   | /api/maintenance          |
| GET    | /api/water/bills          |
| GET    | /api/rent                 |

---

##  License

MIT — feel free to use and extend this project.
