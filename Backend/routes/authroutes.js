// routes/auth.routes.js

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../src/prisma/client.js';
import express from 'express';
import { SECRET_KEY } from '../middlewares/authMiddleware.js';

export const authRouter = express.Router();


// POST /api/auth/register-super
// Only run this ONCE to create the first Admin
authRouter.post('/register-super', async (req, res) => {
  try {
    const { email, password, region } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role: 'SUPER_VENDOR',
        vendorProfile: {
          create: {
            level: 1, // Level 1 = Super Vendor
            region: region,
            canOnboardDriver: true, // Super vendor has all rights
            canVerifyDocs: true,
            canProcessPayment: true,
            canEditVehicle:true
          }
        }
      }
    });

    res.status(201).json({ message: "Super Vendor registered successfully!", userId: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/login
// Login is generic for all users
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
      include: { vendorProfile: true } // Include profile to get vendor ID
    });

    if (!user) return res.status(404).json({ message: "User Not found." });

    const passwordIsValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordIsValid) {
      return res.status(401).json({ accessToken: null, message: "Invalid Password!" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: 86400 // 24 hours
    });

    res.status(200).json({
      id: user.id,
      email: user.email,
      role: user.role,
      vendorId: user.vendorProfile?.id,
      accessToken: token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

