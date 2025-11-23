// routes/fleet.routes.js
import express from 'express';
import prisma from '../src/prisma/client.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import bcrypt from 'bcryptjs';
const fleetRouter = express.Router();

// POST /api/fleet/onboard-driver
// "Sub-Vendor Fleet & Driver Management"
fleetRouter.post('/onboard-driver', verifyToken, async (req, res) => {
  const { email, licenseNumber, vehicleRegNumber,password } = req.body;
  
  try {
    // 1. Check Permissions
    const manager = await prisma.vendor.findUnique({ where: { userId: req.userId } });
    
    // Logic: Super Vendor (Level 1) OR Sub-Vendor with explicit permission
    if (manager.level !== 1 && !manager.canOnboardDriver) {
      return res.status(403).json({ message: "You do not have permission to onboard drivers." });
    }
     const hashedPassword = await bcrypt.hash(password, 8);
    // 2. Create Driver User
    const driverUser = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword, // Placeholder
        role: 'DRIVER',
        driverProfile: {
          create: {
            licenseNumber,
            managedByVendorId: manager.id,
          }
        }
      },
      include: { driverProfile: true }
    });
        if (vehicleRegNumber) {
      const vehicle = await prisma.vehicle.findUnique({ where: { registrationNumber: vehicleRegNumber } });
      if (vehicle) {
        await prisma.driver.update({
          where: { id: driverUser.driverProfile.id },
          data: { currentVehicleId: vehicle.id }
        });
      }
    }
    res.status(201).json({ message: "Driver Onboarded", driver: driverUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/add-vehicle', verifyToken, async (req, res) => {
  const { registrationNumber, model, capacity, fuelType } = req.body;

  try {
    // A. Permission Check
    const vendor = await prisma.vendor.findUnique({
      where: { userId: req.userId },
    });
    if(!vendor)
    {
        return res.status(403).json({ message: 'Only Vendors can add vehicles.' });
    }
    // Logic: Must be Super Vendor (Level 1) OR have specific 'canEditVehicle' permission
    if (vendor.level !== 1 && !vendor.canEditVehicle) {
      return res
        .status(403)
        .json({ message: 'Permission Denied: You cannot manage vehicles.' });
    }

    // B. Data Integrity Check
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { registrationNumber },
    });

    if (existingVehicle) {
      return res.status(409).json({
        message: 'Vehicle with this Registration Number already exists.',
      });
    }

    // C. Create Vehicle
    const newVehicle = await prisma.vehicle.create({
      data: {
        ownerVendorId: vendor.id,
        registrationNumber,
        model,
        capacity: parseInt(capacity, 10),
        fuelType,
        status: 'ACTIVE', // Default status, can be changed to NON_COMPLIANT if docs missing
      },
    });

    return res
      .status(201)
      .json({ message: 'Vehicle added successfully', vehicle: newVehicle });
  } catch (error) {
    console.error('Add Vehicle Error:', error);
    return res
      .status(500)
      .json({ error: 'Failed to add vehicle. Ensure data is correct.' });
  }
});



router.post('/upload-doc', verifyToken, async (req, res) => {
  const { entityId, entityType, docType, docUrl, expiryDate } = req.body; // entityType: DRIVER | VEHICLE

  try {
    const uploader = await prisma.vendor.findUnique({
      where: { userId: req.userId }
    });

    // Auto-calc status
    const isExpired = new Date(expiryDate) < new Date();
    const status = isExpired ? 'EXPIRED' : 'PENDING';

    let docData = {
      type: docType,
      url: docUrl,
      expiryDate: new Date(expiryDate),
      status
    };

    // Polymorphic Linking
    if (entityType === 'DRIVER') {
      docData.driverId = parseInt(entityId);
    } else if (entityType === 'VEHICLE') {
      docData.vehicleId = parseInt(entityId);
    } else {
      return res.status(400).json({ message: "Invalid Entity Type" });
    }

    const newDoc = await prisma.document.create({ data: docData });

    // Auto-update status for expired vehicle docs
    if (isExpired && entityType === 'VEHICLE') {
      await prisma.vehicle.update({
        where: { id: parseInt(entityId) },
        data: { status: 'NON_COMPLIANT' }
      });
    }

    return res.status(201).json({
      message: "Document Uploaded",
      document: newDoc
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// --- 2. Get Vehicles (Fleet) ---
router.get('/vehicles', verifyToken, async (req, res) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { userId: req.userId }
    });

    const vehicles = await prisma.vehicle.findMany({
      where: { ownerVendorId: vendor.id },
      include: {
        assignedDriver: {
          include: { user: { select: { email: true } } }
        },
        documents: true
      }
    });

    return res.json(vehicles);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default fleetRouter;
