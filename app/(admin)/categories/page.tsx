"use client";

import { AppPagination } from "@/components/app-pagination";
import { Button } from "@/components/ui/button";
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
import { useGetCategories } from "@/features/categories/services/use-get-categories.service";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Categories() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limitPage, setLimitPage] = useState(10);
  const { data, refetch, isLoading } = useGetCategories({
    parent_id: "",
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
    return <p>Loading...</p>;
  }
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={() => router.push("/categories/new-category")}>
          <span>
            <PlusCircle />
          </span>
          New Category
        </Button>
      </div>
      <div className="flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data &&
              data.data.map((category) => (
                <TableRow key={category.category_id}>
                  <TableCell>{category.category_id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    {new Date(category.created_at * 1000).toLocaleString(
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
  );
}
