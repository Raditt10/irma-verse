import prisma from "@/lib/prisma";
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
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
    
    const { requesterId } = await req.json();
    const userId = session.user.id;

    const friendship = await prisma.friendship.findFirst({
      where: {
        requesterId,
        addresseeId: userId,
        status: "PENDING",
      },
    });

    if (!friendship) {
      return NextResponse.json("Invalid request", { status: 400 });
    }

    const updated = await prisma.friendship.update({
      where: { id: friendship.id },
      data: { status: "Accepted" },
    });

    return Response.json(updated);
  } catch(error){
    return NextResponse.json({ error: "Failed to fetch and accept request"}, { status: 500})
  }
}