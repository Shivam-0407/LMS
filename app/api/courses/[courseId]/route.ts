import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();
    const { courseId } = params;
    const values = await req.json();
    if (!userId) {
      return new NextResponse("Unatuhorized ", { status: 401 });
    }
    console.log('course id is ... ',courseId)
    const course = await db.course.update({
      where:{
        id:courseId,
        userId
      },data:{
        ...values
      }
    })
    return NextResponse.json(course)
  } catch (error) {
    console.log("Course[ID]", error);
    return new NextResponse("Internal Error ", { status: 500 });
  }
}
