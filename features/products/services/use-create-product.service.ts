import http from "@/lib/request";
import { ProductForm } from "../dto/create-product.dto";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { base_url } from "@/constants/base_url";

const createProduct = async (data: ProductForm) => {
  try {
    const res = await http.post(`${base_url}/products`, data);

    if (res.status == 201) {
      throw new Error("Failed to create product");
    }
  } catch (error) {
    throw new Error("Failed to create product");
  }
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newProduct: ProductForm) => {
      await createProduct(newProduct);
    },
    onSuccess: () => {
      toast({
        description: "Product created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      toast({
        description: "Product created failed!",
      });
    },
  });

  return mutation;
};
