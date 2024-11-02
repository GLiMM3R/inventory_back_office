import { base_url } from "@/constants/base_url";

export const getProducts = async () => {
  try {
    const res = await fetch(`${base_url}/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status !== 200) {
      throw new Error(`Failed to fetch products: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
