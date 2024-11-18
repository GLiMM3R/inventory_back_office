"use client";

import { base_url } from "@/constants/base_url";
import http from "@/lib/request";
import { Response } from "@/types/reponse";
import { useQuery } from "@tanstack/react-query";
import { IProduct } from "../model/product.interface";

export const fetchProduct = async (id: string) => {
  try {
    const res = await http.get<Response<IProduct>>(
      `${base_url}/products/${id}`
    );

    const data = res.data.data;

    if (res.status !== 200) {
      throw new Error(`Failed to fetch products: ${res.status}`);
    }

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const useGetProduct = (id: string) => {
  const query = useQuery({
    queryKey: ["product", id],
    queryFn: async () => await fetchProduct(id),
  });

  return query;
};
