import http from "@/lib/request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { base_url } from "@/constants/base_url";
import { CategoryForm } from "../dto/create-category.dto";

const createCategory = async (data: CategoryForm) => {
  try {
    const res = await http.post(`${base_url}/categories`, data);

    if (res.status !== 201) {
      throw new Error("Failed to create category");
    }
  } catch (error) {
    throw new Error("Failed to create category");
  }
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newCategory: CategoryForm) => {
      await createCategory(newCategory);
    },
    onSuccess: () => {
      toast({
        type: "background",
        description: "Category created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast({
        description: "Category created failed!",
      });
    },
  });

  return mutation;
};
