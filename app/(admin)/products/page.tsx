"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getProducts } from "@/features/products/services/get-products.service";
import { IProducts } from "@/features/products/model/product.interface";
import React, { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState<IProducts[]>([]);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [isClient, setIsClient] = useState(false);

  const handleFetchProducts = async () => {
    setState("loading");
    const res = await getProducts();
    setProducts(res.data);
    setState("idle");
  };

  useEffect(() => {
    handleFetchProducts();
    setIsClient(true); // Set isClient to true after the first render
  }, []);

  if (!isClient) {
    return null; // Return null on the server side to avoid hydration issues
  }

  if (state === "loading") {
    return <p>Loading products...</p>;
  }
  return (
    <div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.product_id}>
              <TableCell className="font-medium">
                {product.product_id}
              </TableCell>
              <TableCell>
                <img
                  src={product.images?.length ? product.images[0] : undefined}
                  width={40}
                  height={40}
                  alt={product.name}
                />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>
                {new Date(product.created_at * 1000).toLocaleString("en-GB")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
