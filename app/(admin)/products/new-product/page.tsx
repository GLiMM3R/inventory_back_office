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
  CreateProductDTO,
  productSchema,
} from "@/features/products/dto/create-product.dto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateProduct } from "@/features/products/services/use-create-product.service";
import { useState } from "react";
import CategorySelect from "@/components/category-select";
import { useCreatePresign } from "@/features/files/services/use-create-presign.service";
import { useUploadS3 } from "@/features/files/services/use-upload-s3.service";
import VariantForm from "./_components/product-variant-form";
import { IImageWithPreview } from "@/types/image-with-preview";
import UploadImage from "@/components/upload-image";
import { Textarea } from "@/components/ui/textarea";

export default function ProductFormPage() {
  const mutation = useCreateProduct();
  const mutationPresign = useCreatePresign();
  const mutationS3 = useUploadS3();
  const [thumbnail, setThumbnail] = useState<IImageWithPreview>();
  const [images, setImages] = useState<IImageWithPreview[]>([]);

  const form = useForm<CreateProductDTO>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category_id: "1",
      base_price: 0,
      description: "",
      variants: [
        {
          sku: "",
          additional_price: 0,
          variant_name: "",
          stock_quantity: 0,
          restock_level: 0,
          image: undefined,
          attributes: [
            {
              attribute_name: "size",
              attribute_value: "",
            },
          ],
        },
      ],
    },
  });

  const {
    fields: variantsField,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const addVariant = () => {
    append({
      sku: "",
      additional_price: 0,
      variant_name: "",
      stock_quantity: 0,
      restock_level: 0,
      image: {
        name: "",
        type: "",
        size: 0,
        collection_type: "",
      },
      attributes: [
        {
          attribute_name: "size",
          attribute_value: "",
        },
      ],
    });
  };

  async function onImageChanged(value?: IImageWithPreview | null) {
    if (value) {
      setThumbnail(value);
      form.setValue("thumbnail", {
        name: value.file.name,
        type: value.file.type,
        size: value.file.size,
        collection_type: "product",
      });
    }
  }

  async function onSubmit(values: CreateProductDTO) {
    if (thumbnail) {
      const presignResponse = await mutationPresign.mutateAsync(
        thumbnail.file.name
      );
      await mutationS3.mutateAsync({
        file: thumbnail.file,
        presignUrl: presignResponse.url,
      });

      values.thumbnail!.name = presignResponse.file_name;
    }

    if (values.variants?.length) {
      await Promise.all(
        values.variants.map(async (variant, idx) => {
          if (images[idx]) {
            const presignResponse = await mutationPresign.mutateAsync(
              images[idx].file.name
            );

            await mutationS3.mutateAsync({
              file: images[idx].file,
              presignUrl: presignResponse.url,
            });

            variant.image!.name = presignResponse.file_name;
          }
        })
      );
    }

    console.log(values);

    await mutation.mutateAsync(values);
  }

  return (
    <div className="max-w-screen-xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-x-8 gap-y-4">
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
              <FormField
                control={form.control}
                name={"base_price"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Price</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        className="h-9"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Desscription</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Product a description"
                        {...field}
                        className="h-9"
                      />
                    </FormControl>
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
              <UploadImage onStateChange={onImageChanged} />
            </CardContent>
          </Card>
          {variantsField.map((field, index) => (
            <VariantForm
              key={field.id}
              form={form}
              field={field}
              index={index}
              remove={remove}
              setImages={setImages}
            />
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
