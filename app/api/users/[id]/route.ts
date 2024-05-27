import { NextResponse } from 'next/server';
import connectToDatabase from '@/models/mongodb';
import userModel from '@/models/Users';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const data = await userModel.findOne({ name: params.id });
  return NextResponse.json(data);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const { id } = params;
  const deletedItem = await userModel.findByIdAndDelete(id);
  if (deletedItem) {
    return NextResponse.json({ message: 'User deleted successfully' });
  } else {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }
}
