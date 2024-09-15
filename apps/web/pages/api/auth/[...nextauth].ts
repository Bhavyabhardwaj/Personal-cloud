import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "../../../db/drizzle";
import { users } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { generateAuthenticationOptions } from "@simplewebauthn/server";


export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Testing",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials){
                if (!credentials){
                    return null;
                }
                const user = await db.select().from(users).where(eq(users.email, credentials.email)).limit(1);

                if(!user[0]){
                    return null;
                }

                // generate auth options
                const options = await generateAuthenticationOptions({
                    allowCredentials: [{
                         id: user[0].id as any,
                        },
                    ],
                    userVerification: "preferred",
                    rpID: "http://localhost:3000"
                });

                //store the cllnge
                await db.update(users).set({ currentChallenge: options.challenge}).where(eq(users.id, user[0].id));

                //return it to client
                return{ id: user[0].id.toString(), email: user[0].email , options};
            },
        }),
    ],
    callbacks: {
        async jwt({token , user}) {
            if(user){
                token.id = user.id;
            }
            return token;
        }
    },
    //@ts-ignore
    async session({ session, token }) {
        if (token && session.user){
            session.user.id = token.id;
        }
        return session;
    },
});    