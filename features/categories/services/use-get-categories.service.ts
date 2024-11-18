import { base_url } from "@/constants/base_url";
import http from "@/lib/request";
import { Response } from "@/types/reponse";
import { useQuery } from "@tanstack/react-query";
import { ICategory } from "../model/category.interface";

type Filters = {
  parent_id: string;
  page: number;
  limit: number;
};

export const fetchCategories = async (filters?: Filters) => {
  try {
    const res = await http.get<Response<ICategory[]>>(
      `${base_url}/categories`,
      {
        params: filters,
      }
    );
    const data = res.data;

    if (res.status !== 200) {
      throw new Error(`Failed to fetch categories: ${res.status}`);
    }

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const useGetCategories = (filters?: Filters) => {
  const query = useQuery({
    queryKey: ["categories", filters],
    queryFn: async () => await fetchCategories(filters),
  });

  return query;
};
