import http from "@/lib/request";
import { useMutation } from "@tanstack/react-query";

type Payload = {
  presignUrl: string;
  file: File;
};

const uploadS3 = async ({ presignUrl, file }: Payload) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    await http.put(presignUrl, file);
  } catch (error) {
    throw new Error("Failed to upload file");
  }
};

export const useUploadS3 = () => {
  const mutation = useMutation({
    mutationFn: async (payload: Payload) => {
      await uploadS3(payload);
    },
  });

  return mutation;
};
