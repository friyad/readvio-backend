import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { env } from "./env.js";
import { nextCookies } from "better-auth/next-js";

declare global {
  // eslint-disable-next-line no-var
  var __mongoClient__: MongoClient | undefined;
}

const client = global.__mongoClient__ ?? new MongoClient(env.MONGO_URI);
if (!global.__mongoClient__) {
  global.__mongoClient__ = client;
}
await client.connect();
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    cookiePrefix: "readvio",
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      domain: process.env.NEXT_PUBLIC_FRONTEND_DOMAIN,
    },
    defaultCookieAttributes: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      partitioned: false,
      domain: process.env.NEXT_PUBLIC_FRONTEND_DOMAIN,
    },
  },
  user: {
    additionalFields: {
      creditScore: {
        type: "number",
        input: false,
        defaultValue: 0,
      },
      referredBy: {
        type: "string",
        required: true,
        input: true,
        defaultValue: null,
      },
      referrals: {
        type: "string[]",
        input: false,
        defaultValue: [],
      },
      purchasedBooks: {
        type: "string[]",
        input: false,
        defaultValue: [],
      },
    },
  },
  plugins: [nextCookies()],
});

export type AuthInstance = typeof auth;
