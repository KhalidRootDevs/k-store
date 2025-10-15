import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import { Icons } from "../icons";

const DropzoneSingle = ({ name }: { name: string }) => {
  const [isSizeError, setIsSizeError] = useState(false);
  const { watch, setValue } = useFormContext();
  const image = watch(name);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any) => {
      setIsSizeError(false);

      if (fileRejections.length > 0) {
        const sizeError = fileRejections.some((rejection: any) =>
          rejection.errors.some(
            (e: { code: string }) => e.code === "file-too-large"
          )
        );

        if (sizeError) {
          setIsSizeError(true);
          setValue(name, "");
        }

        return;
      }
      if (!acceptedFiles?.length) return;

      const file = acceptedFiles[0];
      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      setValue(name, fileWithPreview);
    },
    [name, setValue]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    maxSize: 1024 * 1000, // 1MB
    onDrop,
  });

  return (
    <div className="flex items-center justify-center">
      <input {...getInputProps()} />

      <div className="relative flex flex-col items-center">
        <div
          {...getRootProps()}
          className={`flex h-40 w-40 cursor-pointer items-center justify-center overflow-hidden rounded-full
        bg-white shadow-sm transition duration-200 hover:border-gray-500
        ${image ? "" : "border-2 border-dashed border-gray-300"}`}
        >
          {image ? (
            <>
              <img
                src={image?.preview || image}
                alt="Uploaded"
                className="h-full w-full object-cover"
              />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute -top-2 right-1.5 z-10 rounded-full "
                onClick={(e) => {
                  e.stopPropagation();
                  setValue(name, "");
                }}
              >
                <Icons.delete className="h-6 w-5 text-white" />
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black shadow-md">
                <span className="text-2xl font-bold text-white">+</span>
              </div>
            </div>
          )}
        </div>

        {isSizeError && (
          <p className="mt-2 w-52 text-center text-sm font-semibold text-red-600">
            The image size exceeds the max limit (1MB).
          </p>
        )}
      </div>
    </div>
  );
};

export default DropzoneSingle;
