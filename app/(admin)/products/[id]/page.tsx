"use client";

import { useGetProduct } from "@/features/products/services/use-get-product.service";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductDetailForm from "./_components/product-detail-form";
import ProductVariantForm from "./_components/product-variant-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Page() {
  const { id } = useParams();
  const product_id = id?.toString() ?? "";
  const { data: product, isLoading } = useGetProduct(product_id);
  const [isShowForm, setIsShowForm] = useState(false);

  return (
    <div className="max-w-screen-lg mx-auto">
      <Tabs defaultValue="detail" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="detail">Detail</TabsTrigger>
          <TabsTrigger value="variant">Varaint</TabsTrigger>
        </TabsList>
        <TabsContent value="detail">
          <ProductDetailForm product={product} />
        </TabsContent>
        <TabsContent value="variant" className="space-y-4">
          {product?.variants.map((variant) => (
            <ProductVariantForm
              variant={{ ...variant, product_id }}
              key={variant.variant_id}
            />
          ))}
          {isShowForm && <ProductVariantForm />}

          <Button onClick={() => setIsShowForm(!isShowForm)}>
            {!isShowForm ? "Add Variant" : "Close"}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
