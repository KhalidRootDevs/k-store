import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";

type DropzoneSingleProps = {
  name: string;
  disabled?: boolean;
  maxSize?: number;
  accept?: Record<string, string[]>;
};

const DropzoneSingle = ({
  name,
  disabled = false,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = { "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"] },
}: DropzoneSingleProps) => {
  const {
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useFormContext();

  const image = watch(name);
  const isFieldDisabled = disabled || isSubmitting;

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any) => {
      if (fileRejections.length > 0) {
        const sizeError = fileRejections.some((rejection: any) =>
          rejection.errors.some(
            (e: { code: string }) => e.code === "file-too-large"
          )
        );

        const typeError = fileRejections.some((rejection: any) =>
          rejection.errors.some(
            (e: { code: string }) => e.code === "file-invalid-type"
          )
        );

        if (sizeError) {
          toast.error(
            `Image size exceeds the max limit of ${maxSize / 1024 / 1024}MB!`
          );
        }

        if (typeError) {
          const acceptedTypes = Object.values(accept).flat().join(", ");
          toast.error(`Invalid file type. Accepted types: ${acceptedTypes}`);
        }

        setValue(name, "", { shouldValidate: true });
        return;
      }

      if (!acceptedFiles?.length) return;

      const file = acceptedFiles[0];

      // Validate file type client-side as additional safety
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file");
        setValue(name, "", { shouldValidate: true });
        return;
      }

      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      setValue(name, fileWithPreview, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [name, setValue, maxSize, accept]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxSize,
    onDrop,
    disabled: isFieldDisabled,
    multiple: false,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Revoke object URL to prevent memory leaks
    if (image?.preview) {
      URL.revokeObjectURL(image.preview);
    }

    setValue(name, "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-full">
      <input {...getInputProps()} />

      <div className="relative flex flex-col">
        <div
          {...getRootProps()}
          className={`
            flex h-60 w-full cursor-pointer items-center justify-center overflow-hidden
            bg-white shadow-sm transition-all duration-200
            ${
              isFieldDisabled
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer hover:border-gray-500"
            }
            ${
              image
                ? "border border-gray-300 rounded-md"
                : `border-2 border-dashed border-gray-300 rounded-md ${
                    isDragActive ? "border-blue-500 bg-blue-50" : ""
                  }`
            }
          `}
        >
          {image ? (
            <>
              <img
                src={image?.preview || image}
                alt="Uploaded preview"
                className="h-full w-full object-contain"
                onLoad={() => {
                  // Revoke object URL after image loads to free memory
                  if (image?.preview) {
                    URL.revokeObjectURL(image.preview);
                  }
                }}
              />
              {!isFieldDisabled && (
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 z-10 h-6 w-6 rounded-full"
                  onClick={handleRemove}
                  disabled={isFieldDisabled}
                >
                  <X className="h-3 w-3 text-white" />
                </Button>
              )}

              {/* File info overlay */}
              {image?.name && (
                <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs p-2 rounded">
                  <div className="truncate">{image.name}</div>
                  <div>{formatFileSize(image.size)}</div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <div className="flex flex-col items-center justify-center gap-2">
                <Upload
                  className={`h-8 w-8 ${
                    isFieldDisabled ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <div className="space-y-1">
                  <span
                    className={`text-lg font-bold block ${
                      isFieldDisabled ? "text-gray-400" : "text-gray-700"
                    }`}
                  >
                    {isDragActive
                      ? "Drop the image here"
                      : "Drag and drop or browse to upload"}
                  </span>
                  <span
                    className={`text-sm block ${
                      isFieldDisabled ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Supports {Object.values(accept).flat().join(", ")} (Max.{" "}
                    {formatFileSize(maxSize)})
                  </span>
                </div>
                {!isFieldDisabled && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    disabled={isFieldDisabled}
                  >
                    Browse Files
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DropzoneSingle;
