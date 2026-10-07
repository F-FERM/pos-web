import Image from "next/image";
import LOGO_SRC from "../../../../public/icons/sidebar-logo.png"

export default function Logo({
  size = 36,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src={LOGO_SRC}
      alt="Company logo"
      width={size}
      height={size}
      priority
      className={`shrink-0 rounded-full object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}