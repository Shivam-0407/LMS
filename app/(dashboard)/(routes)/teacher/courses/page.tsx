import { Button } from "@/components/ui/button";
import Link from "next/link";


const CoursePage = () => {
  return (
    <div className="p-4">
      <Link href="/teacher/create">
        <Button>New Courses</Button>
      </Link>
    </div>
  );
};

export default CoursePage;
