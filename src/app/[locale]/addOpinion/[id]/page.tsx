import { getUserById } from '@/src/app/lib/actions';
import AddOpinionForm from '@/src/app/ui/opinions/add-opinion-form';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const forUserId = (await params).id;
  const user = await getUserById(forUserId);
  return <AddOpinionForm user={user} />;
}
