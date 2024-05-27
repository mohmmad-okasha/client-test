import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/models/mongodb";
import logModel from "@/models/Logs";

export async function GET() {
  await connectToDatabase();
  let data = await logModel.find();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  await connectToDatabase();
  const newLog = new logModel({
    _id: new mongoose.Types.ObjectId(),
    ...body, // Get all data from req.body
  });

  await newLog.save();
  return NextResponse.json({ message: "Log Saved!" });
}

