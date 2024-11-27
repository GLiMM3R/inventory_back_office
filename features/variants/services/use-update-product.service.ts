import http from "@/lib/request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { base_url } from "@/constants/base_url";
import { UpdateVariantSchema } from "../dto/update-variant.dto";

type Props = {
  product_id: string;
  variant_id: string;
  data: UpdateVariantSchema;
};

const updateVariant = async ({ product_id, variant_id, data }: Props) => {
  try {
    await http.patch(
      `${base_url}/products/${product_id}/variants/${variant_id}`,
      data
    );
  } catch (error) {
    throw new Error("Failed to update variant");
  }
};

export const useUpdateVaraint = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ product_id, variant_id, data }: Props) => {
      await updateVariant({ product_id, variant_id, data });
    },
    onSuccess: () => {
      toast({
        description: "Variant update successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["variants"] });
    },
    onError: (error) => {
      toast({
        description: "Variant update failed!",
      });
    },
  });

  return mutation;
};
