import express from 'express';
import cors from "cors";
import prisma from "./prisma/client.js";
import {authRouter} from '../routes/authroutes.js';
import {VendorRouter} from '../routes/vendor-routes.js';
export const router= express.Router();
import morgan from 'morgan';
import bodyParser from 'body-parser';
import fleetRouter from '../routes/fleetroutes.js';
const app = express(); 

app.use(cors()); 
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan('combined')); 

// Dummy Route to check API status
app.get('/', (req, res) => {
  res.json({ 
    status: 'Active', 
    message: 'Vendor Management System API is running' 
  });
});

app.use('/api/auth',authRouter);
app.use("/api/vendor",VendorRouter);
app.use("/api/fleet",fleetRouter);

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



