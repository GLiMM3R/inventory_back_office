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
import { UploadImages } from "@/components/upload-images";
import { IFileRequest } from "@/features/files/dto/file-request";
import { useCreatePresign } from "@/features/files/services/use-create-presign.service";
import { useUploadS3 } from "@/features/files/services/use-upload-s3.service";
import { productSchema } from "@/features/products/dto/create-product.dto";
import { UpdateProductSchema } from "@/features/products/dto/update-product.dto";
import { IProduct } from "@/features/products/model/product.interface";
import { useUpdateProduct } from "@/features/products/services/use-update-product.service";
import { getChangedValues } from "@/lib/get-change-values";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface FileWithPreview extends File {
  preview: string;
  id?: string;
}

type Props = {
  product?: IProduct;
};

export default function ProductDetailForm({ product }: Props) {
  const mutation = useUpdateProduct();
  const mutationPresign = useCreatePresign();
  const mutationS3 = useUploadS3();
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  useEffect(() => {
    if (product && product?.images?.length) {
      setFiles(
        product.images.map((image) => {
          return {
            id: image.media_id,
            name: image.file_name,
            preview: image.file_url,
            size: image.file_size,
            type: image.file_type,
          } as FileWithPreview;
        })
      );
    }
  }, [product]);

  const form = useForm<UpdateProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: product ?? {
      name: "",
      category_id: "",
      description: "",
      variants: [],
    },
  });

  useEffect(() => {
    form.reset(product);
  }, [product]);

  async function onSubmit(values: UpdateProductSchema) {
    let files_request: IFileRequest[] = [];

    if (files.length) {
      for (const file of files) {
        if (!file.id) {
          // const presignResponse = await mutationPresign.mutateAsync(file.name);
          // await mutationS3.mutateAsync({
          //   file,
          //   presignUrl: presignResponse.url,
          // });
          files_request.unshift({
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            media_type: "product",
            description: "",
          });
        }
      }
    }

    console.log(files_request);

    return;
    if (product?.product_id) {
      mutation.mutate({
        id: product?.product_id,
        product: {
          category_id: values?.category_id,
          description: values.description,
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
              <UploadImages values={files} onSetValues={setFiles} />
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
