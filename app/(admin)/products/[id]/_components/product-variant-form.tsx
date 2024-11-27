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
import { Save, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { AttributeForm } from "./attribute-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getChangedValues } from "@/lib/get-change-values";
import { IVariant } from "@/features/variants/model/variant.interface";
import { variantSchema } from "@/features/variants/dto/create-variant.dto";
import { UpdateVariantSchema } from "@/features/variants/dto/update-variant.dto";
import { useUpdateVaraint } from "@/features/variants/services/use-update-product.service";
import { IFileWithPreview } from "@/types/file-with-preview.type";
import UploadImage from "@/components/upload-image";
import { IFileRequest } from "@/features/files/dto/file-request";
import { useCreatePresign } from "@/features/files/services/use-create-presign.service";
import { useUploadS3 } from "@/features/files/services/use-upload-s3.service";

type Props = {
  variant?: IVariant;
};

export default function ProductVariantForm({ variant }: Props) {
  const [file, setFile] = useState<IFileWithPreview | null>(null);
  const mutation = useUpdateVaraint();
  const mutationPresign = useCreatePresign();
  const mutationS3 = useUploadS3();

  const form = useForm<UpdateVariantSchema>({
    resolver: zodResolver(variantSchema),
    defaultValues: variant ?? {
      sku: "",
      price: 0,
      quantity: 0,
      restock_level: 0,
      is_active: true,
      status: "inactive",
      attributes: [
        {
          attribute: "",
          value: "",
        },
      ],
    },
  });

  // Reset the form when the product prop changes
  useEffect(() => {
    form.reset(variant);
  }, [variant]);

  // useEffect(() => {
  //   if (variant && variant?.image) {
  //     setFile({
  //       id: variant?.image.media_id,
  //       name: variant?.image.file_name,
  //       preview: variant?.image.file_url,
  //       size: variant?.image.file_size,
  //       type: variant?.image.file_type,
  //     } as IFileWithPreview);
  //   }
  // }, [variant?.image]);

  async function onSubmit(values: UpdateVariantSchema) {
    console.log(file?.size);
    return;

    if (variant) {
      let image_request: IFileRequest | undefined;

      if (file) {
        const presignResponse = await mutationPresign.mutateAsync(file.name);
        await mutationS3.mutateAsync({ file, presignUrl: presignResponse.url });
        image_request = {
          file_name: presignResponse.file_name,
          file_size: file.size,
          file_type: file.type,
          media_type: "product",
          description: "",
        };
      }

      const changed = getChangedValues(variant, values);

      mutation.mutate({
        product_id: variant.product_id,
        variant_id: variant.variant_id,
        data: { ...changed, image: image_request },
      });
    } else {
      console.log(values);
    }
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
              <UploadImage value={file} onSetValue={setFile} />
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
              name={"price"}
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
              name={"quantity"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
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
