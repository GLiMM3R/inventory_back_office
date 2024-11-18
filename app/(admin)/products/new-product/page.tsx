"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
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
  ProductForm,
  productSchema,
} from "@/features/products/dto/create-product.dto";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { useCreateProduct } from "@/features/products/services/use-create-product.service";
import { AttributeForm } from "./_components/AttributeForm";
import { UploadImage } from "@/components/upload-image";
import { useState } from "react";
import { useUploadFiles } from "@/features/files/services/use-upload-file.service";
import CategorySelect from "@/components/category-select";

interface FileWithPreview extends File {
  preview: string;
}

export default function ProductFormPage() {
  const mutation = useCreateProduct();
  const mutaionUpload = useUploadFiles();
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category_id: "1",
      images: [],
      variants: [
        {
          price: 0,
          attributes: [
            {
              attribute: "size",
              value: "L",
            },
          ],
        },
      ],
    },
  });

  const variantField = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const addVariant = () => {
    variantField.append({
      price: 0,
      attributes: [
        {
          attribute: "",
          value: "",
        },
      ],
    });
  };

  function handleAddImages(files: FileWithPreview[]) {
    setFiles((prevFiles) => [...files]);
    form.setValue("images", [...files.map((file) => file.name)]);
  }

  async function onSubmit(values: ProductForm) {
    let images: string[] = [];

    if (files.length) {
      images = await mutaionUpload.mutateAsync(files);
    }

    mutation.mutate({
      ...values,
      images,
    });
  }

  return (
    <div className="max-w-screen-xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-x-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Product a"
                        {...field}
                        className="h-9"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <CategorySelect
                      onChange={field.onChange}
                      value={field.value}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <UploadImage values={files} onSetValues={setFiles} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          {variantField.fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>Variants</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => variantField.remove(index)}
                  >
                    <X />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <FormField
                  control={form.control}
                  name={`variants.${index}.price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          className="h-9"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <AttributeForm
                  control={form.control}
                  index={index}
                  key={index}
                />
              </CardContent>
            </Card>
          ))}
          <div className="flex justify-between">
            <Button onClick={addVariant}>Add Variant</Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
