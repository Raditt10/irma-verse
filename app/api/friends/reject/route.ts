import prisma from "@/lib/prisma";
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
  try{
    const session = await auth();

    if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const User = await prisma.user.findUnique({
    where: { id: session.user.id }
    });
        
    if (!User) {
    console.log('User not found in database:', session.user.id);
    return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { targetId } = await req.json();
    const userId = session.user.id;

    if (userId === targetId) {
      return NextResponse.json("Cannot reject yourself", { status: 400 });
    }
    
    await prisma.friendship.delete({
      where: { id: friendship.id },
    });
  } catch(error){
    return NextResponse.json({ error: "Failed to fetch and reject friendship" }, { status: 500 })
  }
}

