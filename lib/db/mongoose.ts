import mongoose from "mongoose";
import dns from "dns";

// Ensure DNS fallback to public Google/Cloudflare DNS for Node.js SRV record resolution on Windows
function configureDNS() {
  try {
    dns.setDefaultResultOrder("ipv4first");
    dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
  } catch {
    // Ignore if not supported
  }

  const globalObj = globalThis as unknown as { __dnsSrvPatched?: boolean };
  if (!globalObj.__dnsSrvPatched) {
    globalObj.__dnsSrvPatched = true;
    const origResolveSrv = dns.resolveSrv;
    // @ts-expect-error - override resolveSrv for Windows DNS SRV fallback
    dns.resolveSrv = function (hostname: string, callback: (err: Error | null, addresses: dns.SrvRecord[]) => void) {
      const resolver = new dns.Resolver();
      resolver.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
      resolver.resolveSrv(hostname, (err, addresses) => {
        if (err && typeof origResolveSrv === "function") {
          return origResolveSrv(hostname, callback);
        }
        callback(err, addresses);
      });
    };

    if (dns.promises && dns.promises.resolveSrv) {
      dns.promises.resolveSrv = async function (hostname: string) {
        const resolver = new dns.promises.Resolver();
        resolver.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
        return resolver.resolveSrv(hostname);
      };
    }
  }
}

configureDNS();

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalForMongoose = globalThis as unknown as { mongoose: MongooseCache };

const cached: MongooseCache = globalForMongoose.mongoose || {
  conn: null,
  promise: null,
};

if (!globalForMongoose.mongoose) {
  globalForMongoose.mongoose = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  let MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env or .env.local"
    );
  }

  MONGODB_URI = MONGODB_URI.trim().replace(/^["']|["']$/g, "");

  if (
    !MONGODB_URI.startsWith("mongodb://") &&
    !MONGODB_URI.startsWith("mongodb+srv://")
  ) {
    throw new Error(
      "Invalid MONGODB_URI scheme. Expected connection string to start with 'mongodb://' or 'mongodb+srv://'. Please check your .env or .env.local file."
    );
  }

  configureDNS();

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        console.log("Connected to MongoDB Atlas");
        return m;
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB Atlas:", error);
        cached.promise = null;
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
