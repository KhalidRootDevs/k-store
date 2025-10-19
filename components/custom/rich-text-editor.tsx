"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import "suneditor/dist/css/suneditor.min.css";
import {
  align,
  font,
  fontColor,
  fontSize,
  formatBlock,
  hiliteColor,
  horizontalRule,
  image,
  lineHeight,
  link,
  list,
  paragraphStyle,
  table,
  template,
  textStyle,
  video,
} from "suneditor/src/plugins";

const ImportSunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
  loading: () => (
    <div className="h-48 w-full animate-pulse rounded-md border bg-muted" />
  ),
});

type RichTextEditorProps = {
  name: string;
  disabled?: boolean;
  placeholder?: string;
  height?: string;
};

function RichTextEditor({
  name,
  disabled = false,
  placeholder = "Enter your text here",
  height = "300",
}: RichTextEditorProps) {
  const form = useFormContext();
  const [editorValue, setEditorValue] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Set initial value from form
    const initialValue = form.getValues(name);
    if (initialValue) {
      setEditorValue(initialValue);
    }

    // Watch for form changes
    const subscription = form.watch((value) => {
      if (value[name] !== undefined && value[name] !== editorValue) {
        setEditorValue(value[name] || "");
      }
    });

    return () => subscription.unsubscribe();
  }, [form, name, editorValue]);

  const handleChange = (content: string) => {
    setEditorValue(content);
    form.setValue(name, content, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleBlur = () => {
    form.trigger(name);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <div className="h-48 w-full animate-pulse rounded-md border bg-muted" />
    );
  }

  return (
    <div className={disabled ? "opacity-60 cursor-not-allowed" : ""}>
      <ImportSunEditor
        setContents={editorValue}
        onChange={handleChange}
        onBlur={handleBlur}
        height={height}
        lang="en"
        readOnly={disabled}
        setOptions={{
          showPathLabel: false,
          placeholder: placeholder,
          plugins: [
            align,
            font,
            fontColor,
            fontSize,
            formatBlock,
            hiliteColor,
            horizontalRule,
            lineHeight,
            list,
            paragraphStyle,
            table,
            template,
            textStyle,
            image,
            link,
            video,
          ],
          buttonList: [
            ["undo", "redo"],
            ["removeFormat"],
            ["font", "fontSize"],
            ["bold", "italic", "underline", "fontColor", "hiliteColor"],
            ["align", "lineHeight", "horizontalRule", "list"],
            ["table", "link", "image", "video"],
            ["fullScreen"],
          ],
          resizingBar: !disabled,
        }}
      />
    </div>
  );
}

export default RichTextEditor;
