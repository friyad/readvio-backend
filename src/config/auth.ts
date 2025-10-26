import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { env } from "./env";

const client = new MongoClient(env.MONGO_URI);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
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
});

export type AuthInstance = typeof auth;
