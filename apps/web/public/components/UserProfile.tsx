import { useSession } from 'next-auth/react';

export default function UserProfile() {
  const { data: session } = useSession();

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h2 className="text-xl font-bold">User Profile</h2>
      {session ? (
        <div>
          <p><strong>Email:</strong> {session.user?.email}</p>
          <p><strong>ID:</strong> {session.user?.id}</p>
        </div>
      ) : (
        <p>Please sign in to view your profile.</p>
      )}
    </div>
  );
}
