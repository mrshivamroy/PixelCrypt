import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  let key = user.publicMetadata.pixelKey;

  if (!key) {
    key = randomBytes(16).toString('hex');
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { pixelKey: key }
    });
  }

  return NextResponse.json({ key });
}