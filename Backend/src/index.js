import dotenv from 'dotenv';
import express from 'express';
import cors from "cors";
import prisma from "./prisma/client.js";

const app = express();
dotenv.config(); 

app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Dummy Route to check API status
app.get('/', (req, res) => {
  res.json({ 
    status: 'Active', 
    message: 'Vendor Management System API is running' 
  });
});

// 4. Example Route: Get All Vendors (To test DB connection)
app.get('/api/vendors', async (req, res) => {
  try {
    const vendors = await prisma.vendor.findMany({
      include: {
        user: {
          select: { email: true, role: true } // Only fetch specific fields
        },
        children: true // See hierarchy
      }
    });
    res.json(vendors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});



