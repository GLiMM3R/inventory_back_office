import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";

interface FileWithPreview extends File {
  preview: string;
}

interface UploadImageProps {
  // You can add any props you need here
}

export function UploadImage(props: UploadImageProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

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
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    },
  };

  const { getRootProps, getInputProps } = useDropzone(dropzoneOptions);

  const removeImage = (file: FileWithPreview) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
    URL.revokeObjectURL(file.preview); // Revoke the URL to avoid memory leaks
  };

  const thumbs = files.map((file) => (
    <div
      key={file.name}
      className="inline-flex border rounded border-gray-200 m-2 w-24 h-24 p-1 box-border relative"
    >
      <div className="flex min-w-0 overflow-hidden">
        <Image
          src={file.preview}
          className="block w-auto h-full"
          width={40}
          height={40}
          alt=""
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
      <button
        onClick={() => removeImage(file)}
        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center"
      >
        &times;
      </button>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <section className="container mx-auto p-4">
      <aside className="mt-4 flex flex-wrap">{thumbs}</aside>
      <div
        {...getRootProps()}
        className="p-4 border-2 border-dashed border-gray-300 text-center rounded-2xl"
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">
          Drag and drop some files here, or click to select files
        </p>
      </div>
    </section>
  );
}
