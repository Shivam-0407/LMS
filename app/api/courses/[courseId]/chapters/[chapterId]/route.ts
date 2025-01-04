import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await auth();
    const {isPublished,...values} = await req.json()
    if (!userId) {
      return new NextResponse("Unauthorized access ", { status: 401 });
    }
    const courseOwner = await db.course.findUnique({
      where:{
        id:params.courseId,
        userId
      }
    })
    if(!courseOwner){
      return new NextResponse("Unauthorized access ", { status: 401 });

    }
    const chapter = await db.chapter.update({
      where:{
        id:params.chapterId,
        courseId:params.courseId
      },
      data:{
        ...values
      }
    })
    // todo: handle Video URL update
    return NextResponse.json(chapter)
  } catch (error) {
    console.log("COURSES_CHAPTER_ID", error);
    return new NextResponse("Internal Server Error ", { status: 500 });
  }
}
