import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import { Upload, ImagePlus, Trash2 } from "lucide-react";

interface SelectedImage {
  file: File;
  preview: string;
  id: string;
}

const MultiImageUpload: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
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
        const newImage: SelectedImage = {
          file,
          preview: reader.result as string,
          id: `${file.name}-${Date.now()}`,
        };

        setSelectedImages((prev) => {
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

  const handleRemoveImage = (id: string) => {
    setSelectedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleUpload = () => {
    selectedImages.forEach((image) => {
      console.log("Uploading file:", image.file);
      // Actual upload logic would go here
    });
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <div
        className={`border-2 ${
          isDragOver
            ? "border-blue-500 bg-blue-50"
            : "border-dashed border-gray-300"
        } 
        rounded-lg p-6 text-center transition-colors duration-300 hover:border-blue-500`}
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

        {selectedImages.length === 0 ? (
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
          <div className="grid grid-cols-3 gap-4">
            {selectedImages.map((image) => (
              <div key={image.id} className="relative">
                <img
                  src={image.preview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg"
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
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-32 hover:border-blue-500"
              // onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus className="text-gray-400" />
            </div>
          </div>
        )}
      </div>

      {selectedImages.length > 0 && (
        <button
          onClick={handleUpload}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg 
          hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center"
        >
          <ImagePlus className="mr-2" size={20} />
          Upload {selectedImages.length} Image
          {selectedImages.length > 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
};

export default MultiImageUpload;
