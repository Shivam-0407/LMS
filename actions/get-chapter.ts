import { db } from "@/lib/db";
import { Attachement, Chapter } from "@prisma/client";

interface GetChapterProps {
  userId: string;
  courseId: string;
  chapterId: string;
}

export const getChapter = async ({
  userId,
  courseId,
  chapterId,
}: GetChapterProps) => {
  try {
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });
    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
      select: {
        price: true,
      },
    });
    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
    });
    if (!chapter || !course) {
      throw new Error("Chapter or Course not found!!");
    }
    let muxData = null;
    let attachements: Attachement[] = [];
    let nextChapter: Chapter | null = null;

    if (purchase) {
      // only after the user purchased the course are we going to fetch the muxData,attachements,nextChapter that will be displayed to the student
      attachements = await db.attachement.findMany({
        where: {
          courseId,
        },
      });
    }
    if (chapter.isFree || purchase) {
      muxData = await db.muxData.findUnique({
        where: {
          chapterId,
        },
      });
      nextChapter = await db.chapter.findFirst({
        where: {
          courseId: courseId,
          isPublished: true,
          position: {
            gt: chapter?.position,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    }
    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    });
    return {
      chapter,
      course,
      attachements,
      muxData,
      nextChapter,
      userProgress,
      purchase,
    };
  } catch (error) {
    console.log("GET_CHAPTER", error);
    return {
      chapter: null,
      muxData: null,
      course: null,
      attachements: [],
      nextChapter: null,
      userProgress: null,
      purchase: null,
    };
  }
};
