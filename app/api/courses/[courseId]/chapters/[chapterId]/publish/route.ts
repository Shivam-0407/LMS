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
    const chapter = await db.chapter.findUnique({
      where: {
        courseId: params.courseId,
        id: params.chapterId,
      },
    });
    const muxData = await db.muxData.findUnique({
      where: {
        chapterId: params.chapterId,
      },
    });
    if (
      !muxData ||
      !chapter?.title ||
      !chapter?.description ||
      !chapter?.videoUrl
    ) {
      console.log("mux yahh pahata hai ",muxData);
      return new NextResponse("Missing required fields ", { status: 400 });
    }
    const publishedChpater = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        isPublished: true,
      },
    });
    return NextResponse.json(publishedChpater);
  } catch (error) {
    console.log("CHAPTER_PUBLISH ", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
