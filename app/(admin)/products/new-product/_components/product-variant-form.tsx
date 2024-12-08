// app/(admin)/products/new-product/VariantCard.tsx

import React, { Dispatch, SetStateAction } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import UploadImage from "@/components/upload-image";
import { AttributeForm } from "./attribute-form";
import { Control, FieldArrayWithId, UseFormReturn } from "react-hook-form";
import { CreateProductDTO } from "@/features/products/dto/create-product.dto";
import { IImageWithPreview } from "@/types/image-with-preview";

interface VariantCardProps {
  form: UseFormReturn<CreateProductDTO, any, undefined>;
  field: FieldArrayWithId<CreateProductDTO, "variants", "id">; // Replace with the correct type for the field
  index: number;
  remove: (index: number) => void;
  setImages: Dispatch<SetStateAction<IImageWithPreview[]>>;
}

const VariantForm: React.FC<VariantCardProps> = ({
  form,
  field,
  index,
  remove,
  setImages,
}) => {
  async function onImageChanged(
    index: number,
    value?: IImageWithPreview | null
  ) {
    if (value) {
      setImages((prevImages) => {
        const newImages = [...prevImages];
        newImages[index] = value;
        return newImages;
      });

      form.setValue(`variants.${index}.image`, {
        name: value.file.name,
        type: value.file.type,
        size: value.file.size,
        collection_type: "product",
      });
    }
  }

  return (
    <Card key={field.id}>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Variant {index + 1}</span>
          <Button variant="outline" size="icon" onClick={() => remove(index)}>
            <X />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-x-4 gap-y-4">
        <div className="col-span-2 size-52">
          <UploadImage onStateChange={(val) => onImageChanged(index, val)} />
        </div>
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
          name={`variants.${index}.variant_name`}
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
          name={`variants.${index}.additional_price`}
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
          name={`variants.${index}.stock_quantity`}
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
          name={`variants.${index}.restock_level`}
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
        <div className="col-span-2">
          <AttributeForm control={form.control} index={index} key={index} />
        </div>
      </CardContent>
    </Card>
  );
};

export default VariantForm;
