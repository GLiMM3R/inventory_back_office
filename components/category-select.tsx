"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { FormControl } from "./ui/form";
import { useGetCategories } from "@/features/categories/services/use-get-categories.service";

type Props = {
  onChange: (value: string) => void;
  value?: string;
};

export default function CategorySelect({ onChange, value }: Props) {
  const { data } = useGetCategories();

  return (
    <Select onValueChange={onChange} value={value}>
      <FormControl>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {data?.data.map((category) => (
          <SelectItem key={category.category_id} value={category.category_id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
