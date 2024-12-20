import { verifySession } from '../../lib/dal';

export default async function ProfilePage() {
  const { userId } = await verifySession();

  return (
    <div>
      <h1>Profile page</h1>
      <p>User ID: {userId}</p>
    </div>
  );
}
