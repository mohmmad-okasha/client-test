import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import connectToDatabase from '@/models/mongodb';
import userModel from '@/models/Users';

export async function GET() {
  await connectToDatabase();
  const data = await userModel.find();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  await connectToDatabase();
  const { name, email, password, rules } = await request.json();

  const finded = await userModel.findOne({ name });
  if (finded) return NextResponse.json({ message: finded.name + ' Already Exist!' });

  const newUser = new userModel({
    _id: new mongoose.Types.ObjectId(),
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    rules,
  });

  await newUser.save();
  return NextResponse.json({ message: 'Saved!' });
}

export async function PUT(request: Request) {
  await connectToDatabase();
  const { _id, name, email, password, rules } = await request.json();
  const updatedUser = await userModel.findByIdAndUpdate(
    _id,
    {
      name,
      email,
      password: bcrypt.hashSync(password, 10),
      rules,
    },
    { new: true }
  );

  if (!updatedUser) {
    return NextResponse.json({ message: 'User not found!' });
  }

  return NextResponse.json({ message: 'Updated!' });
}
