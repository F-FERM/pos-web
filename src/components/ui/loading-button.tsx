"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Button } from "./button";

type LoadingButtonProps = React.ComponentProps<typeof Button> & {
  loading?: boolean;
};

function LoadingButton({
  loading = false,
  disabled,
  children,
  className,
  variant,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      variant={variant}
      disabled={loading || disabled}
      aria-busy={loading}
      className={className}
      {...props}
    >
      {loading && (
        <Loader2
          aria-hidden="true"
          className={cn(
            "animate-spin",
            variant === "create" ? "size-[15px]" : "size-4"
          )}
        />
      )}
      {children}
    </Button>
  );
}

export { LoadingButton };