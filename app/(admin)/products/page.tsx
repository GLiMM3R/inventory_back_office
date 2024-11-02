"use client";

import { AppPagination } from "@/components/app-pagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetProducts } from "@/features/products/services/get-products.service";
import React, { useEffect, useState } from "react";

export default function Products() {
  const [isClient, setIsClient] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limitPage, setLimitPage] = useState(1);
  const { data, refetch, isLoading } = useGetProducts({
    name: "",
    page: currentPage,
    limit: limitPage,
  });

  useEffect(() => {
    setIsClient(true); // Set isClient to true after the first render
  }, []);

  useEffect(() => {
    refetch();
  }, [currentPage, limitPage, refetch]);

  if (!isClient) {
    return null; // Return null on the server side to avoid hydration issues
  }

  if (isLoading) {
    return <p>Loading products...</p>;
  }
  return (
    <div className="flex-1 flex flex-col gap-4 bg-slate-600">
      <div>
        <Button>New Product</Button>
      </div>
      <div className="flex flex-1 h-full bg-red-400">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data &&
              data.data.map((product) => (
                <TableRow key={product.product_id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    {new Date(product.created_at * 1000).toLocaleString(
                      "en-GB"
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <div className="justify-end">
        <AppPagination
          page={currentPage}
          limit={limitPage}
          total={data?.total ?? 0}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
