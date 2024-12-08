import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { AttributeForm } from "./attribute-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getChangedValues } from "@/lib/get-change-values";
import { variantSchema } from "@/features/variants/dto/create-variant.dto";
import { useUpdateVaraint } from "@/features/variants/services/use-update-variant.service";
import UploadImage from "@/components/upload-image";
import { useCreatePresign } from "@/features/files/services/use-create-presign.service";
import { useUploadS3 } from "@/features/files/services/use-upload-s3.service";
import { Switch } from "@/components/ui/switch";
import AttributeStatusSelect from "@/components/attribute-status-select";
import { IImageWithPreview } from "@/types/image-with-preview";
import { IProductVariant } from "@/features/variants/model/product-variant.interface";
import { UpdateVariantDTO } from "@/features/variants/dto/update-variant.dto";
import { IMedia } from "@/features/files/model/media.interface";

type Props = {
  product_id?: string;
  variant?: IProductVariant;
};

export default function ProductVariantForm({ variant }: Props) {
  const [image, setImage] = useState<IImageWithPreview | null>(null);
  const mutation = useUpdateVaraint();
  const mutationPresign = useCreatePresign();
  const mutationS3 = useUploadS3();

  const form = useForm<UpdateVariantDTO>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      sku: variant?.variant_id ?? "",
      variant_name: variant?.variant_name ?? "",
      additional_price: variant?.additional_price ?? 0,
      stock_quantity: variant?.stock_quantity ?? 0,
      restock_level: variant?.restock_level ?? 0,
      is_active: variant?.is_active ?? true,
      status: variant?.status ?? "in_stock",
      attributes: variant?.attributes,
    },
  });

  // Reset the form when the product prop changes
  useEffect(() => {
    form.reset(variant);
  }, [variant]);

  const onImageChanged = (value: IImageWithPreview | null) => {
    if (value) {
      setImage(value);
      form.setValue("image", {
        name: value.file.name,
        type: value.file.type,
        size: value.file.size,
        collection_type: "product",
      });
    }
  };

  const fetcImage = async (image: IMedia) => {
    try {
      const res = await fetch(image.url);
      if (!res.ok) {
        throw new Error("Failed to fetch image");
      }

      const blob = await res.blob();
      const file = new File([blob], image.name, { type: blob.type });
      setImage(() => ({
        id: image.id,
        file,
        preview: URL.createObjectURL(blob),
      }));
    } catch (error) {
      console.error("Error fetching the image:", error);
    }
  };

  useEffect(() => {
    if (variant?.image) {
      fetcImage(variant.image);
    }
  }, [variant?.image]);

  async function onSubmit(values: UpdateVariantDTO) {
    // if (variant) {
    //   if (
    //     selectedImage &&
    //     selectedImage.file.name !== variant.image.file_name
    //   ) {
    //     const presignResponse = await mutationPresign.mutateAsync(
    //       selectedImage.file.name
    //     );
    //     await mutationS3.mutateAsync({
    //       file: selectedImage.file,
    //       presignUrl: presignResponse.url,
    //     });
    //     form.setValue("image", {
    //       file_name: presignResponse.file_name,
    //       file_size: selectedImage.file.size,
    //       file_type: selectedImage.file.type,
    //       media_type: "product",
    //       description: "",
    //     });
    //   }
    //   const changed = getChangedValues(variant, values);
    //   mutation.mutate({
    //     variant_id: variant.variant_id,
    //     data: { ...changed },
    //   });
    // } else {
    //   console.log(values);
    // }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>Variants</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-x-4 gap-y-4">
            <div className="col-span-2 size-52">
              <UploadImage value={image} onStateChange={onImageChanged} />
            </div>
            <FormField
              control={form.control}
              name={"sku"}
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
              name={"variant_name"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-9" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"additional_price"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
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
              name={"stock_quantity"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity</FormLabel>
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
              name={"restock_level"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restock Level</FormLabel>
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <AttributeStatusSelect
                    onChange={field.onChange}
                    value={field.value?.toString()}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"is_active"}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {field.value ? "Active" : "Inactive"}
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="col-span-2 mt-4">
              <AttributeForm control={form.control} />
            </div>
            <div className="col-span-2 flex justify-end mt-4">
              <Button type="submit">
                <Save />
                <span>Save</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
