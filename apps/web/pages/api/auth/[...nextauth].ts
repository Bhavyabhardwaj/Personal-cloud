import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "../../../db/drizzle";
import { users } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { generateAuthenticationOptions } from "@simplewebauthn/server";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Passkey Login",
      credentials: {
        email: { label: "Email", type: "email" }, // for identifying the user
        webauthnResponse: { label: "WebAuthn Response", type: "text" }, // for WebAuthn
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email) {
          return null;
        }

        // Step 1: Find user in the database by email
        const user = await db.select().from(users).where(eq(users.email, credentials.email)).limit(1);

        if (!user[0]) {
          return null; // Return null if user doesn't exist
        }

        // Step 2: Generate WebAuthn authentication options
        const options = generateAuthenticationOptions({
          allowCredentials: [{
            id: user[0].passkeyId as Buffer, // Assuming `passkeyId` is stored in the DB
            type: "public-key",
          }],
          userVerification: "preferred",
          rpID: "localhost", // For development; change in production to your actual domain
        });

        // Step 3: Store the current challenge in the database for future verification
        await db.update(users).set({ currentChallenge: options.challenge }).where(eq(users.id, user[0].id));

        // Returning options to be used in the frontend for authentication (WebAuthn)
        return { id: user[0].id.toString(), email: user[0].email, options };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
});
