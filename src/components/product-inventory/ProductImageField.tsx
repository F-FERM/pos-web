"use client";

import { ImagePlus, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import type { ProductFormData } from "./AddProductInventoryDialogue";
import { ACCEPTED_IMAGE_TYPES, fileToCompressedDataUrl, MAX_IMAGE_MB } from "@/src/utility/image";

interface ProductImageUploadProps {
  form: UseFormReturn<ProductFormData>;
  /** lets the parent disable "Save" while an image is being processed */
  onLoadingChange?: (loading: boolean) => void;
  className?: string;
}

export default function ProductImageUpload({
  form,
  onLoadingChange,
  className = "",
}: ProductImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const image = form.watch("image");
  const error = form.formState.errors.image?.message;

  const setBusy = (value: boolean) => {
    setLoading(value);
    onLoadingChange?.(value);
  };

  const openPicker = () => inputRef.current?.click();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allows picking the same file again after removing it
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      form.setError("image", { message: "Only JPG, PNG or WEBP images are allowed" });
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      form.setError("image", { message: `Image must be smaller than ${MAX_IMAGE_MB} MB` });
      return;
    }

    try {
      setBusy(true);
      const dataUrl = await fileToCompressedDataUrl(file);
      form.clearErrors("image");
      form.setValue("image", dataUrl, { shouldDirty: true });
    } catch {
      form.setError("image", { message: "Could not process this image. Try another one." });
    } finally {
      setBusy(false);
    }
  };

  const removeImage = () => {
    form.setValue("image", "", { shouldDirty: true });
    form.clearErrors("image");
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-[13px] font-medium text-black">Add Image</span>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        className="hidden"
        onChange={handleChange}
      />

      {image ? (
        <div className="flex items-center gap-3">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-[12px] border border-[#C4C4C4] bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="Product preview" className="size-full object-cover" />
            <button
              type="button"
              onClick={removeImage}
              aria-label="Remove image"
              className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
            >
              <X className="size-3" />
            </button>
          </div>

          <button
            type="button"
            onClick={openPicker}
            disabled={loading}
            className="w-fit text-[13px] font-medium text-primary hover:underline disabled:opacity-60"
          >
            {loading ? "Processing..." : "Change image"}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          disabled={loading}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-[8px] border border-[#C4C4C4] bg-[#DEDEDE] text-[13px] text-black transition-colors hover:border-[#B726B7] hover:text-[#B726B7] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
          {loading ? "Processing..." : "Upload Image"}
        </button>
      )}

      <span className="text-[11px] text-[#6b6b6b]">
        JPG, PNG or WEBP, up to {MAX_IMAGE_MB} MB.
      </span>
      {error && <p className="text-[12px] text-red-600">{error}</p>}
    </div>
  );
}