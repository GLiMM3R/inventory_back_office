import { base_url } from "@/constants/base_url";
import { toast } from "@/hooks/use-toast";
import http from "@/lib/request";
import { Response } from "@/types/reponse";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const uploadFiles = async (files: File[]) => {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const res = await http.post<Response<string[]>>(
      `${base_url}/files/multiple?type=products`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (res.status !== 200) {
      throw new Error("Failed to upload");
    }

    return res.data.data;
  } catch (error) {
    throw new Error("Failed to upload");
  }
};

export const useUploadFiles = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (files: File[]) => {
      return await uploadFiles(files);
    },
    onSuccess: () => {
      toast({
        description: "Product created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      toast({
        description: "uploade failed!",
      });
    },
  });

  return mutation;
};
