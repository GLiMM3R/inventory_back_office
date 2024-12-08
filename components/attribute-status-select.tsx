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

type Props = {
  onChange: (value: string) => void;
  value?: string;
};

export default function AttributeStatusSelect({ onChange, value }: Props) {
  const status = [
    {
      value: "sold_out",
      label: "Sold Out",
    },
    {
      value: "in_stock",
      label: "In Stock",
    },
    {
      value: "deprecated",
      label: "Deprecated",
    },
  ];

  return (
    <Select onValueChange={onChange} value={value}>
      <FormControl>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {status.map((s) => (
          <SelectItem key={s.value} value={s.value}>
            {s.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
