"use client";

import { AppPagination } from "@/components/app-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetProducts } from "@/features/products/services/use-get-products.service";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Products() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limitPage, setLimitPage] = useState(10);
  const { data, refetch, isLoading } = useGetProducts({
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
    <>
      <div className="h-full flex flex-col gap-4">
        <div className="flex justify-between">
          <Input
            id="search"
            placeholder="search..."
            className="pl-10"
            icon={<Search className="text-muted-foreground" />}
          />
          <Button onClick={() => router.push("/products/new-product")}>
            New Product
          </Button>
        </div>
        <div className="flex-1">
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
                  <TableRow
                    key={product.product_id}
                    onClick={() =>
                      router.push(`/products/${product.product_id}`)
                    }
                  >
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category_name}</TableCell>
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
        <div className="flex justify-center gap-2">
          <AppPagination
            page={currentPage}
            limit={limitPage}
            total={data?.total ?? 0}
            onPageChange={setCurrentPage}
          />
          <Select
            defaultValue={limitPage.toString()}
            onValueChange={(val) => setLimitPage(Number(val))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((val) => (
                <SelectItem key={val} value={val.toString()}>
                  {val}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
