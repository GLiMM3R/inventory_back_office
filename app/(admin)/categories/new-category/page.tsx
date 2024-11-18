"use client";

import CategorySelect from "@/components/category-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  CategoryForm,
  categorySchema,
} from "@/features/categories/dto/create-category.dto";
import { useCreateCategory } from "@/features/categories/services/use-create-category.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

export default function NewCategory() {
  const form = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    values: {
      name: "",
      parent_category_id: null,
      image: "",
    },
  });

  const router = useRouter();
  const mutation = useCreateCategory();

  function onSubmit(values: CategoryForm) {
    mutation.mutate(values, {
      onSuccess: () => {
        router.push("/categories");
      },
    });
  }

  return (
    <div className="max-w-screen-lg mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Form</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name={"name"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-9"
                        placeholder="Enter the name of category"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <div className="flex justify-end">
            <Button>
              <span>
                <Save />
              </span>
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
