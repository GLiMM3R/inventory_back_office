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
import { Textarea } from "@/components/ui/textarea";
import { UploadImage } from "@/components/upload-image";
import { base_url } from "@/constants/base_url";
import { useUploadFiles } from "@/features/files/services/use-upload-file.service";
import {
  ProductUpdateDto,
  productUpdateSchema,
} from "@/features/products/dto/update-product.dto";
import { IProduct } from "@/features/products/model/product.interface";
import { useUpdateProduct } from "@/features/products/services/use-update-product.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface FileWithPreview extends File {
  preview: string;
}

type Props = {
  product?: IProduct;
};

export default function ProductDetailForm({ product }: Props) {
  const mutation = useUpdateProduct();
  const mutaionUpload = useUploadFiles();
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  useEffect(() => {
    if (product && product?.images?.length) {
      setFiles(
        product.images.map((image) => {
          return {
            name: image,
            preview: base_url + "/files/products/" + image,
          } as FileWithPreview;
        })
      );
    }
  }, [product]);

  const form = useForm<ProductUpdateDto>({
    resolver: zodResolver(productUpdateSchema),
    values: {
      name: product?.name ?? "",
      category_id: product?.category_id ?? "",
      description: product?.description ?? "",
      images: product?.images ?? [],
    },
  });

  async function onSubmit(values: ProductUpdateDto) {
    // let images: string[] = [];

    // if (files.length) {
    //   images = await mutaionUpload.mutateAsync(files);
    // }

    if (product?.product_id) {
      mutation.mutate({
        id: product?.product_id,
        product: {
          category_id: values?.category_id,
          description: values.description,
          //   images: images,
          name: values.name,
        },
      });
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex justify-end">
            <Button>
              <span>
                <Save />
              </span>
              Save
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Detail</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
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
                      value={field.value?.toString()}
                    />
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
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <UploadImage values={files} onSetValues={setFiles} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
