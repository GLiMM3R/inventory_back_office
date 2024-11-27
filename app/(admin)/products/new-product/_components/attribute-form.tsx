import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateProductSchema } from "@/features/products/dto/create-product.dto";
import { Select } from "@radix-ui/react-select";
import { X } from "lucide-react";
import { Control, useFieldArray } from "react-hook-form";

export const AttributeForm = ({
  control,
  index,
}: {
  control: Control<CreateProductSchema>;
  index: number;
}) => {
  const attributes = ["size", "color"];
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variants.${index}.attributes`,
  });

  const addAttribute = () => {
    append({ attribute: "", value: "" });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {fields.map((field, attrIndex) => (
          <div
            key={field.id}
            className="flex space-x-4 items-end justify-center"
          >
            <FormField
              control={control}
              name={`variants.${index}.attributes.${attrIndex}.attribute`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attribute</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {attributes.map((attribute) => (
                        <SelectItem key={attribute} value={attribute}>
                          {attribute}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`variants.${index}.attributes.${attrIndex}.value`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="flex">Value</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input
                      {...field}
                      className="h-9 w-full"
                      onChange={(e) => field.onChange(e.target.value)}
                      required
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button onClick={() => remove(attrIndex)}>
              <X />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <Button type="button" onClick={addAttribute}>
          Add Attribute
        </Button>
      </div>
    </div>
  );
};
