import { AxiosResponse } from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import sdk, { Permission, Role } from 'node-appwrite';

type MyError = Omit<AxiosResponse, 'data'> & {
  data: { error: { message: string; status: number; step: number; id: string } };
};

// create a bucket
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id, name } = body;

  try {
    const client = new sdk.Client();
    const storage = new sdk.Storage(client);

    client
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_URL!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_LND!)
      .setKey(process.env.NEXT_PUBLIC_APPWRITE_LND_SECRET_KEY!);

    const data = await storage.createBucket(
      id,
      name,
      [
        Permission.create(Role.guests()),
        Permission.read(Role.guests()),
        Permission.update(Role.guests()),
        Permission.delete(Role.guests()),
      ]
      // false
    );

    return NextResponse.json(data);
  } catch (error) {
    const myError = error as MyError;

    return NextResponse.json({ error: { ...myError, step: 2, id } }, { status: 400 });
  }
}

// get bucket files by id
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')!;

  try {
    const client = new sdk.Client();
    const storage = new sdk.Storage(client);

    client
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_URL!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_LND!)
      .setKey(process.env.NEXT_PUBLIC_APPWRITE_LND_SECRET_KEY!);

    const data = await storage.listFiles(id);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
  }
}
