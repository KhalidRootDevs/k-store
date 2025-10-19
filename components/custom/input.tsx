"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ErrorMessage } from "@hookform/error-message";
import { format } from "date-fns";
import { Calendar, Clock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Flatpickr from "react-flatpickr";
import { Controller, useFormContext } from "react-hook-form";
import ReactSelect from "react-select";
import DropzoneSingleFile from "./file-dropzone-single";
import DropzoneSingle from "./img-dropzone-single";
import RichTextEditor from "./rich-text-editor";

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  options?: { value: string; label: string; type?: string }[];
  className?: string;
  readOnly?: boolean;
  rowCount?: number;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "select"
    | "textarea"
    | "rich-text"
    | "react-select"
    | "react-select-multi"
    | "image"
    | "file"
    | "checkbox"
    | "switch"
    | "datetime"
    | "time";
  flatpickrOptions?: any;
};

export default function InputField(props: Props) {
  const {
    name,
    type,
    label,
    placeholder,
    options,
    className,
    readOnly,
    flatpickrOptions = {},
    rowCount = 2,
  } = props;
  const {
    control,
    formState: { errors, isSubmitting },
  } = useFormContext();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {label && <Label htmlFor={name}>{label}</Label>}

      <Controller
        control={control}
        name={name}
        render={({ field }) =>
          type === "checkbox" ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-4">
                {options?.map(({ label, value, type }) => (
                  <div className="flex w-60 items-center gap-3" key={value}>
                    <Checkbox
                      className="h-5 w-5"
                      checked={field.value?.includes(value)}
                      onCheckedChange={(checked) =>
                        checked
                          ? field.onChange([...(field?.value || []), value])
                          : field.onChange(
                              field.value?.filter(
                                (fieldValue: string) => fieldValue !== value
                              )
                            )
                      }
                      id={label}
                      value={value}
                      disabled={isSubmitting}
                    />
                    <label
                      htmlFor={label}
                      className="flex cursor-pointer flex-col text-sm"
                    >
                      {label}
                      <span
                        className={`text-xs font-medium capitalize ${
                          type === "ios" ? "text-green-500" : "text-blue-500"
                        }`}
                      >
                        {type}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ) : type === "switch" ? (
            <div className="flex items-center gap-3">
              <Switch
                checked={!!field.value}
                onCheckedChange={(val) => field.onChange(val)}
                id={name}
                disabled={isSubmitting}
              />
              <Label htmlFor={name}>
                {field.value ? "Active" : "Inactive"}
              </Label>
            </div>
          ) : type === "datetime" ? (
            <div className="relative">
              <Flatpickr
                id={name}
                value={field.value && new Date(field.value)}
                onChange={(date) => {
                  const formattedDate = format(date[0], "yyyy-MM-dd HH:mm:ss");
                  field.onChange(formattedDate);
                }}
                options={{
                  enableTime: true,
                  time_24hr: false,
                  ...flatpickrOptions,
                }}
                className="flex h-9 w-full rounded-md border px-3 py-1 pr-10 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSubmitting}
              />
              <Calendar
                size={18}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>
          ) : type === "time" ? (
            <div className="relative">
              <Flatpickr
                id={name}
                value={field.value || ""}
                onChange={(date) => {
                  if (!date[0]) return;
                  const formattedTime = format(date[0], "HH:mm");
                  field.onChange(formattedTime);
                }}
                options={{
                  enableTime: true,
                  noCalendar: true,
                  dateFormat: "H:i",
                  time_24hr: true,
                  ...flatpickrOptions,
                }}
                className="flex h-10 w-full rounded-md border px-3 py-1 pr-10 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSubmitting}
              />
              <Clock
                size={18}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>
          ) : type === "textarea" ? (
            <Textarea
              disabled={isSubmitting}
              {...field}
              id={name}
              placeholder={placeholder}
              rows={rowCount}
            />
          ) : type === "rich-text" ? (
            <RichTextEditor name={name} />
          ) : type.includes("react-select") ? (
            <ReactSelect
              classNames={{
                option: () => "text-base font-normal",
                singleValue: () => "text-sm font-normal",
                placeholder: () => "text-sm font-normal",

                menu: () => "text-sm",
              }}
              theme={(theme) => ({
                ...theme,
                borderRadius: 6,
                colors: {
                  ...theme.colors,
                  primary25: "#EEEEEE",
                  primary: "#EEEEEE",
                },
              })}
              styles={{
                singleValue: (base) => ({
                  ...base,
                  color: "black",
                }),
                option: (base, state) => ({
                  ...base,
                  color: state.isSelected ? "black" : base.color,
                  backgroundColor: state.isSelected
                    ? "#EEEEEE"
                    : base.backgroundColor,
                  ":active": {
                    backgroundColor: "#EEEEEE",
                  },
                }),
                control: (base, state) => ({
                  ...base,
                  border: state.isFocused
                    ? "1px solid black"
                    : "1px solid #ccc",
                  boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
                  "&:hover": {
                    borderColor: "black",
                  },
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 100,
                }),
              }}
              id={name}
              isMulti={type === "react-select-multi"}
              options={options}
              value={
                type === "react-select-multi"
                  ? options?.filter((opt) =>
                      field.value?.includes(opt.value)
                    ) || []
                  : options?.find((opt) => opt.value === field.value) || null
              }
              onChange={(selected) =>
                type === "react-select-multi"
                  ? field.onChange((selected as any[]).map((s) => s.value))
                  : field.onChange((selected as any)?.value ?? "")
              }
              isDisabled={isSubmitting}
            />
          ) : type === "image" ? (
            <DropzoneSingle name={name} />
          ) : type === "file" ? (
            <DropzoneSingleFile name={name} />
          ) : type === "select" && options ? (
            <Select
              disabled={isSubmitting}
              onValueChange={(val) => val && field.onChange(val)}
              value={field.value}
            >
              <SelectTrigger className="bg-background" id={name}>
                <SelectValue placeholder={placeholder || "Select an Option"} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option, i) => (
                  <SelectItem key={i} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : type === "password" ? (
            <div className="relative">
              <Input
                {...field}
                className={`pr-10 ${
                  readOnly ? "cursor-not-allowed bg-muted" : "bg-background"
                }`}
                disabled={isSubmitting}
                type={showPassword ? "text" : "password"}
                id={name}
                placeholder={placeholder}
                readOnly={readOnly}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          ) : (
            <Input
              {...field}
              className={`${
                readOnly ? "cursor-not-allowed bg-muted" : "bg-background"
              }`}
              disabled={isSubmitting}
              type={type}
              id={name}
              placeholder={placeholder}
              readOnly={readOnly}
              onWheel={(e) =>
                type === "number" && (e.target as HTMLInputElement)?.blur()
              }
            />
          )
        }
      />

      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => (
          <p className="text-sm text-destructive">{message}</p>
        )}
      />
    </div>
  );
}
