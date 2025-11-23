import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import envVariables from '../../config/dotenv.config.js';

const connectionString = `${envVariables.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });

const globalForPrisma = global;

const prisma = globalForPrisma.prisma || new PrismaClient({adapter});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
