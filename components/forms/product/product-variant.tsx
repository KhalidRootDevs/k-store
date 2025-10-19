import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

export default function ProductVariant({
  availableImages,
  addAttributeToVariant,
  commonAttributes,
  updateVariantAttribute,
  removeAttributeFromVariant,
}: any) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useFormContext();

  const { fields, remove, append } = useFieldArray({
    control,
    name: "variants",
  });

  const addVariant = () => {
    append({
      sku: "",
      attributes: {},
      price: undefined,
      stock: undefined,
      image: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Variants</CardTitle>
        <CardDescription>
          Add variants with dynamic attributes like size, color, material, etc.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {fields.map((field, index) => {
          const variantAttributes = watch(`variants.${index}.attributes`) || {};

          return (
            <div key={field.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Variant {index + 1}</h4>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove variant</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`variants.${index}.sku`}>Variant SKU</Label>
                  <Input
                    id={`variants.${index}.sku`}
                    placeholder="e.g., TSHIRT-RED-M"
                    {...register(`variants.${index}.sku`)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`variants.${index}.image`}>
                    Variant Image
                  </Label>
                  <Select
                    value={watch(`variants.${index}.image`) || "none"}
                    onValueChange={(value) =>
                      setValue(
                        `variants.${index}.image`,
                        value === "none" ? "" : value
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an image" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No specific image</SelectItem>
                      {availableImages.map((image: any, imgIndex: number) => (
                        <SelectItem key={imgIndex} value={image}>
                          Image {imgIndex + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`variants.${index}.price`}>
                    Variant Price
                  </Label>
                  <Input
                    id={`variants.${index}.price`}
                    type="number"
                    step="0.01"
                    placeholder="Leave empty to use base price"
                    {...register(`variants.${index}.price`)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`variants.${index}.stock`}>
                    Variant Stock
                  </Label>
                  <Input
                    id={`variants.${index}.stock`}
                    type="number"
                    placeholder="Leave empty to use base stock"
                    {...register(`variants.${index}.stock`)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Attributes</Label>
                  <Select
                    onValueChange={(value) =>
                      addAttributeToVariant(index, value)
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Add attribute" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonAttributes.map((attr: any) => (
                        <SelectItem key={attr.value} value={attr.value}>
                          {attr.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {Object.entries(variantAttributes).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <Label className="w-20 capitalize">{key}:</Label>
                    <Input
                      value={value as string}
                      onChange={(e) =>
                        updateVariantAttribute(index, key, e.target.value)
                      }
                      placeholder={`Enter ${key} value`}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeAttributeFromVariant(index, key)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {Object.keys(variantAttributes).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No attributes added. Click "Add attribute" to define variant
                    properties.
                  </p>
                )}
              </div>

              {(() => {
                const variantsErrors = errors?.variants as any[] | undefined;
                const attrError = variantsErrors?.[index]?.attributes;
                const message =
                  attrError &&
                  typeof attrError === "object" &&
                  "message" in attrError
                    ? (attrError as any).message
                    : undefined;
                return message ? (
                  <p className="text-sm text-red-500">{message}</p>
                ) : null;
              })()}
            </div>
          );
        })}

        <Button
          type="button"
          variant="outline"
          onClick={addVariant}
          className="w-full bg-transparent"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Variant
        </Button>
      </CardContent>
    </Card>
  );
}
