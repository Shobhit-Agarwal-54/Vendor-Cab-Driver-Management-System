// routes/vendor.routes.js
import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../src/prisma/client.js';
import { verifyToken, isSuperVendor } from '../middlewares/authMiddleware.js';

export const VendorRouter = express.Router();

// POST /api/vendors/create-sub
// Creates a Sub-Vendor under the current logged-in Vendor
// This route works for both Super Vendors and Sub Vendors
VendorRouter.post('/create-subvendor', verifyToken, async (req, res) => {
  try {
    const { email, password, region } = req.body;
    
    // 1. Get current user's vendor profile
    const currentUser = await prisma.vendor.findUnique({ where: { userId: req.userId } });
    
    if (!currentUser) return res.status(400).json({ message: "Only Vendors can add sub-vendors" });

    const hashedPassword = await bcrypt.hash(password, 8);

    // 2. Create (User + Vendor Profile) with Parent Link
    const newSubVendor = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role: 'SUB_VENDOR',
        vendorProfile: {
          create: {
            parentId: currentUser.id, // LINKING THE HIERARCHY HERE
            level: currentUser.level + 1,
            region: region,
            // Default permissions are false
            canOnboardDriver: true, // Super vendor has all rights
            canVerifyDocs: false,
            canProcessPayment: false,
            canEditVehicle:true
          }
        }
      }
    });

    res.status(201).json({ message: "Sub-Vendor created!", vendor: newSubVendor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/vendors/hierarchy
// "System Monitoring": Super Vendor sees everyone, Sub Vendor sees only their tree
VendorRouter.get('/hierarchy', verifyToken, async (req, res) => {
  try {
    const currentVendor = await prisma.vendor.findUnique({ where: { userId: req.userId } });
    
    // Recursive query to get children and grandchildren
    const hierarchy = await prisma.vendor.findUnique({
      where: { id: currentVendor.id },
      include: {
        user: { select: { email: true } },
        children: {
          include: {
            user: { select: { email: true } },
            children: true // Fetch deeper levels
          }
        }
      }
    });

    res.json(hierarchy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/vendors/delegate
// "Delegation": Only Super Vendor can run this
VendorRouter.patch('/delegate', [verifyToken, isSuperVendor], async (req, res) => {
  const { targetVendorId, canOnboard, canVerify, canPay,canEditVehicle } = req.body;
    const vendorId = Number(targetVendorId);
    const toBool = (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return false;
  };
  try {
    const updatedVendor = await prisma.vendor.update({
      where: { id: vendorId },
      data: {
        canOnboardDriver: toBool(canOnboard),
        canVerifyDocs: toBool(canVerify),
        canProcessPayment: toBool(canPay),
        canEditVehicle:toBool(canEditVehicle)
      }
    });
    res.json({ message: "Permissions updated", vendor: updatedVendor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default VendorRouter;
