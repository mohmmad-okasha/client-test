import { NextResponse } from 'next/server';
import connectToDatabase from '@/models/mongodb';
import userModel from '@/models/Users';

export async function GET() {
  await connectToDatabase();
  try {
    const data = await userModel.find();
    const options = data.map(user => ({
      label: user.name,
      value: user.name,
    }));
    return NextResponse.json(options);
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
