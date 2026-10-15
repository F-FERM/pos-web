"use client";
import Image from "next/image";
import { Button } from "../ui/button";

interface ErrorHandlingProp {
  message?: string;
}

const ErrorHandling = ({ message }: ErrorHandlingProp) => {
  return (
    <div className="md:w-[466px] inline-flex flex-col justify-start items-center gap-3.5">
      <div>
        <Image
          src="/images/error-image.png"
          alt="Error Icon"
          width={180}
          height={200}
        />
      </div>
      <div className="self-stretch flex flex-col justify-start items-center gap-6">
        <div className="self-stretch justify-start">
          <span className="text-zinc-800 text-lg md:text-xl font-medium  tracking-tight">
            Error :{" "}
          </span>
          <span className="text-zinc-800 text-base md:text-xl font-normal  tracking-tight">
            {message ? message : "Something went wrong, Please try again"}.
          </span>
        </div>
        <Button
          className=" px-8 py-2 cursor-pointer"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    </div>
  );
};

export default ErrorHandling;