"use client";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "@/services/i18n/client";
import SocialAuth from "@/services/social-auth/social-auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import * as yup from "yup";
import { isGoogleAuthEnabled } from "@/services/social-auth/google/google-config";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type SignUpFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  kvkk: boolean;
  non_disclosure?: boolean;
};

const useValidationSchema = () => {
  const { t } = useTranslation("sign-up");

  return yup.object().shape({
    firstName: yup
      .string()
      .required(t("sign-up:inputs.firstName.validation.required")),
    lastName: yup
      .string()
      .required(t("sign-up:inputs.lastName.validation.required")),
    email: yup
      .string()
      .email(t("sign-up:inputs.email.validation.invalid"))
      .required(t("sign-up:inputs.email.validation.required")),
    password: yup
      .string()
      .min(6, t("sign-up:inputs.password.validation.min"))
      .required(t("sign-up:inputs.password.validation.required")),
    kvkk: yup.boolean().oneOf([true], "KVKK zorunludur").required(),
  });
};

function Form() {
  const { t } = useTranslation("sign-up");
  const validationSchema = useValidationSchema();

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const supabase = createClientComponentClient();

  const methods = useForm<SignUpFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      kvkk: false,
      non_disclosure: false,
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (formData: SignUpFormData) => {
    setIsLoading(true);

    try {
      const { email, password, firstName, lastName } = formData;
      const { error } = await supabase?.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstName,
            lastName,
          },
        },
      });

      if (error) {
        if (error.status === 422) {
          toast.warning(t("sign-up:errorCodes.code422"));
        }
      } else {
        toast.success(t("sign-up:successCodes.codeSuccess"));
        router.push("/sign-in");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className="z-50 flex w-[512px] flex-col gap-y-4 rounded-xl border border-neutral-100 bg-white mt-4 py-5 px-8 shadow-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex  flex-col gap-y-2 justify-center items-center">
          <Logo size={50} />
          <h3 className="scroll-m-20 text-neutral-700 text-2xl font-semibold tracking-tight">
            {t("sign-up:title")}
          </h3>
          <p className="text-sm leading-none text-neutral-400">
            {t("description")}
          </p>
        </div>
        <div className="w-full flex flex-col gap-1">
          <Label htmlFor="first-name" className="mt-4">
            {t("sign-up:inputs.firstName.label")}
          </Label>
          <Input
            {...methods.register("firstName")}
            placeholder={t("sign-up:inputs.firstName.placeholder")}
            type="text"
            // errorMessage={methods.formState.errors.firstName?.message}
            data-testid="first-name"
          />
        </div>
        <div className="w-full flex flex-col gap-1">
          <Label htmlFor="last-name">
            {t("sign-up:inputs.lastName.label")}
          </Label>

          <Input
            {...methods.register("lastName")}
            placeholder={t("sign-up:inputs.lastName.placeholder")}
            type="text"
            data-testid="last-name"
          />
        </div>
        <div className="w-full flex flex-col gap-1">
          <Label htmlFor="email">{t("sign-up:inputs.email.label")}</Label>

          <Input
            {...methods.register("email")}
            placeholder={t("sign-up:inputs.email.placeholder")}
            type="email"
            data-testid="email"
          />
        </div>
        <div className="w-full flex flex-col gap-1">
          <Label htmlFor="password">{t("sign-up:inputs.password.label")}</Label>

          <Input
            {...methods.register("password")}
            placeholder={t("sign-up:inputs.password.placeholder")}
            type="password"
            data-testid="password"
          />
        </div>
        <div className="flex w-full items-center gap-4">
          <Checkbox
            onCheckedChange={(checked) => methods.setValue("kvkk", !!checked)}
            className="text-black"
            {...methods.register("kvkk")}
            data-testid="kvkk"
          />

          <span className="text-sm text-black">
            <a
              href="https://app.termly.io/policy-viewer/policy.html?policyUUID=1acccd4e-c13e-4a74-99b9-65926c0df85d"
              target="_blank"
            >
              {t("sign-up:inputs.kvkk.label1")} {"  "}
            </a>
            {t("sign-up:and")} {"  "}
            <a
              href="https://app.termly.io/policy-viewer/policy.html?policyUUID=140efcd5-7ad4-4559-8544-ce729aaeb0bf"
              target="_blank"
            >
              {t("sign-up:inputs.kvkk.label2")}
            </a>
            {t("sign-up:inputs.kvkk.label3")}
          </span>
        </div>
        <div className="flex w-full items-center gap-4">
          <Checkbox
            onCheckedChange={(checked) =>
              methods.setValue("non_disclosure", !!checked)
            }
            checked={methods.watch("non_disclosure")}
            className="text-black"
            {...methods.register("non_disclosure")}
            data-testid="non_disclosure"
          />
          <span className="text-sm text-black">
            {t("sign-up:inputs.non_disclosure.label")}
          </span>
        </div>
        {errors.kvkk && (
          <p className="text-sm text-red-dark">{errors.kvkk.message}</p>
        )}
        <Button className="mt-4" type="submit" data-testid="sign-up-submit">
          {isLoading ? t("sign-up:isLoading") : t("sign-up:actions.submit")}
        </Button>
        <span className="text-center text-sm text-neutral-400 ">
          {t("sign-up:actions.accountAlreadyExists")}{" "}
          <Link
            href="/sign-in"
            className="text-neutral-400 hover:text-neutral-500 font-medium"
          >
            {t("sign-up:actions.login")}
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
        {[isGoogleAuthEnabled].some(Boolean) && <SocialAuth isLogin={false} />}
        <p className="text-neutral text-xs text-center">
          {t("sign-up:socialAuthentication")}
        </p>
      </form>
    </FormProvider>
  );
}

function SignUp() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#F5F7FA]">
      <Form />
    </div>
  );
}

export default SignUp;
