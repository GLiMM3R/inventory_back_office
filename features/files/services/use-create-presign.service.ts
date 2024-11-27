import { base_url } from "@/constants/base_url";
import http from "@/lib/request";
import { Response } from "@/types/reponse";
import { IPresign } from "../model/presign.interface";
import { useMutation } from "@tanstack/react-query";

const createPresign = async (fileName: string) => {
  try {
    const res = await http.post<Response<IPresign>>(
      `${base_url}/files/generate-presign`,
      { file_name: fileName }
    );

    return res.data.data;
  } catch (error) {
    throw new Error("Failed to get presign");
  }
};

export const useCreatePresign = () => {
  const mutation = useMutation({
    mutationFn: async (fileName: string) => {
      return await createPresign(fileName);
    },
  });

  return mutation;
};
