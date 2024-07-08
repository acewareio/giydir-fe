import * as React from "react";

import { cn } from "@/lib/utils";
import { useTranslation } from "@/services/i18n/client";
import { Image } from "lucide-react";
import { buttonVariants } from "./button";

export interface FileInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
  "data-testid"?: string;
  onImageSelect?: (ImageDataType: File) => void;
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, type, onImageSelect, ...props }, ref) => {
    const [previewSource, setPreviewSource] = React.useState<string>("");
    const { t } = useTranslation("file-input");

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        previewFile(file);
      }
    };

    const previewFile = (file: File) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewSource(result);
        if (onImageSelect) {
          onImageSelect(file);
        }
      };
    };

    return (
      <>
        <div className="relative bg-white flex flex-col justify-center text-center items-center p-8 border rounded-xl border-dashed border-neutral-300 cursor-pointer">
          {previewSource ? (
            <img
              src={previewSource}
              alt="Image Preview"
              className="w-full h-96 rounded-xl object-cover"
            />
          ) : (
            <>
              <Image className="text-neutral-400" />

              <span className="mt-5  font-medium">{t("file-input:title")}</span>

              <p className="text-neutral-400 text-sm">
                {t("file-input:description")}
              </p>
            </>
          )}
          <a
            className={cn(
              buttonVariants({ variant: "outline" }),
              "button-outline mt-2"
            )}
          >
            {previewSource
              ? t("file-input:selectAnotherImage")
              : t("file-input:selectImageText")}
          </a>
          <input
            type={type}
            className={cn(
              "absolute top-0 left-0  h-full w-full visible opacity-0 cursor-pointer",
              className
            )}
            ref={ref}
            onChange={handleFileInputChange}
            {...props}
          />
          {props.errorMessage && (
            <p
              data-testid={`${props["data-testid"]}-error`}
              className="text-xs text-red-500"
            >
              {props.errorMessage}
            </p>
          )}
        </div>
      </>
    );
  }
);
FileInput.displayName = "File Input";

export { FileInput };
