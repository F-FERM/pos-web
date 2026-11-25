"use client";

import { useAddLabelDesigner } from "@/src/api/label-designer/hooks/create.hook";
import { ListProductApi } from "@/src/api/product/api/getAll";
import { ListProductByIdApi } from "@/src/api/product/api/getById";
import FormCombobox from "@/src/components/common/form/FormCombobox";
import FormInput from "@/src/components/common/form/FormInput";
import PageHeader from "@/src/components/common/PageHeader";
import { Form } from "@/src/components/ui/form";
import { LoadingButton } from "@/src/components/ui/loading-button";
import { Label } from "@/src/interfaces/label-designer/successresponse.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Printer, Tags } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import barcodeIcon from "../../../public/icons/labeldesigner.png";
import BarcodeLabel from "./BarcodeLabel";

const LABEL_SIZES = ["50x25", "38x25", "40x30"];
const COLUMN_OPTIONS = [1, 2, 3, 4];
const LABELS=[2, 6, 12, 24, 36]

// Sample label shown before any product is selected
const SAMPLE = {
  storeName: "Green Grocery Supermarket",
  productName: "Ashirvad Atta",
  barcode: "2075013040891",
  priceText: "PRICE: ₹2000",
};

/** Builds a crisp placeholder barcode SVG (full height, no blur) from digits */
function placeholderBarcodeSvg(code: string) {
  let x = 0;
  let bars = "";
  for (const ch of `${code}${code}`.replace(/\D/g, "")) {
    const d = Number(ch);
    for (let i = 0; i < 3; i++) {
      const w = ((d + i * 2) % 3) + 1; // bar width 1..3
      bars += `<rect x="${x}" y="0" width="${w}" height="42" fill="#000"/>`;
      x += w + ((d + i) % 2) + 1; // gap 1..2
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${x} 42" width="100%" height="100%">${bars}</svg>`;
}

const formSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.coerce
    .number({ message: "Enter a valid number" })
    .int("Must be a whole number")
    .min(1, "Must be at least 1")
    .max(1000, "Maximum 1000 labels"),
  labelSize: z.string().min(1, "Label size is required"),
  columns: z.string().min(1, "Columns is required"),
});

type FormValues = z.infer<typeof formSchema>;

type Sheet = { labels: Label[]; labelSize: string; columns: number };

const parseSize = (s: string) => {
  const [w, h] = s.split("x").map(Number);
  return { w: w || 50, h: h || 25 };
};

