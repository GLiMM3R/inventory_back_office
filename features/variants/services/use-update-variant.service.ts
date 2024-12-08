import http from "@/lib/request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { base_url } from "@/constants/base_url";
import { UpdateVariantDTO } from "../dto/update-variant.dto";

type Props = {
  variant_id: string;
  data: UpdateVariantDTO;
};

const updateVariant = async ({ variant_id, data }: Props) => {
  try {
    await http.patch(`${base_url}/variants/${variant_id}`, data);
  } catch (error) {
    throw new Error("Failed to update variant");
  }
};

export const useUpdateVaraint = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ variant_id, data }: Props) => {
      await updateVariant({ variant_id, data });
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
