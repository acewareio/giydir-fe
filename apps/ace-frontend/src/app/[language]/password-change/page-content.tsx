"use client";
import { useTranslation } from "@/services/i18n/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm, useFormState } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import Logo from "@/components/logo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type PasswordChangeFormData = {
  password: string;
  passwordConfirmation: string;
};

const useValidationSchema = () => {
  const { t } = useTranslation("password-change");

  return yup.object().shape({
    password: yup
      .string()
      .min(6, t("password-change:inputs.password.validation.min"))
      .required(t("password-change:inputs.password.validation.required")),
    passwordConfirmation: yup
      .string()
      .oneOf(
        [yup.ref("password")],
        t("password-change:inputs.passwordConfirmation.validation.match")
      )
      .required(
        t("password-change:inputs.passwordConfirmation.validation.required")
      ),
  });
};

function FormActions() {
  const { t } = useTranslation("password-change");
  const { isSubmitting } = useFormState();

  return (
    <Button type="submit" disabled={isSubmitting} data-testid="set-password">
      {t("password-change:actions.submit")}
    </Button>
  );
}

function ExpiresAlert() {
  const { t } = useTranslation("password-change");
  const params = useSearchParams();
  const errorCode = params.get("error_code");

  return (
    errorCode && (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t("password-change:error")}</AlertTitle>
        <AlertDescription>
          {t("password-change:alerts.expired")}
        </AlertDescription>
      </Alert>
    )
  );
}

function Form() {
  const supabase = createClientComponentClient();

  const { t } = useTranslation("password-change");
  const validationSchema = useValidationSchema();
  const router = useRouter();

  const methods = useForm<PasswordChangeFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = async (formData: PasswordChangeFormData) => {
    const { password } = formData;

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (!error) {
      toast.success(t("password-change:alerts.success.description"));
      router.replace("/");
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className="z-50 flex w-[512px] flex-col gap-y-2 rounded-xl border border-neutral-100 bg-white mt-4 p-8 shadow-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex  flex-col gap-y-2 justify-center items-center">
          <Logo size={50} />
          <h3 className="scroll-m-20 text-neutral-700 text-2xl font-semibold tracking-tight">
            {t("password-change:title")}{" "}
          </h3>
          <p className="text-sm leading-none">
            {t("password-change:description")}{" "}
          </p>
          <ExpiresAlert />
        </div>

        <Label>{t("password-change:inputs.password.label")}</Label>
        <Input
          {...methods.register("password")}
          placeholder={t("password-change:inputs.password.placeholder")}
          type="password"
          data-testid="password"
        />

        <Label>{t("password-change:inputs.passwordConfirmation.label")}</Label>
        <Input
          {...methods.register("passwordConfirmation")}
          placeholder={t(
            "password-change:inputs.passwordConfirmation.placeholder"
          )}
          type="password"
          data-testid="password-confirmation"
        />

        <FormActions />
      </form>
    </FormProvider>
  );
}

function PasswordChange() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F5F7FA]">
      <Image className="z-10 p-6" src="/grid.svg" alt="background" fill />
      <Form />
    </div>
  );
}

export default PasswordChange;
