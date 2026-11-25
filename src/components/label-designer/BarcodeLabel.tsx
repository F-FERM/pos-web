import Image, { type StaticImageData } from "next/image";

type BarcodeLabelProps = {
  storeName: string;
  productName: string;
  barcode: string;
  priceText: string;
  barcodeSvg?: string;
  barcodeImage?: StaticImageData | string;
  widthMm: number;
  heightMm: number;
  mm?: boolean;
  className?: string;
};

export default function BarcodeLabel({
  storeName,
  productName,
  barcode,
  priceText,
  barcodeSvg,
  barcodeImage,
  widthMm,
  heightMm,
  mm = false,
  className = "",
}: BarcodeLabelProps) {
  const svg = barcodeSvg?.replace("<svg", '<svg preserveAspectRatio="none"');

  return (
    <div
      className={`flex flex-col items-center justify-center overflow-hidden rounded-[6px] bg-[#EFEFEF] font-poppins print:rounded-none ${className}`}
      style={{
        containerType: "inline-size",
        ...(mm
          ? { width: `${widthMm}mm`, height: `${heightMm}mm` }
          : { width: "100%", aspectRatio: `${widthMm} / ${heightMm}` }),
        padding: "3% 6%",
        gap: "2%",
      }}
    >
      <div className="flex w-full shrink-0 flex-col items-center text-center">
        <p
          className="w-full truncate font-semibold capitalize leading-[1.25] text-black"
          style={{ fontSize: "5.5cqw" }}
        >
          {storeName}
        </p>
        <p
          className="w-full truncate capitalize leading-[1.25] text-[#585858] print:text-black"
          style={{ fontSize: "4.5cqw" }}
        >
          {productName}
        </p>
      </div>

      <div className="min-h-0 w-full flex-1">
        {svg ? (
          <div
            className="h-full w-full [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : barcodeImage ? (
          <div className="relative h-full w-full">
            <Image
              src={barcodeImage}
              alt={`Barcode ${barcode}`}
              fill
              sizes="240px"
              className="object-fill"
            />
          </div>
        ) : null}
      </div>

      <p
        className="shrink-0 leading-[1.2] tracking-[0.1em] text-black"
        style={{ fontSize: "3.6cqw" }}
      >
        {barcode}
      </p>
      <p
        className="shrink-0 font-semibold uppercase leading-[1.2] text-black"
        style={{ fontSize: "4.5cqw" }}
      >
        {priceText}
      </p>
    </div>
  );
}