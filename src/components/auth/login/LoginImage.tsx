import Image from "next/image";
import loginBg from "../../../../public/images/Login.png"; 
import LoginClock from "./LoginClock";
import LoginLogo from "./LoginLogo";

const LoginImage = () => {
  return (
    <section
      className="relative hidden overflow-hidden rounded-[30px] lg:block"
      style={{ clipPath: "polygon(0 0, 100% 0, calc(100% - 70px) 100%, 0 100%)" }}
    >
      <Image
        src={loginBg}
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 50vw, 0px"
        className="object-cover"
      />

      <div className="relative flex h-full min-h-[600px] flex-col p-8 xl:p-12">
        <LoginLogo />

        <div className="mt-[8vh] w-full max-w-[460px] font-poppins xl:mt-[10vh]">
          <h2 className="text-[clamp(28px,3vw,44px)] font-semibold leading-[1.35] text-white">
            Smarter Checkout.
            <br />
            Better Business.
          </h2>
          <p className="mt-3 text-[clamp(14px,1.3vw,18px)] leading-[1.6] text-[#CFCFCF]">
            Fast. Simple. Reliable.
            <br />
            Everything your grocery store needs.
          </p>
        </div>

        <div className="mt-auto pt-8">
          <LoginClock />
        </div>
      </div>
    </section>
  );
};

export default LoginImage;