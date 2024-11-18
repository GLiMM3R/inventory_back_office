import http from "@/lib/request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { base_url } from "@/constants/base_url";
import { ProductUpdateDto } from "../dto/update-product.dto";

type Props = {
  id: string;
  product: Partial<ProductUpdateDto>;
};

const updateProduct = async ({ id, product }: Props) => {
  try {
    const res = await http.patch(`${base_url}/products/${id}`, product);

    if (res.status !== 201) {
      throw new Error("Failed to update product");
    }
  } catch (error) {
    throw new Error("Failed to update product");
  }
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, product }: Props) => {
      await updateProduct({ id, product });
    },
    onSuccess: () => {
      toast({
        description: "Product updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      toast({
        description: "Product updated failed!",
      });
    },
  });

  return mutation;
};
