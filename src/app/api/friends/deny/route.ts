import { AxiosError } from 'axios';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = await getServerSession(authOptions)

    if (!session)
      throw new Response('Unauthorized', { status: 401 })

    const { id: idToDeny } = z.object({ id: z.string() }).parse(body)
    await db.srem(`user:${session.user?.id}:incoming_friend_requests`, idToDeny)

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.log("Error on /api/friends/deny", error)

    if (error instanceof z.ZodError)
      return new Response('Invalid Request Payload', { status: 422 })

    if (error instanceof AxiosError)
      return new Response('Invalid request', { status: 400 })
  }
}
