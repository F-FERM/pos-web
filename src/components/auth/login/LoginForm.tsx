"use client";

import Image from "next/image";
import { ArrowRight, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import basketIcon from "../../../../public/icons/login.png";
import LoginKeypad from "./LoginKeypad";
import LoginFormInput from "../../common/form/LoginFormInput";
import LoginPasswordInput from "../../common/form/LoginPasswordInput";
import { Form } from "../../ui/form";
import { useLogin } from "@/src/api/auth/login/hooks/create.hook";
import { Button } from "../../ui/button";

const MAX_USERNAME_LENGTH = 50;
const MAX_PASSWORD_LENGTH = 6;

const schema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .max(MAX_USERNAME_LENGTH, `Username must be at most ${MAX_USERNAME_LENGTH} characters`),
  password: z
    .string()
    .min(1, "Password is required")
    .max(MAX_PASSWORD_LENGTH, `Password must be at most ${MAX_PASSWORD_LENGTH} characters`),
});

type FormData = z.infer<typeof schema>;

const LoginForm = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "" },
  });

  const { mutate: userLogin, isPending } = useLogin();

  const password = form.watch("password");

  const setPassword = (value: string) =>
    form.setValue("password", value, {
      shouldDirty: true,
      shouldValidate: form.formState.isSubmitted,
    });

  const pressKey = (k: string) => {
    if (password.length < MAX_PASSWORD_LENGTH) setPassword(password + k);
  };
  const clearPassword = () => setPassword("");
  const backspace = () => setPassword(password.slice(0, -1));

  const onSubmit = (data: FormData) => {
    userLogin({ username: data.username, password: data.password });
  };

  return (
    <div className="flex w-full flex-col gap-8 sm:gap-10">
      {/* Heading */}
      <div className="font-poppins">
        <h1 className="flex items-center gap-3 text-[28px] font-semibold leading-[1.2] text-black sm:text-[35px]">
          <Image
            src={basketIcon}
            alt=""
            width={34}
            height={34}
            className="size-[34px] shrink-0 object-contain"
          />
          Welcome Back
        </h1>
        <p className="mt-3 text-[15px] font-normal leading-[1.5] text-[#555555] sm:text-[18px]">
          Sign in to your F POS account to continue managing your store.
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-[10px]"
          noValidate
        >
          <LoginFormInput
  name="username"
  label="Email / Username"
  placeholder="Enter email or username"
  Icon={<User className="size-[18px] shrink-0 text-black" />}
  required
  disabled={isPending}
  maxLength={MAX_USERNAME_LENGTH}
/>

        <LoginPasswordInput
  name="password"
  label="Password"
  maxLength={MAX_PASSWORD_LENGTH}
  required
  disabled={isPending}
/>

          <LoginKeypad
            onKey={pressKey}
            onClear={clearPassword}
            onBackspace={backspace}
            disabled={isPending}
          />

         

           <Button
            type="submit"
            variant="login"
             disabled={isPending}
           
           
          >
            <ArrowRight className="size-[18px]" />
            {isPending ? "Logging in..." : "Log In"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;