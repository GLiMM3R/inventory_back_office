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
import React from "react";
import { AttributeForm } from "./AttributeForm";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProductUpdateDto,
  productUpdateSchema,
} from "@/features/products/dto/update-product.dto";
import { IProduct } from "@/features/products/model/product.interface";
import { useUpdateProduct } from "@/features/products/services/use-update-product.service";

type Props = {
  product?: IProduct;
};

export default function ProductVariantForm({ product }: Props) {
  const mutation = useUpdateProduct();
  const form = useForm<ProductUpdateDto>({
    resolver: zodResolver(productUpdateSchema),
    values: {
      variants: [
        {
          price: 0,
          attributes: [
            {
              attribute: "",
              value: "",
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

  async function onSubmit(values: ProductUpdateDto) {
    // let images: string[] = [];

    // if (files.length) {
    //   images = await mutaionUpload.mutateAsync(files);
    // }

    if (product?.product_id) {
      mutation.mutate({
        id: product?.product_id,
        product: {
          variants: values.variants,
        },
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex justify-end">
          <Button type="submit">
            <span>
              <Save />
            </span>
            Save
          </Button>
        </div>
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
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AttributeForm control={form.control} index={index} key={index} />
            </CardContent>
          </Card>
        ))}
        <div className="flex justify-between">
          <Button onClick={addVariant}>Add Variant</Button>
        </div>
      </form>
    </Form>
  );
}
