import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();
    const data = await req.json();
    const url  = data.url
    if (!userId) {
      return new NextResponse("Unauthorized Error", { status: 401 });
    }
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });
    console.log('ho ho ho')
    if (!courseOwner) {
      return new NextResponse("Unauthorized Error", { status: 401 });
    }
    console.log('url is ',url.url)
    const attachement = await db.attachement.create({
      data:{
        url,
        name:url.split("/").pop(),
        courseId:params.courseId
      }
    })

    return NextResponse.json(attachement)
  } catch (error) {
    console.log("COURSE_ID_ATTACHEMENTS ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
