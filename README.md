🚖 MegaCabs: Vendor & Fleet Management System

A scalable, hierarchical ride-sharing management platform designed to handle N-level vendor delegation, fleet compliance, and robust driver onboarding.

📖 Project Overview

This project is a Vendor Cab and Driver Onboarding System that solves the complexity of managing large-scale fleet operations. Unlike traditional flat-structure systems, MegaCabs implements a Recursive N-Level Hierarchy (Super Vendor → Regional → City → Local), allowing for granular control and delegation of authority.

🎯 Key Objectives Met

Multi-Level Hierarchy: Infinite parent-child vendor relationships.

Secure Delegation: Super Vendors can grant specific permissions (e.g., "Can Onboard", "Can Verify") to sub-vendors.

Strict Compliance: Automated checking of document expiry for drivers and vehicles.

Performance Optimization: Optimized recursive queries for retrieving organizational trees.

🛠️ Tech Stack

Component

Technology

Reason for Choice (Trade-off Analysis)

Frontend

React.js + Tailwind CSS

Component reusability for Dashboards; fast UI development.

Backend

Node.js + Express

Non-blocking I/O for handling concurrent document uploads.

Database

PostgreSQL (Neon DB)

ACID compliance required for hierarchy integrity and payments.

ORM

Prisma

Provides OOPS structure (Models) and Type Safety.

Auth

JWT + Bcrypt

Stateless, secure authentication protocol.

🏗️ System Architecture & Schema

The core of this system is the Self-Referencing Vendor Model. This design allows us to maintain an infinite hierarchy without creating separate tables for "Regional" or "City" vendors.

The Database Schema (OOPS Implementation)

model Vendor {
  id      Int     @id @default(autoincrement())
  
  // The Hierarchy (Self-Referencing Relation)
  parentId  Int?    
  parent    Vendor? @relation("VendorHierarchy", fields: [parentId], references: [id])
  children  Vendor[] @relation("VendorHierarchy")

  // Permissions (Flattened for O(1) Access)
  canOnboardDriver   Boolean @default(false)
  canVerifyDocs      Boolean @default(false)
  
  // Relationships (Encapsulation)
  vehicles        Vehicle[]
  driversManaged  Driver[]
}


🧠 Design Decisions & Trade-offs

SQL vs NoSQL: We chose PostgreSQL over MongoDB.

Why? The recursive nature of the hierarchy (WITH RECURSIVE queries) and the need for strict foreign key constraints (Drivers must belong to Vendors) made a Relational DB superior for data integrity.

Flattened Permissions: Instead of a separate Permissions table (Normalization), we added boolean flags to the Vendor table.

Benefit: Reduces JOIN complexity during login, improving response time from $O(N)$ to $O(1)$.

🚀 Features & Modules

1. Authentication & Security

JWT Implementation: Secure session management.

Role-Based Access Control (RBAC): Middleware (verifyToken, isSuperVendor) strictly guards routes.

Password Hashing: Bcrypt utilized for security.

2. Multi-Level Vendor Hierarchy

Visual Tree: Frontend renders the organization recursively in a hierarchial manner.

Dynamic Onboarding: Vendors can create sub-vendors under them.

3. Delegation System

Granular Control: Super Vendors can toggle permissions dynamically.

Inheritance: Sub-vendors operate within the constraints set by their parent.

4. Fleet & Document Management

Duplicate Prevention: Prevents onboarding vehicles/drivers that already exist under same or different vendor.

Onboarding:  Vendors can onboard new drivers/vehicles under them and assigns vehicles to drivers.

💻 Installation & Setup

Prerequisites

Node.js (v14+)

PostgreSQL Connection String (Neon DB recommended)

1. Backend Setup

# Clone the repository
git clone [https://github.com/yourusername/megacabs.git](https://github.com/yourusername/megacabs.git)
cd megacabs/backend

# Install dependencies
npm install

# Setup Environment Variables (.env)
echo "DATABASE_URL='your_neon_db_string'" > .env
echo "JWT_SECRET='your_secret_key'" >> .env
echo "PORT='your port number'">> .env
# Push Schema to DB
npx prisma db push

# Start Server
npm start


2. Frontend Setup

cd ../frontend

# Install dependencies
npm install

# Start React Dev Server
npm start


📊 API Documentation (Key Endpoints)

Method

Endpoint

Description

Access

POST

/api/auth/login

Login user & return JWT

Public

POST

/api/auth/register-super

Setup the root admin

Public (One-time)

GET

/api/vendor/hierarchies

Fetch full recursive Org Tree

Authenticated

POST

/api/vendor/create-sub

Create a child vendor

Parent Vendor

PATCH

/api/vendor/delegate

Grant permissions

Super Vendor

POST

/api/fleet/onboard-driver

Add driver to system

Authorized Vendor

POST

/api/fleet/add-vehicle

Add vehicle to fleet

Authorized Vendor

GET

/api/fleet//vehicles

Get Details of Vehicles

Authorized Vendor

📈 Cost Estimation (Time & Space Complexity)

Hierarchy Retrieval:

Naive Approach: Fetch Level 1 -> Loop -> Fetch Level 2. Time: $O(N^2)$.

Our Approach: Single Deep Query using Prisma include recursion. Time: Optimized to Database IO speeds.

Space Complexity:

Use of Enums (UserRole) in Postgres reduces storage footprint compared to string repetition.

🔮 Future Improvements

Caching: Cache the Hierarchy Tree to reduce DB load on frequent dashboard refreshes.

Microservices: Split Auth and Fleet management into separate services for horizontal scaling.
