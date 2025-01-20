import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(
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
        id: params.chapterId,
        courseId: params.courseId,
      },
    });
    if (!chapter) {
      return new NextResponse("Chapter not found", { status: 404 });
    }

    // todo: handle Video URL delete
    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });
      if (existingMuxData) {
        await video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }
    }
    const deletedChapter = await db.chapter.delete({
      where: {
        id: params.chapterId,
      },
    });

    const publishedChapterInCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    if (!publishedChapterInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }
    return NextResponse.json(deletedChapter);
    //return "ok ok";
  } catch (error) {
    console.log("CHAPTER_ID_DELETE", error);
    return new NextResponse("Internal Server Error ", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await auth();
    const { ...values } = await req.json();
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
    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
      },
    });

    // todo: handle Video URL update
    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });
      if (existingMuxData) {
        try {
          const isvideoPresentInMUX = await video.assets.retrieve(
            existingMuxData.assetId
          );
          if (isvideoPresentInMUX) {
            await video.assets.delete(existingMuxData.assetId);
          }
        } catch (error) {
          console.log("Video got deleted after 24 hrs", error);
        } finally {
          // we are now finally deleting the muxData from the database
          await db.muxData.delete({
            where: {
              id: existingMuxData.id,
            },
          });
        }
      }
      const asset = await video.assets.create({
        // now uploading a new video
        input: values.videoUrl,
        playback_policy: ["public"],
        test: false,
      });
      await db.muxData.create({
        // now creating a new muxData for the new video
        data: {
          chapterId: params.chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
        },
      });
    }
    return NextResponse.json(chapter);
  } catch (error) {
    console.log("COURSES_CHAPTER_ID", error);
    return new NextResponse("Internal Server Error ", { status: 500 });
  }
}
