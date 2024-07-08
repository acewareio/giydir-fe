"use client";
import { FormProvider, useForm, useFormState } from "react-hook-form";

import { useTranslation } from "@/services/i18n/client";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ForgotPasswordFormData = {
  email: string;
};

const useValidationSchema = () => {
  const { t } = useTranslation("forgot-password");

  return yup.object().shape({
    email: yup
      .string()
      .email(t("forgot-password:inputs.email.validation.invalid"))
      .required(t("forgot-password:inputs.email.validation.required")),
  });
};

function FormActions() {
  const { t } = useTranslation("forgot-password");
  const { isSubmitting } = useFormState();

  return (
    <Button type="submit" disabled={isSubmitting} data-testid="send-email">
      {t("forgot-password:actions.submit")}
    </Button>
  );
}

function Form() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const { t } = useTranslation("forgot-password");
  const validationSchema = useValidationSchema();

  const methods = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = async (formData: ForgotPasswordFormData) => {
    const { email } = formData;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_URL}`,
    });

    if (!error) {
      toast.success(t("forgot-password:success.description"));
      setTimeout(() => {
        router.replace("/");
      }, 3000);
      return;
    }
    toast.error(
      t("forgot-password:error.over_email_send_rate_limit.description")
    );
  };

  return (
    <FormProvider {...methods}>
      <form
        className="z-50  flex w-[512px] flex-col gap-y-2 rounded-lg border border-neutral-100 bg-white mt-4 p-8 shadow-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex  flex-col gap-y-2 justify-center items-center">
          <Logo size={50} />
          <h3 className="scroll-m-20 text-neutral-700 text-2xl font-semibold tracking-tight">
            {t("forgot-password:title")}{" "}
          </h3>
          <p className="text-sm text-center leading-none text-neutral-400">
            {t("forgot-password:description")}
          </p>{" "}
        </div>

        <Label>{t("forgot-password:inputs.email.label")}</Label>
        <Input
          {...methods.register("email")}
          placeholder={t("forgot-password:inputs.email.placeholder")}
          type="email"
          data-testid="email"
        />

        <FormActions />
      </form>
    </FormProvider>
  );
}

function ForgotPassword() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#F5F7FA]">
      <Form />
    </div>
  );
}

export default ForgotPassword;
