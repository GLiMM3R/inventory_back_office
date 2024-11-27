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
  CreateProductSchema,
  productSchema,
} from "@/features/products/dto/create-product.dto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { useCreateProduct } from "@/features/products/services/use-create-product.service";
import { AttributeForm } from "./_components/attribute-form";
import { UploadImages } from "@/components/upload-images";
import { useState } from "react";
import CategorySelect from "@/components/category-select";
import { useCreatePresign } from "@/features/files/services/use-create-presign.service";
import { IFileRequest } from "@/features/files/dto/file-request";
import { useUploadS3 } from "@/features/files/services/use-upload-s3.service";

interface FileWithPreview extends File {
  preview: string;
}

export default function ProductFormPage() {
  const mutation = useCreateProduct();
  const mutationPresign = useCreatePresign();
  const mutationS3 = useUploadS3();
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const form = useForm<CreateProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category_id: "1",
      variants: [
        {
          price: 0,
          sku: "",
          quantity: 0,
          restock_level: 0,
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
      sku: "",
      price: 0,
      quantity: 0,
      restock_level: 0,
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
    // form.setValue("images", [...files.map((file) => file.name)]);
  }
  async function onSubmit(values: CreateProductSchema) {
    let files_request: IFileRequest[] = [];

    if (files.length) {
      for (const file of files) {
        const presignResponse = await mutationPresign.mutateAsync(file.name);
        await mutationS3.mutateAsync({ file, presignUrl: presignResponse.url });
        files_request.unshift({
          file_name: presignResponse.file_name,
          file_size: file.size,
          file_type: file.type,
          media_type: "product",
          description: "",
        });
      }
    }

    await mutation.mutateAsync({
      ...values,
      images: files_request,
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
              <UploadImages values={files} onSetValues={setFiles} />
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
                  name={`variants.${index}.sku`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <FormField
                  control={form.control}
                  name={`variants.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
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
                <FormField
                  control={form.control}
                  name={`variants.${index}.restock_level`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Restock Level</FormLabel>
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
