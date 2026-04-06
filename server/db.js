const postgres = require("postgres");
require("dotenv").config();

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
const useSsl = process.env.PGSSL === "true";

const commonConfig = {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
};

const sql = hasDatabaseUrl
  ? postgres(process.env.DATABASE_URL, {
      ...commonConfig,
      ssl: useSsl ? { rejectUnauthorized: false } : false,
    })
  : postgres({
      ...commonConfig,
      host: process.env.PGHOST || "127.0.0.1",
      port: Number(process.env.PGPORT || 5432),
      database: process.env.PGDATABASE || "cinedb",
      user: process.env.PGUSER || process.env.USER || "postgres",
      password: process.env.PGPASSWORD || "",
      ssl: useSsl ? { rejectUnauthorized: false } : false,
    });

module.exports = sql;
