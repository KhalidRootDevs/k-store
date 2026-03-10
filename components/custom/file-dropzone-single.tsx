import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';

import { Icons } from '@/components/icons';
import Image from 'next/image';
import PDFViewer from './pdf-viewer';

type DropzoneSingleFileProps = {
  name: string;
  disabled?: boolean;
  maxSize?: number;
  accept?: Record<string, string[]>;
  dialogTitle?: string;
  dialogDescription?: string;
};

const DropzoneSingleFile = ({
  name,
  disabled = false,
  maxSize = 3 * 1024 * 1024, // 3MB default
  accept = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc', '.docx'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
      '.docx'
    ],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
      '.xlsx'
    ]
  },
  dialogTitle = 'Document Preview',
  dialogDescription = 'Preview of the uploaded document.'
}: DropzoneSingleFileProps) => {
  const {
    watch,
    setValue,
    formState: { isSubmitting }
  } = useFormContext();

  const file = watch(name);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isFieldDisabled = disabled || isSubmitting;

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any) => {
      if (fileRejections.length > 0) {
        const sizeError = fileRejections.some((rejection: any) =>
          rejection.errors.some(
            (e: { code: string }) => e.code === 'file-too-large'
          )
        );

        const typeError = fileRejections.some((rejection: any) =>
          rejection.errors.some(
            (e: { code: string }) => e.code === 'file-invalid-type'
          )
        );

        if (sizeError) {
          toast.error(
            `File size exceeds the max limit of ${maxSize / 1024 / 1024}MB!`
          );
        }

        if (typeError) {
          const acceptedTypes = Object.values(accept).flat().join(', ');
          toast.error(`Invalid file type. Accepted types: ${acceptedTypes}`);
        }
        return;
      }

      if (!acceptedFiles?.length) return;

      const uploadedFile = acceptedFiles[0];
      const fileWithPreview = Object.assign(uploadedFile, {
        preview: URL.createObjectURL(uploadedFile)
      });

      setValue(name, fileWithPreview, {
        shouldValidate: true,
        shouldDirty: true
      });
    },
    [name, setValue, maxSize, accept]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxSize,
    onDrop,
    disabled: isFieldDisabled,
    multiple: false
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Revoke object URL to prevent memory leaks
    if (file?.preview) {
      URL.revokeObjectURL(file.preview);
    }

    setValue(name, '', {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isPdf) {
      setIsModalOpen(true);
    } else if (fileUrl) {
      // For non-PDF files, download or open in new tab
      window.open(fileUrl, '_blank');
    }
  };

  const fileName =
    typeof file === 'string'
      ? file.split('/').pop()
      : file?.name || 'No file selected';

  const fileUrl = typeof file === 'string' ? file : file?.preview;
  const isPdf = fileName?.toLowerCase().endsWith('.pdf');
  const isDoc = fileName?.toLowerCase().match(/\.(doc|docx)$/);
  const isExcel = fileName?.toLowerCase().match(/\.(xls|xlsx)$/);

  // Get appropriate icon based on file type
  const getFileIcon = () => {
    if (isPdf) return '/pdf.png';
    if (isDoc) return '/doc.png'; // You might want to add doc.png icon
    if (isExcel) return '/excel.png'; // You might want to add excel.png icon
    return '/file.png'; // Generic file icon
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getAcceptedTypesText = () => {
    const types = Object.values(accept).flat();
    return types.map((type) => type.replace('.', '')).join(', ');
  };

  return (
    <>
      <div {...getRootProps()}>
        <div
          className={`
            relative flex min-h-40 w-full items-center justify-center rounded-xl border-2 border-dashed 
            transition-all duration-200
            ${
              isFieldDisabled
                ? 'cursor-not-allowed opacity-60'
                : 'cursor-pointer hover:border-gray-500'
            }
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          `}
        >
          {file ? (
            <div className="w-full p-4">
              <div className="flex flex-col items-center justify-center gap-3">
                <Image
                  src={getFileIcon()}
                  alt="file-icon"
                  height={70}
                  width={70}
                  onClick={handlePreview}
                  className={`cursor-pointer transition-transform hover:scale-105 ${
                    isFieldDisabled ? 'cursor-not-allowed' : ''
                  }`}
                />

                {/* File info */}
                <div className="text-center">
                  <p className="max-w-[200px] truncate text-sm font-medium">
                    {fileName}
                  </p>
                  {file.size && (
                    <p className="mt-1 text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  )}
                </div>

                {/* Preview button for PDF */}
                {isPdf && !isFieldDisabled && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handlePreview}
                    disabled={isFieldDisabled}
                  >
                    Preview Document
                  </Button>
                )}
              </div>

              {!isFieldDisabled && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-2 hover:bg-destructive/10"
                  onClick={handleRemove}
                  disabled={isFieldDisabled}
                >
                  <Icons.delete className="h-5 w-5 text-destructive" />
                </Button>
              )}
            </div>
          ) : (
            <div className="p-4 text-center">
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center gap-2 text-sm">
                <Image
                  src="/pdf.png"
                  alt="file-upload-icon"
                  height={70}
                  width={70}
                  className={`${isFieldDisabled ? 'opacity-50' : ''}`}
                />

                <div className="space-y-1">
                  <p
                    className={`font-medium ${
                      isFieldDisabled ? 'text-gray-400' : 'text-gray-700'
                    }`}
                  >
                    {isDragActive
                      ? 'Drop the file here'
                      : 'Click to upload or drag and drop'}
                  </p>
                  <p
                    className={`text-xs ${
                      isFieldDisabled ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {getAcceptedTypesText()} (Max {formatFileSize(maxSize)})
                  </p>
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

      {/* PDF Preview Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="h-[80vh] max-w-5xl">
          <div className="flex h-full w-full flex-col">
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
              <DialogDescription>{dialogDescription}</DialogDescription>
            </DialogHeader>

            <div className="min-h-0 flex-1">
              <PDFViewer link={fileUrl} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DropzoneSingleFile;
