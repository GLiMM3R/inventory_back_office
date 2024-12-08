import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import { Upload, Trash2 } from "lucide-react";
import Image from "next/image";
import { IImageWithPreview } from "@/types/image-with-preview";

interface UploadImageProps {
  // onSetValue: Dispatch<SetStateAction<FileSchema | null>>;
  value?: IImageWithPreview | null;
  onStateChange: (value: IImageWithPreview | null) => void;
}

const UploadImage = ({ value, onStateChange }: UploadImageProps) => {
  const [selectedImage, setSelectedImage] = useState<IImageWithPreview | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      setSelectedImage(value);
    }
  }, [value]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type and size
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        alert("Please upload a valid image (JPEG, PNG, or GIF)");
        return;
      }

      if (file.size > maxSize) {
        alert("File is too large. Maximum size is 5MB");
        return;
      }

      // Create a file reader to show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileWithPreview: IImageWithPreview = {
          file: file,
          preview: URL.createObjectURL(file),
        };
        setSelectedImage(() => fileWithPreview);
        onStateChange(fileWithPreview);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-md w-full h-full mx-auto p-4 bg-white rounded-lg shadow-md">
      <div
        className="border-2 w-full h-full border-dashed border-gray-300 rounded-lg p-4 text-center 
        hover:border-primary transition-colors duration-300"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/jpeg,image/png,image/gif"
          className="hidden"
        />

        {selectedImage ? (
          <div className="relative w-full h-full">
            <Image
              src={selectedImage.preview}
              className="w-full h-full mx-auto rounded-lg object-cover"
              width={200}
              height={200}
              alt="Preview"
              onLoad={() => {
                URL.revokeObjectURL(selectedImage.preview);
              }}
            />
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Upload className="text-gray-400 w-12 h-12 mb-4" />
            <p className="text-gray-600">Click to upload image</p>
            <p className="text-xs text-gray-500 mt-2">
              Supports: JPEG, PNG, GIF (Max 5MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadImage;
