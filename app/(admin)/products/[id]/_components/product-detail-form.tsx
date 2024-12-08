import CategorySelect from "@/components/category-select";
import MultiImageUpload from "@/components/multiple-images-upload";
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
import UploadImage from "@/components/upload-image";
import { IFileRequest } from "@/features/files/dto/file-request";
import { IMedia } from "@/features/files/model/media.interface";
import { useCreatePresign } from "@/features/files/services/use-create-presign.service";
import { useUploadS3 } from "@/features/files/services/use-upload-s3.service";
import { productSchema } from "@/features/products/dto/create-product.dto";
import { UpdateProductDTO } from "@/features/products/dto/update-product.dto";
import { IProduct } from "@/features/products/model/product.interface";
import { useUpdateProduct } from "@/features/products/services/use-update-product.service";
import { getChangedValues } from "@/lib/get-change-values";
import { IFileWithPreview } from "@/types/file-with-preview.type";
import { IImageWithPreview } from "@/types/image-with-preview";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  product?: IProduct;
};

export default function ProductDetailForm({ product }: Props) {
  const mutation = useUpdateProduct();
  const mutationPresign = useCreatePresign();
  const mutationS3 = useUploadS3();
  const [thumbnail, setThumbnail] = useState<IImageWithPreview>();

  const fetcImage = async (image: IMedia) => {
    try {
      const res = await fetch(image.url);
      if (!res.ok) {
        throw new Error("Failed to fetch image");
      }

      const blob = await res.blob();
      const file = new File([blob], image.name, { type: blob.type });
      setThumbnail(() => ({
        id: image.id,
        file,
        preview: URL.createObjectURL(blob),
      }));
    } catch (error) {
      console.error("Error fetching the image:", error);
    }
  };

  useEffect(() => {
    if (product?.thumbnail) {
      fetcImage(product.thumbnail);
    }
  }, [product]);

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

  const form = useForm<UpdateProductDTO>({
    resolver: zodResolver(productSchema),
    defaultValues: product ?? {
      name: "",
      category_id: "",
      base_price: 0,
      description: "",
    },
  });

  useEffect(() => {
    form.reset(product);
  }, [product]);

  async function onSubmit(values: UpdateProductDTO) {
    // let files_request: IFileRequest[] = [];
    // if (images.length) {
    //   const uploadPromises = images.map(async (image) => {
    //     const existingImage = product?.images?.find(
    //       (img) => img.media_id === image.id
    //     );
    //     if (
    //       image &&
    //       (!existingImage || image.file.name !== existingImage.file_name)
    //     ) {
    //       const presignResponse = await mutationPresign.mutateAsync(
    //         image.file.name
    //       );
    //       await mutationS3.mutateAsync({
    //         file: image.file,
    //         presignUrl: presignResponse.url,
    //       });
    //       return {
    //         file_name: presignResponse.file_name,
    //         file_size: image.file.size,
    //         file_type: image.file.type,
    //         media_type: "product",
    //         description: "",
    //       };
    //     }
    //     return null;
    //   });
    //   const uploadResults = await Promise.all(uploadPromises);
    //   files_request = uploadResults.filter(
    //     (result): result is IFileRequest => result !== null
    //   );
    // }
    // if (product?.product_id) {
    //   const changed = getChangedValues(product, values);
    //   mutation.mutate({
    //     id: product?.product_id,
    //     product: {
    //       ...changed,
    //       images: files_request,
    //     },
    //   });
    // }
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
              <div className="size-60">
                <UploadImage value={thumbnail} onStateChange={onImageChanged} />
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
