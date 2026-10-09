import Image from "next/image";
import logo from "../../../../public/images/Logo.png"; 

const LoginLogo = ({ className = "" }: { className?: string }) => {
  return (
    <Image
      src={logo}
      alt="F POS"
      width={144}
      height={50}
      priority
      className={`h-[50px] w-[144px] shrink-0 rounded-[29px] object-contain ${className}`}
    />
  );
};

export default LoginLogo;