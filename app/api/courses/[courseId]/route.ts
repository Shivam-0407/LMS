import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();
    const { courseId } = params;
    if (!userId) {
      return new NextResponse("Unatuhorized ", { status: 401 });
    }
    console.log("course id is ... ", courseId);
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });
    if (!course) {
      return new NextResponse("Not found ", { status: 404 });
    }
    for(const chapter of course.chapters){
      if(chapter.muxData?.assetId){
        await video.assets.delete(chapter.muxData.assetId) // manually deleting assets from MUX
      }
    }

    const deletedCourse = await db.course.delete({
      where:{
        id:params.courseId
      }
    })

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log("Course[ID]_DELETE", error);
    return new NextResponse("Internal Error ", { status: 500 });
  }
}

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
    console.log("course id is ... ", courseId);
    const course = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        ...values,
      },
    });
    return NextResponse.json(course);
  } catch (error) {
    console.log("Course[ID]", error);
    return new NextResponse("Internal Error ", { status: 500 });
  }
}
