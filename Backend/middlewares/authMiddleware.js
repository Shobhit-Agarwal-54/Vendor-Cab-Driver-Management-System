
import jwt from "jsonwebtoken";
import prisma from "../src/prisma/client.js";
import envVariables from "../config/dotenv.config.js";
export const SECRET_KEY = envVariables.JWT_SECRET_KEY;

// 1. Verify Token (Authentication)
export const verifyToken = (req, res, next) => 
    {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>

        if (!token) 
        {
            return res.status(403).json({ message: "No token provided." });
        }

        jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
        return res.status(401).json({ message: "Unauthorized!" });
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
            });
    };

// 2. Check if User is Super Vendor (Authorization)
export const isSuperVendor = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { vendorProfile: true }
    });

    if (user.role !== 'SUPER_VENDOR' || user.vendorProfile.level !== 1) {
      return res.status(403).json({ message: "Require Super Vendor Role!" });
    }
    next();
  } catch (error) {
    res.status(500).send({ message: "Unable to validate User role!" });
  }
};

