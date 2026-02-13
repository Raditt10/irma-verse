import prisma from "@/lib/prisma";
import { FriendshipStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
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

    const { targetId } = await req.json();
    const userId = session.user.id;

    if (userId === targetId) {
      return NextResponse.json("Cannot friend yourself", { status: 400 });
    }

    // Check existing relationship
    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: userId, addresseeId: targetId },
          { requesterId: targetId, addresseeId: userId },
        ],
      },
    });

    if (existing) {
      return NextResponse.json("Relationship already exists", { status: 400 });
    }

    const friendship = await prisma.friendship.create({
      data: {
        requesterId: userId,
        addresseeId: targetId,
        status: "Pending" as FriendshipStatus,
      },
    });

    return NextResponse.json(friendship);
  } catch(error){
    return NextResponse.json({ error: "Failed to fetch and request friendship" }, { status: 500 })
  }
}

export async function GET(req: NextRequest){
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
    };

    const friendreqs = await prisma.user.findMany({
      where: { 
        friendship: { requesterId: User.id } 
      },
      select: {
        id: true,
        name: true,
        role: true,
        class: true,
        avatar: true
      }
    });

    return NextResponse.json(friendreqs)
  }catch(error){
    return NextResponse.json({ error: "Failed to fetch friend requests" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest){
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

    // check if friendship request is exists
    const friendship = await prisma.friendship.findFirst({
      where: {
        requesterId: userId,
        addresseeId: targetId,
        status: "Pending",
      },
    });

    if (!friendship) {
      return NextResponse.json("No existing request from this user", { status: 400 });
    }
    
    const reject = await prisma.friendship.delete({
      where: { 
        requesterId: friendship.id,
        addresseeId: targetId,
      },
    });

    return 
  } catch(error){
    return NextResponse.json({ error: "Failed to fetch and reject friendship" }, { status: 500 })
  }
}