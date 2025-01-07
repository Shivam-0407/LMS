import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized access ", { status: 401 });
    }
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });
    if (!courseOwner) {
      return new NextResponse("Unauthorized access ", { status: 401 });
    }

    const unpublishedChpater = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        isPublished: false,
      },
    });
    const publishedChpaterInCourse = await db.chapter.findMany({
      where:{
        courseId:params.courseId,
        isPublished:true
      }
    })
    if(!publishedChpaterInCourse.length){
      await db.course.update({
        where:{
          id:params.courseId
        },
        data:{
          isPublished:false
        }
      })
    }
    return NextResponse.json(unpublishedChpater);
  } catch (error) {
    console.log("CHAPTER_UNPUBLISH ", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
