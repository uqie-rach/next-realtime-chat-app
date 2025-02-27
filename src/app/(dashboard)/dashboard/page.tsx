import { getServerSession } from 'next-auth';

import Button from '@/components/ui/Button';

import { authOptions } from '@/lib/auth';

export default async function Page() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h4>{JSON.stringify(session)}</h4>
      <Button variant="default">test</Button>
    </div>
  );
}
