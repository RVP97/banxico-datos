/**
 * Minimal config for running migrations in production (drizzle-kit migrate).
 * Reads DATABASE_URL from env at runtime. Schema not required for migrate.
 */
export default {
  dialect: "postgresql",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
};
