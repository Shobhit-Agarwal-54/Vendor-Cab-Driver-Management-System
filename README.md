### 🚖 MegaCabs: Vendor & Fleet Management System

A scalable, hierarchical ride-sharing management platform designed to handle **N-level vendor delegation**, **fleet compliance**, and **robust driver onboarding**.

---

### 📖 Project Overview

MegaCabs is a Vendor Cab and Driver Onboarding System built to manage large-scale fleet operations.  
Unlike traditional flat-structure systems, MegaCabs uses a **recursive N-Level hierarchy** (Super Vendor → Regional → City → Local), enabling granular authority distribution and management.

---

### 🎯 Key Objectives Met

- **Multi-Level Hierarchy:** Infinite parent-child vendor relationships.  
- **Secure Delegation:** Super Vendors can grant custom permissions (e.g., *Can Onboard*, *Can Verify*).  
- **Strict Compliance:** Automatic document-expiry checks for drivers and vehicles.  
- **Performance Optimization:** Recursive, optimized organizational tree retrieval.

---

### 🛠️ Tech Stack

| Component  | Technology                 | Why This Choice (Trade-off Analysis) |
|-----------|-----------------------------|---------------------------------------|
| Frontend  | React.js + Tailwind CSS     | Component reusability, fast UI dev.   |
| Backend   | Node.js + Express           | Non-blocking I/O for large operations |
| Database  | PostgreSQL (Neon DB)        | ACID, recursive queries, strong FK    |
| ORM       | Prisma                      | Type-safe models, clean schema        |
| Auth      | JWT + Bcrypt                | Stateless, fast, secure               |

---

### 🏗️ System Architecture & Schema

The system uses a **self-referencing Vendor model**, enabling infinite hierarchical tree structures without extra tables for levels.

#### Database Schema (Self-Referencing Model Example)

```prisma
model Vendor {
  id      Int     @id @default(autoincrement())

  // The Hierarchy (Self-Referencing Relation)
  parentId  Int?
  parent    Vendor?  @relation("VendorHierarchy", fields: [parentId], references: [id])
  children  Vendor[] @relation("VendorHierarchy")

  // Permissions (Flattened for O(1) Access)
  canOnboardDriver  Boolean @default(false)
  canVerifyDocs     Boolean @default(false)

  // Relationships (Encapsulation)
  vehicles        Vehicle[]
  driversManaged  Driver[]
}
```
### 🧠 Design Decisions & Trade-offs

#### SQL vs NoSQL  
Chose **PostgreSQL** because recursive hierarchy queries (`WITH RECURSIVE`) and strict foreign key relationships ensure strong data integrity.

#### Flattened Permissions  
Instead of storing permissions in a separate table, boolean flags are used directly inside the Vendor table.

- **Benefit:** Reduces JOIN complexity  
- **Performance:** From `O(N)` joins → `O(1)` direct permission checks  

---

### 🚀 Features & Modules

#### 1. Authentication & Security
- JWT Implementation: Secure session management.
- Role-Based Access Control (RBAC): Middleware (verifyToken, isSuperVendor) strictly guards routes.
- Password Hashing: Bcrypt utilized for security.

#### 2. Multi-Level Vendor Hierarchy
- Visual Tree: Frontend renders the organization recursively in a hierarchial manner.
- Dynamic Onboarding: Vendors can create sub-vendors under them.

#### 3. Delegation System
- Granular Control: Super Vendors can toggle permissions dynamically.
- Inheritance: Sub-vendors operate within the constraints set by their parent. 

#### 4. Fleet & Document Management
- Duplicate Prevention: Prevents onboarding vehicles/drivers that already exist under same or different vendor.
- Onboarding:  Vendors can onboard new drivers/vehicles under them and assigns vehicles to drivers.

---

### 💻 Installation & Setup

#### **Prerequisites**
- Node.js (v14+)  
- PostgreSQL connection string (NeonDB recommended)  

---

### **1. Backend Setup**

```bash
# Clone the repository
git clone https://github.com/yourusername/megacabs.git
cd megacabs/backend

# Install dependencies
npm install

# Setup Environment Variables
echo "DATABASE_URL='your_neon_db_string'" > .env
echo "JWT_SECRET='your_secret_key'" >> .env

# Push Prisma Schema
npx prisma db push

# Start Server
npm start
```

### 2. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start React development server
npm start
```

### 📊 API Documentation (Key Endpoints)

| Method | Endpoint                   | Description                   | Access            |
|--------|----------------------------|-------------------------------|-------------------|
| POST   | /api/auth/login           | Login user & issue JWT       | Public            |
| POST   | /api/auth/register-super  | Setup root admin             | Public (One-time) |
| GET    | /api/vendors/hierarchy    | Fetch recursive Org Tree     | Authenticated     |
| POST   | /api/vendors/create-sub   | Create child vendor          | Parent Vendor     |
| PATCH  | /api/vendors/delegate     | Grant permissions            | Super Vendor      |
| POST   | /api/fleet/onboard-driver | Onboard driver               | Authorized Vendor |
| POST   | /api/fleet/add-vehicle    | Add vehicle to fleet         | Authorized Vendor |
| GET    |/api/fleet//vehicles       | Get Details of Vehicles      | Authorized Vendor |
---

### 📈 Cost Estimation (Time & Space Complexity)

#### Hierarchy Retrieval
- **Naive:** `O(N^2)` (multiple queries per level)  
- **Optimized:** Single recursive DB query → Highly efficient  

#### Space Complexity
- Enums reduce repeated string storage  
- Optional audit logs stored separately to prevent database bloat  

---

### 🔮 Future Improvements

- Caching: Cache the Hierarchy Tree to reduce DB load on frequent dashboard refreshes.
- Microservices: Split Auth and Fleet management into separate services for horizontal scaling.

