import { Upload } from "lucide-react";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";

interface FileWithPreview extends File {
  preview: string;
}

interface UploadImageProps {
  values: FileWithPreview[];
  onSetValues: Dispatch<SetStateAction<FileWithPreview[]>>;
  // onSetValue: (files: FileWithPreview[]) => void;
}

export function UploadImage({ values, onSetValues }: UploadImageProps) {
  // const [files, setFiles] = useState<FileWithPreview[]>([]);

  const dropzoneOptions: DropzoneOptions = {
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ) as FileWithPreview[];
      onSetValues((prevFiles) => [...prevFiles, ...newFiles]);
      // props.onSetValue([...files, ...newFiles]);
    },
  };

  const { getRootProps, getInputProps } = useDropzone(dropzoneOptions);

  const removeImage = (file: FileWithPreview) => {
    onSetValues((prevFiles) => prevFiles.filter((f) => f !== file));
    URL.revokeObjectURL(file.preview); // Revoke the URL to avoid memory leaks
  };

  const thumbs = values.map((file) => (
    <div
      key={file.name}
      className="inline-flex border rounded border-gray-200 m-2 w-36 h-36 p-1 box-border relative justify-center"
    >
      <div className="flex min-w-0 overflow-hidden">
        <Image
          src={file.preview}
          className="block object-contain w-auto h-full"
          width={50}
          height={50}
          alt=""
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
      <button
        onClick={() => removeImage(file)}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
      >
        &times;
      </button>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => values.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [values]);

  return (
    <section className="container mx-auto p-4">
      <div
        {...getRootProps()}
        className="p-8 border-2 border-dashed border-gray-300 bg-neutral-200 text-center rounded-2xl"
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">
          Drag and drop some files here, or click to select files
        </p>
      </div>
      <aside className="mt-4 flex flex-wrap">{thumbs}</aside>
    </section>
  );
}
