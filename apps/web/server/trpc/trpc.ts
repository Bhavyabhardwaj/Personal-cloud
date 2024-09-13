import { users, notes, files } from "../../db/schema";
import { db } from "../../db/drizzle"
import { initTRPC } from '@trpc/server';
import { eq } from 'drizzle-orm'; // Import the eq helper from drizzle-orm
import { z } from 'zod';

const t = initTRPC.create();

export const appRouter = t.router({
    createUser: t.procedure.input(z.object({ email: z.string().email() })).mutation(async ({ input }) => {
        const newUser = await db.insert(users).values({ email: input.email });
        return newUser;
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

    getNotes: t.procedure.input(z.object({ userId: z.number() })).query(async ({ input }) => {
        const userNotes = await db.select().from(notes).where(eq(notes.userId, input.userId));
        return userNotes;
    }),

    uploadFile: t.procedure.input(z.object({
        userId: z.number(),
        filename: z.string(),
        size: z.number(),
    })).mutation(async ({ input }) => {
        const newFile = await db.insert(files).values({
            userId: input.userId,
            filename: input.filename,
            size: input.size,
        });
        return newFile;
    }),

    // Fetch user files
    getUserFiles: t.procedure.input(z.object({ userId: z.number() })).query(async ({ input }) => {
        const userFiles = await db.select().from(files).where(eq(files.userId, input.userId));
        return userFiles;
    }),
});

// Export type-safe API definition
export type AppRouter = typeof appRouter;
