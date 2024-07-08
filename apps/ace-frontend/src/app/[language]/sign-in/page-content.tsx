"use client";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthActions from "@/services/auth/use-auth-actions";
import { useTranslation } from "@/services/i18n/client";
import { isGoogleAuthEnabled } from "@/services/social-auth/google/google-config";
import SocialAuth from "@/services/social-auth/social-auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { track } from "@vercel/analytics";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";

type SignInFormData = {
  email: string;
  password: string;
};

const useValidationSchema = () => {
  const { t } = useTranslation("sign-in");

  return yup.object().shape({
    email: yup
      .string()
      .email(t("sign-in:inputs.email.validation.invalid"))
      .required(t("sign-in:inputs.email.validation.required")),
    password: yup
      .string()
      .min(6, t("sign-in:inputs.password.validation.min"))
      .required(t("sign-in:inputs.password.validation.required")),
  });
};

function Form() {
  const { t } = useTranslation("sign-in");
  const validationSchema = useValidationSchema();
  const { setUser } = useAuthActions();
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<SignInFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (formData: SignInFormData) => {
    try {
      setIsLoading(true);
      const { email, password } = formData;
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error?.message) {
        toast.error(t("sign-in:alerts.error.description"));
      } else {
        setUser(data.user as any);
        router.push("/app");
      }
    } catch (error) {
      toast.error(t("sign-in:alerts.error.description"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className="z-50 flex w-[512px] flex-col gap-y-4 rounded-xl border border-neutral-100 bg-white mt-4 p-8 shadow-lg"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="flex flex-col gap-y-2 justify-center items-center">
          <Logo size={50} />
          <h3 className="scroll-m-20 text-neutral-700 text-2xl font-semibold tracking-tight">
            {t("sign-in:title")}
          </h3>
          <p className="text-sm leading-none text-neutral-400">
            {t("sign-in:description")}
          </p>
        </div>
        <div className="w-full flex flex-col gap-1">
          <Label htmlFor="email"> {t("sign-in:inputs.email.label")}</Label>
          <Input
            {...methods.register("email")}
            name="email"
            id="email"
            placeholder={t("sign-in:inputs.email.placeholder")}
            type="email"
            data-testid="email"
          />
          {errors.email && (
            <span className="text-error my-1 text-xs">
              {errors.email.message}
            </span>
          )}
        </div>
        <div className="w-full flex flex-col gap-1">
          <Label htmlFor="password">{t("sign-in:inputs.password.label")}</Label>
          <Input
            {...methods.register("password")}
            id="password"
            name="password"
            placeholder={t("sign-in:inputs.password.placeholder")}
            type="password"
            data-testid="password"
          />
          {errors.password && (
            <span className="text-error my-1 text-xs">
              {errors.password.message}
            </span>
          )}
          <span className="text-end my-1 text-xs text-neutral-400">
            <Link
              href="/forgot-password"
              className="text-neutral-400 hover:text-neutral-500 font-medium"
              data-testid="forgot-password"
            >
              {t("sign-in:actions.forgotPassword")}
            </Link>
          </span>
        </div>
        <Button
          type="submit"
          data-testid="sign-in-submit"
          onClick={() => track("clicked sign in submit button")}
        >
          {isLoading ? t("sign-in:loading") : t("sign-in:actions.submit")}
        </Button>
        <span className="text-center text-sm text-neutral-400">
          {t("sign-in:dontHaveAccount")}{" "}
          <Link
            data-testid="create-account"
            className="text-neutral-500 hover:text-neutral-600 font-medium"
            href="/sign-up"
          >
            {t("sign-in:actions.createAccount")}
          </Link>
        </span>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-neutral-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-neutral-400">
              {t("sign-up:or")}
            </span>
          </div>
        </div>
        {isGoogleAuthEnabled && <SocialAuth isLogin={true} />}
      </form>
    </FormProvider>
  );
}

function SignIn() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#F5F7FA]">
      <Form />
    </div>
  );
}

export default SignIn;
