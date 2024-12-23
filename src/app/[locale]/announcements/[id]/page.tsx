export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const annoucementId = (await params).id;
  return <div>My Post: {annoucementId}</div>;
}
