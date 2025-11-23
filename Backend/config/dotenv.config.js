import dotenv from 'dotenv';
dotenv.config();

const envVariables={
    PORT:process.env.PORT,
    JWT_SECRET:process.env.JWT_SECRET,
    DATABASE_URL:process.env.DATABASE_URL,
    JWT_SECRET_KEY:process.env.JWT_SECRET_KEY
};

export default envVariables;