import { base_url } from "@/constants/base_url";
import http from "@/lib/request";
import { Response } from "@/types/reponse";
import { useQuery } from "@tanstack/react-query";
import { IProductVariant } from "../model/product-variant.interface";

type Filters = {
  product_id: string;
  name: string;
  page: number;
  limit: number;
};

export const fetchVariants = async (filters?: Filters) => {
  try {
    const res = await http.get<Response<IProductVariant[]>>(
      `${base_url}/variants/${filters?.product_id}`,
      {
        params: filters,
      }
    );
    const data = res.data;

    if (res.status !== 200) {
      throw new Error(`Failed to fetch variants: ${res.status}`);
    }

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const useGetVariants = (filters?: Filters) => {
  const query = useQuery({
    queryKey: ["variants"],
    queryFn: async () => await fetchVariants(filters),
  });

  return query;
};
