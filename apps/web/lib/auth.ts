// apps/web/src/lib/auth.ts
import { generateAuthenticationOptions, generateRegistrationOptions, verifyAuthenticationResponse, verifyRegistrationResponse } from '@simplewebauthn/server';
import { db } from '../db/drizzle';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export async function startRegistration(email: string) {
  const user = await db.select().from(users).where(eq(users.email, email)).execute();
  
  if (!user) {
    throw new Error('User not found');
  }

  const options = await generateRegistrationOptions({
    rpName: 'Cloud Storage App',
    rpID: process.env.NEXT_PUBLIC_DOMAIN!,
    userID: user.id,
    userName: user.email,
    attestationType: 'none',
  });

  // Save challenge to database
  await db.update(users).set({ currentChallenge: options.challenge }).where(eq(users.id, user.id)).execute();

  return options;
}

export async function verifyRegistration(email: string, response: any) {
  const user = await db.select().from(users).where(eq(users.email, email)).execute();
  
  if (!user) {
    throw new Error('User not found');
  }

  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge: user.currentChallenge,
    expectedOrigin: process.env.NEXT_PUBLIC_DOMAIN!,
    expectedRPID: process.env.NEXT_PUBLIC_DOMAIN!,
  });

  if (verification.verified) {
    // Save the credential to the database
    await db.update(users).set({ 
      credential: JSON.stringify(verification.registrationInfo) 
    }).where(eq(users.id, user.id)).execute();
  }

  return verification.verified;
}

export async function startAuthentication(email: string) {
  const user = await db.select().from(users).where(eq(users.email, email)).execute();
  
  if (!user) {
    throw new Error('User not found');
  }

  const options = await generateAuthenticationOptions({
    rpID: process.env.NEXT_PUBLIC_DOMAIN!,
    allowCredentials: [{ id: Buffer.from(user.credential.id, 'base64'), type: 'public-key' }],
  });

  // Save challenge to database
  await db.update(users).set({ currentChallenge: options.challenge }).where(eq(users.id, user.id)).execute();

  return options;
}

export async function verifyAuthentication(email: string, response: any) {
  const user = await db.select().from(users).where(eq(users.email, email)).execute();
  
  if (!user) {
    throw new Error('User not found');
  }

  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge: user.currentChallenge,
    expectedOrigin: process.env.NEXT_PUBLIC_DOMAIN!,
    expectedRPID: process.env.NEXT_PUBLIC_DOMAIN!,
    authenticator: user.credential,
  });

  return verification.verified;
}