function BarcodeLabelPage() {
  const searchParams = useSearchParams();
  const paramProductId = searchParams.get("productId") ?? "";
  const [search, setSearch] = useState("");
 
  const [sheet, setSheet] = useState<Sheet | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      productId: paramProductId,
      quantity: 12,
      labelSize: LABEL_SIZES[0],
      columns: "4",
    },
  });

  useEffect(() => {
    if (paramProductId) {
      form.setValue("productId", paramProductId);
    }
  }, [paramProductId, form]);

  const { data: productData } = useQuery({
    queryKey: ["productList", 1, 100, search],
    queryFn: () => ListProductApi({ page: 1, limit: 100, search: search }),
  });

  const { data: singleProduct } = useQuery({
    queryKey: ["product", paramProductId],
    queryFn: () => ListProductByIdApi(paramProductId),
    enabled: Boolean(paramProductId),
  });

  const products = productData?.data ?? [];
  const productOptions = useMemo(() => {
    const list = [...products];
    if (
      singleProduct?.data &&
      !list.some((p) => p._id === singleProduct.data._id)
    ) {
      list.unshift(singleProduct.data as any);
    }
    return list.map((p) => ({
      value: p._id,
      label: `${p.basicInfo?.name}${
        p.basicInfo?.barcode
          ? ` (Barcode: ${String(p.basicInfo?.barcode).slice(0, 4)}....)`
          : ""
      }`,
    }));
  }, [products, singleProduct?.data]);

  const { mutate: generate, isPending } = useAddLabelDesigner({
    onSuccess: (res) => {
      setSheet({
        labels: res.data.labels,
        labelSize: res.data.labelSize,
        columns: res.data.columns,
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    generate({
      items: [{ productId: values.productId, quantity: values.quantity }],
      labelSize: values.labelSize,
      columns: Number(values.columns),
    });
  };

  const handlePrint = () => {
    if (!sheet) {
      toast.error("Generate the labels first, then print");
      return;
    }
    window.print();
  };

  const watchedSize = form.watch("labelSize");
  const watchedProductId = form.watch("productId");
  const sheetSize = parseSize(sheet?.labelSize ?? watchedSize);
  const sheetColumns = sheet?.columns ?? Number(form.watch("columns") || 2);
  const previewSize = parseSize(watchedSize);
  const selectedProduct =
    products.find((p) => p._id === watchedProductId) ??
    (singleProduct?.data?._id === watchedProductId
      ? (singleProduct.data)
      : null);
  const firstLabel = sheet?.labels[0];

  // Preview priority: generated label > selected product > sample label
  const previewBarcode =
    selectedProduct?.basicInfo?.barcode ?? SAMPLE.barcode;
  const previewPrice = selectedProduct?.pricingAndTax?.sellingPrice
    ? `PRICE: ₹${selectedProduct.pricingAndTax.sellingPrice}`
    : SAMPLE.priceText;
  const preview = firstLabel
    ? {
        storeName: firstLabel.companyName,
        productName: firstLabel.productName,
        barcode: firstLabel.barcode,
        priceText: firstLabel.price,
        barcodeSvg: firstLabel.barcodeSvg,
      }
    : {
        storeName: SAMPLE.storeName,
        productName: selectedProduct?.basicInfo?.name ?? SAMPLE.productName,
        barcode: String(previewBarcode),
        priceText: previewPrice,
        barcodeSvg: placeholderBarcodeSvg(String(previewBarcode)),
      };

  return (
    <div className="flex flex-col gap-3 lg:px-2">
      <style>{`
        @media print {
          @page { size: ${sheetSize.w * sheetColumns}mm auto; margin: 0; }
          body * { visibility: hidden; }
          #sticker-print, #sticker-print * { visibility: visible; }
          #sticker-print { position: absolute; left: 0; top: 0; }
        }
      `}</style>

      <PageHeader
        title="Barcode Sticker Label Generator"
        subtitle="Generate and print barcode stickers for shop items without pre-printed barcode labels."
        icon={barcodeIcon}
        actions={[
          {
            label: "Print Sticker Sheet",
            icon: <Printer />,
            variant: "create",
            onClick: handlePrint,
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {/* Left: configuration + live preview */}
        <section className="flex min-w-0 flex-col gap-4 rounded-[10px] bg-[#EFEFEF] p-4 sm:p-6">
          <h2 className="border-b border-[#BFBFBF] pb-3 font-poppins text-[16px] font-semibold text-black">
            Label Configuration
          </h2>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              {/* Row 1: product + label size */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormCombobox
                  label="Select product from local inventory"
                  name="productId"
                  placeholder="Select product"
                  options={productOptions}
                  setSearch={setSearch}
                  valueLabel={
                    selectedProduct
                      ? `${selectedProduct.basicInfo?.name}${
                          selectedProduct.basicInfo?.barcode
                            ? ` (Barcode: ${String(selectedProduct.basicInfo?.barcode).slice(0, 4)}....)`
                            : ""
                        }`
                      : undefined
                  }
                  required
                />
                <FormCombobox
                  label="Label size (mm)"
                  name="labelSize"
                  placeholder="Select label size"
                  options={LABEL_SIZES.map((s) => ({ value: s, label: s }))}
                  required
                />
              </div>

              {/* Row 2: columns + number of labels */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormCombobox
                  label="Columns per row"
                  name="columns"
                  placeholder="Select columns"
                  options={COLUMN_OPTIONS.map((n) => ({
                    value: String(n),
                    label: `${n} ${n === 1 ? "Column" : "Columns"}`,
                  }))}
                  required
                />
                   {/* <FormCombobox
                 
                  label="Number of labels"
                  name="quantity"
                  placeholder="Select Labels"
                  
                  options={LABELS.map((n) => ({
                    value: String(n),
                    label: `${n} ${n === 1 ? "Column" : "Columns"}`,
                  }))}
                  required
                /> */}
                <FormInput
                  type="number"
                  label="Number of labels"
                  name="quantity"
                  placeholder="eg. 12"
                  value={form.watch("quantity")}
                  required
                />
              </div>

              {/* Submit (generate) button, above the live preview */}
              <div className="flex w-full sm:justify-end">
                <LoadingButton
                  type="submit"
                  variant="save"
                  loading={isPending}
                  className="w-full sm:w-auto"
                >
                  <Tags className="size-4" />
                  Generate Labels
                </LoadingButton>
              </div>
            </form>
          </Form>

          <div className="flex flex-col items-center gap-3 rounded-[10px] border border-[#A8A8A8] bg-[#D2D2D2] px-3 py-5 sm:px-4">
            <p className="text-center font-poppins text-[13px] font-medium uppercase text-[#585858] sm:text-[14px]">
              Live Single Preview
            </p>
            <div className="w-full max-w-[320px]">
              <BarcodeLabel
                {...preview}
                widthMm={previewSize.w}
                heightMm={previewSize.h}
              />
            </div>
          </div>
        </section>

        {/* Right: sheet preview from the API response */}
        <section className="flex min-w-0 flex-col gap-4 rounded-[10px] bg-[#EFEFEF] p-4 sm:p-6">
          <h2 className="border-b border-[#BFBFBF] pb-3 font-poppins text-[16px] font-semibold text-black">
            Sheet Preview
            {sheet && (
              <span className="ml-2 text-[12px] font-normal text-[#585858]">
                ({sheet.labels.length} labels)
              </span>
            )}
          </h2>

          <div className="max-h-[420px] overflow-y-auto rounded-[10px] border border-[#A8A8A8] bg-[#D2D2D2] p-3 sm:max-h-[520px]">
            {!sheet ? (
              <p className="py-10 text-center font-poppins text-[13px] text-[#585858]">
                Fill the form and click &quot;Generate Labels&quot; to preview
                the sheet.
              </p>
            ) : (
              <div
                className="grid gap-2 sm:gap-3"
                style={{
                  gridTemplateColumns: `repeat(${sheetColumns}, minmax(0, 1fr))`,
                }}
              >
                {sheet.labels.map((l, i) => (
                  <BarcodeLabel
                    key={i}
                    storeName={l.companyName}
                    productName={l.productName}
                    barcode={l.barcode}
                    priceText={l.price}
                    barcodeSvg={l.barcodeSvg}
                    widthMm={sheetSize.w}
                    heightMm={sheetSize.h}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Real-size sheet, only visible when printing */}
      {sheet && (
        <div
          id="sticker-print"
          className="hidden bg-white print:grid"
          style={{
            gridTemplateColumns: `repeat(${sheetColumns}, ${sheetSize.w}mm)`,
          }}
        >
          {sheet.labels.map((l, i) => (
            <BarcodeLabel
              key={i}
              mm
              storeName={l.companyName}
              productName={l.productName}
              barcode={l.barcode}
              priceText={l.price}
              barcodeSvg={l.barcodeSvg}
              widthMm={sheetSize.w}
              heightMm={sheetSize.h}
              className="!bg-white"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BarcodeLabelPage;