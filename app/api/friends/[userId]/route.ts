import prisma from "@/lib/prisma";
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest){
  try{
    const session = await auth();
  }catch(error){
    return NextResponse.json({ error: "Failed to fetch mutual friends" }, { status: 500 })
  }
}

export async function GET(req: NextRequest){
  try{
    const session = await auth();
  }catch(error){
    return NextResponse.json({ error: "Failed to fetch mutual friends" }, { status: 500 })
  }
}