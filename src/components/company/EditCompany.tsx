"use client";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Form } from "@/src/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Store, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "../common/form/FormInput";
import { LoadingButton } from "../ui/loading-button";
import { useEditCompany } from "@/src/api/company/hooks/update.hook";
import { fileToBase64 } from "../helpers/FileHandling";

const MAX_LOGO_MB = 5;

const formSchema = z.object({
  name: z.string().max(100, "Name must be at most 100 characters").optional(),
  contact: z.object({
    primaryEmail: z
      .string()
      .refine((v) => !v || /^\S+@\S+\.\S+$/.test(v), "Enter a valid email")
      .optional(),
    primaryPhone: z.string().optional(),
    alternatePhone: z.string().optional(),
    website: z.string().optional(),
  }),
  address: z.object({
    line1: z.string().optional(),
    line2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  }),
  taxIdentifiers: z.object({
    vatNumber: z.string().optional(),
  }),
  regional: z.object({
    currency: z.string().optional(),
    currencySymbol: z.string().optional(),
  }),
});

export type CompanyFormData = z.infer<typeof formSchema>;

interface EditCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
  company: CompanyFormData;
  logoUrl?: string;
}

export function EditCompanyDialog({
  open,
  onOpenChange,
  companyId,
  company,
  logoUrl,
}: EditCompanyDialogProps) {
  const form = useForm<CompanyFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: company,
  });

  const { mutate: editCompany, isPending } = useEditCompany({
    form,
    onOpenChange,
  });

  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoError, setLogoError] = useState("");

  // Prefill from the list API data each time the dialog opens
  useEffect(() => {
    if (open) {
      form.reset(company);
      setPreview(logoUrl ?? "");
      setLogoFile(null);
      setLogoError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Revoke blob URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setLogoError("Please choose an image file");
      return;
    }
    if (file.size > MAX_LOGO_MB * 1024 * 1024) {
      setLogoError(`Image must be under ${MAX_LOGO_MB} MB`);
      return;
    }
    setLogoError("");
    setLogoFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const discardSelectedLogo = () => {
    setLogoFile(null);
    setLogoError("");
    setPreview(logoUrl ?? "");
  };

const handleSubmit = async (data: CompanyFormData) => {
  try {
   
    const finalLogoUrl = logoFile
      ? await fileToBase64(logoFile)
      : logoUrl ?? "";

    const payload = {
      name: data.name ?? "",
      contact: {
        primaryEmail: data.contact.primaryEmail ?? "",
        primaryPhone: data.contact.primaryPhone ?? "",
        alternatePhone: data.contact.alternatePhone ?? "",
        website: data.contact.website ?? "",
      },
      address: {
        line1: data.address.line1 ?? "",
        line2: data.address.line2 ?? "",
        city: data.address.city ?? "",
        state: data.address.state ?? "",
        postalCode: data.address.postalCode ?? "",
        country: data.address.country ?? "",
      },
      taxIdentifiers: {
        vatNumber: data.taxIdentifiers.vatNumber ?? "",
      },
      regional: {
        currency: data.regional.currency ?? "",
        currencySymbol: data.regional.currencySymbol ?? "",
      },
      branding: {
        logoUrl: finalLogoUrl,
      },
    };

    editCompany({
      id: companyId,
      value: payload,
    });
  } catch (error) {
    console.error("Failed to process company logo:", error);
  }
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-[calc(100%-2rem)] gap-0 sm:max-w-[1000px] overflow-y-auto rounded-[20px] border-0 bg-[#EFEFEF] p-4 font-poppins sm:p-6"
      >
        <DialogHeader className="border-b border-[#D5D5D5] pb-3 text-left">
          <DialogTitle className="text-[14px] font-semibold text-black sm:text-[16px]">
            Edit Company
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mt-4 flex flex-col gap-4"
          >
            {/* Logo upload */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative size-[96px] shrink-0 overflow-hidden rounded-full border-4 border-[#9D9D9D] bg-[#EFEFEF]">
                {preview ? (
                  <Image
                    src={preview}
                    alt="Company logo preview"
                    fill
                    sizes="96px"
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <Store className="absolute inset-0 m-auto size-8 text-[#9D9D9D]" />
                )}
              </div>

              <div className="flex flex-col gap-2">
                {preview ? (
                  <div className="inline-flex w-fit items-center overflow-hidden rounded-[10px] bg-primary text-white">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 text-[12px] font-semibold uppercase hover:opacity-90"
                    >
                      <Camera className="size-4" />
                      Change Logo
                    </button>

                    {/* X only appears when a new file is picked (undo selection) */}
                    {logoFile && (
                      <button
                        type="button"
                        aria-label="Discard selected logo"
                        onClick={discardSelectedLogo}
                        className="self-stretch border-l border-white/40 px-3 hover:bg-black/10"
                      >
                        <X className="size-4" />
                      </button>
                    )}
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="cancel"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Camera className="size-4" />
                    Upload Logo
                  </Button>
                )}

                <p className="text-[12px] text-[#848484]">
                  PNG or JPG, up to {MAX_LOGO_MB} MB
                </p>
                {logoError && <p className="text-[12px] text-red-600">{logoError}</p>}

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFile}
                />
              </div>
            </div>

            <Section title="Business" cols={3}>
              <FormInput type="text" label="Store Name" name="name" placeholder="eg. My Grocery Store" value={form.watch("name")} />
            </Section>

            <Section title="Contact" cols={4}>
              <FormInput type="text" label="Primary Email" name="contact.primaryEmail" placeholder="store@example.com" value={form.watch("contact.primaryEmail")} />
              <FormInput type="text" label="Website" name="contact.website" placeholder="www.example.com" value={form.watch("contact.website")} />
              <FormInput type="text" label="Primary Phone" name="contact.primaryPhone" placeholder="+91 00000 00000" value={form.watch("contact.primaryPhone")} />
              <FormInput type="text" label="Alternate Phone" name="contact.alternatePhone" placeholder="+91 00000 00000" value={form.watch("contact.alternatePhone")} />
            </Section>

            <Section title="Address" cols={3}>
              <FormInput type="text" label="Country" name="address.country" placeholder="Enter country" value={form.watch("address.country")} />
              <FormInput type="text" label="State" name="address.state" placeholder="Enter state" value={form.watch("address.state")} />
              <FormInput type="text" label="City" name="address.city" placeholder="Enter city" value={form.watch("address.city")} />
              <FormInput type="text" label="Address Line 1" name="address.line1" placeholder="Street address" value={form.watch("address.line1")} />
              <FormInput type="text" label="Address Line 2" name="address.line2" placeholder="Apartment, floor, landmark" value={form.watch("address.line2")} />
              <FormInput type="text" label="Postal Code" name="address.postalCode" placeholder="000000" value={form.watch("address.postalCode")} />
            </Section>

            <Section title="Tax & Regional" cols={3}>
              <FormInput type="text" label="VAT / GST Number" name="taxIdentifiers.vatNumber" placeholder="Tax number" value={form.watch("taxIdentifiers.vatNumber")} />
              <FormInput type="text" label="Currency Code" name="regional.currency" placeholder="INR" value={form.watch("regional.currency")} />
              <FormInput type="text" label="Currency Symbol" name="regional.currencySymbol" placeholder="₹" value={form.watch("regional.currencySymbol")} />
            </Section>

            <DialogFooter className="mt-2">
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end sm:gap-2">
                <Button type="button" variant="cancel" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <LoadingButton type="submit" variant="save" loading={isPending}>
                  Update Company
                </LoadingButton>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const GRID_COLS = {
  3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
} as const;

function Section({
  title,
  cols,
  children,
}: {
  title: string;
  cols: keyof typeof GRID_COLS;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[14px] font-semibold leading-[100%] text-black">{title}</h3>
      <div className={`grid gap-4 ${GRID_COLS[cols]}`}>{children}</div>
    </div>
  );
}