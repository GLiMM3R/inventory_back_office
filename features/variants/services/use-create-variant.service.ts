import http from "@/lib/request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { base_url } from "@/constants/base_url";
import { CreateVariantDTO } from "../dto/create-variant.dto";

type Props = {
  product_id: string;
  data: CreateVariantDTO;
};

const createVariant = async ({ product_id, data }: Props) => {
  try {
    const res = await http.patch(`${base_url}/products/${product_id}`, data);

    if (res.status !== 201) {
      throw new Error("Failed to create variant");
    }
  } catch (error) {
    throw new Error("Failed to create variant");
  }
};

export const useCreateVaraint = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ product_id, data }: Props) => {
      await createVariant({ product_id, data });
    },
    onSuccess: () => {
      toast({
        description: "Variant created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["variants"] });
    },
    onError: (error) => {
      toast({
        description: "Variant created failed!",
      });
    },
  });

  return mutation;
};
