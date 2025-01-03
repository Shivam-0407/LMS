"use client";
import { z } from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  File,
  Loader2,
  PlusCircleIcon,
  X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachement, Course } from "@prisma/client";
import { FileUpload } from "@/app/(dashboard)/_components/file-upload";

interface AttachemntFormProps {
  initialData: Course & { attachements: Attachement[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});

export const AttachemntForm = ({
  initialData,
  courseId,
}: AttachemntFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachements`, values);
      toast.success("Course Updated Successfully");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong!");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      console.log("attachement id ", id);
      await axios.delete(`/api/courses/${courseId}/attachements/${id}`);
      toast.success("Attachement Deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="flex font-medium items-center justify-between">
        Course attachements
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircleIcon className="h-4 w-4 mr-2" />
              Add a File
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachements.length === 0 && (
            <p className="tex-sm mt-2 text-slate-500 italic">
              No attachements yet
            </p>
          )}
          {initialData.attachements.length > 0 && (
            <div className="space-y-2">
              {initialData.attachements.map((attachement) => (
                <div
                  key={attachement.id}
                  className="flex justify-between items-center p-3 w-full bg-sky-100 border border-sky-200 text-sky-700 rounded-md"
                >
                  <div className="flex items-center">
                    <File className="h-4 w-4 mr-2 flex-shrink-0 " />
                    <p>
                      {attachement.name.length > 30
                        ? `${attachement.name.slice(0, 29)}...`
                        : attachement.name}
                    </p>
                  </div>
                  {deletingId === attachement.id && (
                    <div className="">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== attachement.id && (
                    <button
                      className="ml-auto hover:opacity-75 transition"
                      onClick={() => onDelete(attachement.id)}
                    >
                      <X className="h-4 w-4 " />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachement"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add anything your student might need to complete the course
          </div>
        </div>
      )}
    </div>
  );
};

//15:00
