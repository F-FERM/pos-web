import Image, { type StaticImageData } from "next/image";

type BarcodeLabelProps = {
  storeName: string;
  productName: string;
  barcode: string;
  price: number;
  barcodeImage: StaticImageData | string;
  className?: string;
};

const CURRENCY = "₹";

// One sticker: 234 x 132, radius 10, padding 9/20, gap 10, bg #EFEFEF
export default function BarcodeLabel({
  storeName,
  productName,
  barcode,
  price,
  barcodeImage,
  className = "",
}: BarcodeLabelProps) {
  return (
  <div
    className={`flex h-[132px] w-[234px] shrink-0 flex-col items-center justify-center gap-[6px] overflow-hidden rounded-[10px] bg-[#EFEFEF] px-5 py-[9px] font-poppins ${className}`}
  >
    <div className="flex w-full shrink-0 flex-col items-center gap-[2px] text-center">
      <p className="w-full truncate text-[12px] font-semibold capitalize leading-[1.3] text-black">
        {storeName}
      </p>
      <p className="w-full truncate text-[10px] font-normal capitalize leading-[1.3] text-[#585858]">
        {productName}
      </p>
    </div>

    <div className="flex shrink-0 flex-col items-center gap-[2px]">
      <div className="relative h-[45px] w-[195px] shrink-0 overflow-hidden">
        <Image
          src={barcodeImage}
          alt={`Barcode ${barcode}`}
          fill
          sizes="195px"
          className="object-cover"
        />
      </div>
      <p className="text-[8px] font-normal leading-[1.3] text-black">{barcode}</p>
    </div>

    <p className="shrink-0 text-[10px] font-normal uppercase leading-[1.3] text-black">
      Our Price: {CURRENCY}
      {price}
    </p>
  </div>
);
}