import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Updated import for App Router

export default function AuthButton() {
  const { data: session } = useSession();
  const router = useRouter();

  async function handleSignIn() {
    const res = await signIn('credentials', { redirect: false });
    if (res && res.ok) {
      router.push('/dashboard'); // Same routing logic
    }
  }

  return (
    <div>
      {session ? (
        <button onClick={() => signOut()} className="p-2 bg-red-500 text-white rounded">
          Sign Out
        </button>
      ) : (
        <button onClick={handleSignIn} className="p-2 bg-blue-500 text-white rounded">
          Sign In with Passkey
        </button>
      )}
    </div>
  );
}
