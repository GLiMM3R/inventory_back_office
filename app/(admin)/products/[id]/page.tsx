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
  ProductForm,
  productSchema,
} from "@/features/products/dto/create-product.dto";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X } from "lucide-react";
import { useCreateProduct } from "@/features/products/services/use-create-product.service";
import { AttributeForm } from "./_components/AttributeForm";
import { UploadImage } from "@/components/upload-image";
import { useEffect, useState } from "react";
import { useUploadFiles } from "@/features/files/services/use-upload-file.service";
import { useGetProduct } from "@/features/products/services/use-get-product.service";
import { useParams } from "next/navigation";
import { base_url } from "@/constants/base_url";
import CategorySelect from "@/components/category-select";
import { useUpdateProduct } from "@/features/products/services/use-update-product.service";
import { getChangedValues } from "@/lib/get-change-values";
import { IProduct } from "@/features/products/model/product.interface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import ProductDetailForm from "./_components/product-detail-form";
import ProductVariantForm from "./_components/product-variant-form";

interface FileWithPreview extends File {
  preview: string;
}

export default function Page() {
  const { id } = useParams();
  const product_id = id?.toString() ?? "";
  const { data: product } = useGetProduct(product_id);

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
        <TabsContent value="variant">
          <ProductVariantForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
