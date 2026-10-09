import { LoginPayload } from "@/src/interfaces/login/create.type";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { UserLogin } from "../api/create";
import { toast } from "sonner";
import { toastDuration } from "@/src/lib/toast";
import { CustomError } from "@/src/interfaces/error/customError.type";
import { LocalStorage } from "@/src/utility/localStorage";
import { LoginResponse } from "@/src/interfaces/login/loginresponse.type";

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginPayload) => {
      const payload: LoginPayload = {
        username: data.username,
        password: data.password,
      };
      return await UserLogin(payload);
    },
    onSuccess: (data:LoginResponse) => {
      toast.success("Login Successfully", {
        duration: toastDuration,
      });   
      LocalStorage.setItem("access_token", data.access_token);
      router.push("/pos/dashboard");
    },
    onError: (error: unknown) => {
      const errorData = error as CustomError;
      const errorMessage =
      errorData.message || "An unexpected error occurred";
      toast.error(errorMessage);
    },
  });
};
