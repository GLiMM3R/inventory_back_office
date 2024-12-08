import { base_url } from "@/constants/base_url";
import http from "@/lib/request";
import { IProducts } from "../model/products.interface";
import { Response } from "@/types/reponse";
import { useQuery } from "@tanstack/react-query";

type Filters = {
  page: number;
  limit: number;
};

export const fetchProducts = async (filters?: Filters) => {
  try {
    const res = await http.get<Response<IProducts[]>>(`${base_url}/products`, {
      params: filters,
    });
    const data = res.data;

    if (res.status !== 200) {
      throw new Error(`Failed to fetch products: ${res.status}`);
    }

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const useGetProducts = (filters?: Filters) => {
  const query = useQuery({
    queryKey: ["products"],
    queryFn: async () => await fetchProducts(filters),
  });

  return query;
};
