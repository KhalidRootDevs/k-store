import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { Icons } from "../icons";

const DropzoneSingle = ({ name }: { name: string }) => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const image = watch(name);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any) => {
      if (fileRejections.length > 0) {
        const sizeError = fileRejections.some((rejection: any) =>
          rejection.errors.some(
            (e: { code: string }) => e.code === "file-too-large"
          )
        );

        if (sizeError) {
          toast.error("Image size exceeds the max limit!");
          setValue(name, "");
        }

        return;
      }
      if (!acceptedFiles?.length) return;

      const file = acceptedFiles[0];
      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      setValue(name, fileWithPreview, {
        shouldValidate: true,
      });
    },
    [name, setValue]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    maxSize: 1024 * 5000, // 5MB
    onDrop,
  });

  return (
    <div className="">
      <input {...getInputProps()} />

      <div className="relative flex flex-col">
        <div
          {...getRootProps()}
          className={`flex h-60 cursor-pointer items-center justify-center overflow-hidden w-full
        bg-white shadow-sm transition duration-200 hover:border-gray-500
        ${image ? "" : "border-2 border-dashed border-gray-300"}`}
        >
          {image ? (
            <>
              <img
                src={image?.preview || image}
                alt="Uploaded"
                className="h-full w-full object-contain"
              />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute -top-2 right-1.5 z-10 rounded-full "
                onClick={(e) => {
                  e.stopPropagation();
                  setValue(name, "", {
                    shouldValidate: true,
                  });
                }}
              >
                <Icons.delete className="h-6 w-5 text-white" />
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center flex-col gap-2">
                <Upload className="mr-1" />
                <span className="text-lg font-bold">
                  Drag and drop or browse to upload file!
                </span>
                <span className="text-sm">
                  Supports JPG, PNG, JPEG (Max. 5MB file)
                </span>
              </div>
            </div>
          )}
        </div>

        {errors[name] && (
          <p className="text-sm text-red-500 mt-2">
            {errors[name].message as string}
          </p>
        )}
      </div>
    </div>
  );
};

export default DropzoneSingle;
