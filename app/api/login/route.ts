import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
//import jwt from 'jsonwebtoken'

import mongoose from "mongoose";
import connectToDatabase from "@/models/mongodb";
import userModel from "@/models/Users";

export async function POST(request: Request) {
  await connectToDatabase();
  const { name, password } = await request.json();

  const data = await userModel.findOne({ name });
  if (!data) return NextResponse.json({ message: "User not exist" });

  const IsPasswordValid = await bcrypt.compare(password, data.password);
  if (!IsPasswordValid) {
    return NextResponse.json({ message: "Password not valid" });
  }

  const token = 'dfgdfgdfgdf'
  return NextResponse.json({token, 'userName': data.name});
}

