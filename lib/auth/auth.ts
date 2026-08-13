import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectToDatabase } from "@/lib/db/mongoose";
import mongoose from "mongoose";

// Ensure database connection is initialized asynchronously
connectToDatabase().catch((err) => {
  console.error("Failed to connect to MongoDB in auth.ts:", err);
});

// Proxy handler for native MongoDB Db instance to support lazy resolution
const dbProxy = new Proxy({} as mongoose.mongo.Db, {
  get(_target, prop, receiver) {
    const db = mongoose.connection.getClient().db();
    const value = Reflect.get(db, prop, receiver);
    if (typeof value === "function") {
      return value.bind(db);
    }
    return value;
  },
});

export const auth = betterAuth({
  database: mongodbAdapter(dbProxy),
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET || "jobsorbit_better_auth_secret_key_32chars_min_key",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});
