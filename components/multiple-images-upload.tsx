import React, {
  useState,
  useRef,
  ChangeEvent,
  DragEvent,
  Dispatch,
  SetStateAction,
} from "react";
import { Upload, ImagePlus, Trash2 } from "lucide-react";
import { IFileWithPreview } from "@/types/file-with-preview.type";
import Image from "next/image";

interface SelectedImage {
  file: File;
  preview: string;
  id: string;
}

interface UploadImagesProps {
  values: IFileWithPreview[];
  onSetValues: Dispatch<SetStateAction<IFileWithPreview[]>>;
}

const MultiImageUpload: React.FC<UploadImagesProps> = ({
  values,
  onSetValues,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = (files: FileList | File[]) => {
    Array.from(files).forEach((file) => {
      const allowedTypes: string[] = ["image/jpeg", "image/png", "image/gif"];
      const maxSize: number = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        alert(`Invalid file type for ${file.name}`);
        return;
      }

      if (file.size > maxSize) {
        alert(`${file.name} is too large. Maximum size is 5MB`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage: IFileWithPreview = {
          file,
          preview: reader.result as string,
          id: `${file.name}-${Date.now()}`,
        };

        onSetValues((prev) => {
          const isDuplicate = prev.some(
            (img) => img.file.name === file.name && img.file.size === file.size
          );

          return isDuplicate ? prev : [...prev, newImage];
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      processFiles(files);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);

    const files = event.dataTransfer?.files;
    if (files) {
      processFiles(files);
    }
  };

  const handleRemoveImage = (id?: string) => {
    if (id) {
      onSetValues((prev) => prev.filter((img) => img.id !== id));
    }
  };

  const handleUpload = () => {
    values.forEach((image) => {
      console.log("Uploading file:", image.file);
      // Actual upload logic would go here
    });
  };

  return (
    <div className="w-full h-full p-4 bg-white rounded-lg shadow-md">
      <div
        className={`border-2 ${
          isDragOver
            ? "border-primary bg-blue-50"
            : "border-dashed border-gray-300"
        } 
        w-full h-full rounded-lg p-6 text-center transition-colors duration-300 hover:border-primary`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept="image/jpeg,image/png,image/gif"
          multiple
          className="hidden"
        />

        {values.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <Upload className="text-gray-400 w-12 h-12 mb-4" />
            <p className="text-gray-600">
              Drag and drop or click to upload images
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Supports: JPEG, PNG, GIF (Max 5MB each)
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-4">
            {values.map((image) => (
              <div key={image.id} className="relative w-full aspect-square ">
                <Image
                  src={image.preview}
                  className="w-full h-full mx-auto rounded-lg object-cover"
                  width={200}
                  height={200}
                  alt="Preview"
                  onLoad={() => {
                    URL.revokeObjectURL(image.preview);
                  }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(image.id);
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <div className="aspect-square w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-primary">
              <ImagePlus className="text-gray-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiImageUpload;
