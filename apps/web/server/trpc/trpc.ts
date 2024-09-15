import { users, notes, files } from "../../db/schema";
import { db } from "../../db/drizzle"
import { v2 as cloudinary } from 'cloudinary';
import { initTRPC } from '@trpc/server';
import { eq } from 'drizzle-orm'; // Import the eq helper from drizzle-orm
import { z } from 'zod';
import { generateRegistrationOptions, verifyRegistrationResponse } from "@simplewebauthn/server";

const t = initTRPC.create();

cloudinary.config({
  cloud_name: "dowfhxbc5",
  api_key: "847558872295218",
  api_secret: "FjY0rvrBnyeRj0y9HElXyBERSdM",
});

export const appRouter = t.router({
    createUser: t.procedure.input(z.object({ email: z.string().email() })).mutation(async ({ input }) => {
        const newUser = await db.insert(users).values({ email: input.email });
        return newUser;
    }),

    // open api
    getUserIds: t.procedure
  .query(async () => {
    const result = await db.select({ id: users.id }).from(users);
    return result.map(user => user.id);
  }),
  getUsers: t.procedure
    .input(z.object({ name: z.string().optional() }))
    .query(async ({ input }) => {
      const userRecords = await db
        .select()
        .from(users)
        .where(input.name ? like(users.name, `%${input.name}%`) : undefined);

      if (!userRecords.length) {
        throw new Error("No users found");
      }

      return userRecords;
    }),

    // Define procedure for creating a note
    createNote: t.procedure.input(z.object({
        userId: z.number(),
        title: z.string(),
        content: z.string(),
    })).mutation(async ({ input }) => {
        const newNote = await db.insert(notes).values({
            userId: input.userId,
            title: input.title,
            content: input.content,
        });
        return newNote;
    }),
    getNotes: t.procedure.query(() => {
        return "hello"
    }),
    // for testing purpose
    // getHello: t.procedure.query(() => {
    //     return 'Hello from tRPC!';
    //   }),
    //   postData: t.procedure
    // .input(
    //   z.object({
    //     message: z.string(),  // Input validation
    //   })
    // )
    // .mutation(({ input }) => {
    //   // Handle the POST data (in a real scenario, you may store it in a DB)
    //   return {
    //     receivedMessage: `Message received: ${input.message}`,
    //   };
    // }),

    // uploadFile: t.procedure.input(z.object({
    //     userId: z.number(),
    //     filename: z.string(),
    //     size: z.number(),
    // })).mutation(async ({ input }) => {
    //     const newFile = await db.insert(files).values({
    //         userId: input.userId,
    //         filename: input.filename,
    //         size: input.size,
    //     });
    //     return newFile;
    // }),
    uploadFile: t.procedure
    .input(z.object({ userId: z.number(), file: z.any() }))
    .mutation(async ({ input }) => {
      const uploadResponse = await cloudinary.uploader.upload(input.file);
      const newFile = await db.insert(files).values({
        userId: input.userId,
        filename: uploadResponse.public_id,
        size: uploadResponse.bytes,
      });
      return newFile;
    }),

    // Fetch user files
    getUserFiles: t.procedure.input(z.object({ userId: z.number() })).query(async ({ input }) => {
        const userFiles = await db.select().from(files).where(eq(files.userId, input.userId));
        return userFiles;
    }),

    registerPassKey: t.procedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
        const user = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
        if (!user[0]) {
            throw new Error("User not found");
        }

        const options = await generateRegistrationOptions({
            rpName: "Test Name",
            rpID: "http://localhost:3000",
            userID: user[0].id as any,
            userName: user[0].email as any,
        });

        await db.update(users).set({ currentChallenge: options.challenge }).where(eq(users.id, user[0].id));

        return options;
    }),

verifyPasskey: t.procedure
  .input(z.object({ email: z.string().email(), response: z.any() }))
  .mutation(async ({ input }) => {
    const user = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
    if (!user[0]) throw new Error("User not found");

    const verification = await verifyRegistrationResponse({
      response: input.response,
      expectedChallenge: user[0].currentChallenge as any,
      expectedOrigin: "https://your-domain.com",
      expectedRPID: "your-domain.com",
    });

    if (verification.verified) {
      return { success: true };
    } else {
      throw new Error("Verification failed");
    }
  }),


});


// Export type-safe API definition
export type AppRouter = typeof appRouter;
