require("dotenv").config();

const REQUIRED_VARS = ["DB_URI"];

for (const key of REQUIRED_VARS) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

module.exports = {
  port: process.env.PORT || 3000,
  dbUri: process.env.DB_URI,
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  nodeEnv: process.env.NODE_ENV || "development",
};
