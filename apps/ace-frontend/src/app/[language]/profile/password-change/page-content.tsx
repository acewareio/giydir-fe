"use client";
import { useAuthPatchMeService } from "@/services/api/services/auth";
import { FormProvider, useForm, useFormState } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import useLeavePage from "@/services/leave-page/use-leave-page";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "@/components/ui/link";
import { toast } from "sonner";

type EditProfileChangePasswordFormData = {
  oldPassword: string;
  password: string;
  passwordConfirmation: string;
};

const useValidationChangePasswordSchema = () => {
  const { t } = useTranslation("profile");

  return yup.object().shape({
    oldPassword: yup
      .string()
      .min(6, t("profile:inputs.password.validation.min"))
      .required(t("profile:inputs.password.validation.required")),
    password: yup
      .string()
      .min(6, t("profile:inputs.password.validation.min"))
      .required(t("profile:inputs.password.validation.required")),
    passwordConfirmation: yup
      .string()
      .oneOf(
        [yup.ref("password")],
        t("profile:inputs.passwordConfirmation.validation.match")
      )
      .required(t("profile:inputs.passwordConfirmation.validation.required")),
  });
};

function ChangePasswordFormActions() {
  const { t } = useTranslation("profile");
  const { isSubmitting, isDirty } = useFormState();
  useLeavePage(isDirty);

  return (
    <Button data-testid="save-password" type="submit" disabled={isSubmitting}>
      {t("profile:actions.submit")}
    </Button>
  );
}

function FormChangePassword() {
  const fetchAuthPatchMe = useAuthPatchMeService();
  const { t } = useTranslation("profile");
  const validationSchema = useValidationChangePasswordSchema();

  const methods = useForm<EditProfileChangePasswordFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      oldPassword: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const { handleSubmit, setError, reset } = methods;

  const onSubmit = async (formData: EditProfileChangePasswordFormData) => {
    const { data, status } = await fetchAuthPatchMe({
      password: formData.password,
      oldPassword: formData.oldPassword,
    });

    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (
        Object.keys(data.errors) as Array<
          keyof EditProfileChangePasswordFormData
        >
      ).forEach((key) => {
        setError(key, {
          type: "manual",
          message: t(
            `profile:inputs.${key}.validation.server.${data.errors[key]}`
          ),
        });
      });

      return;
    }

    if (status === HTTP_CODES_ENUM.OK) {
      reset({
        oldPassword: "",
        password: "",
        passwordConfirmation: "",
      });

      toast.success(t("profile:alerts.password.success"));
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col gap-2 w-full p-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-xl mb-2"> {t("profile:title2")}</h1>

        <Label htmlFor="oldPassword">
          {t("profile:inputs.oldPassword.label")}
        </Label>
        <Input
          {...methods.register("oldPassword")}
          placeholder={t("profile:inputs.oldPassword.placeholder")}
          type="password"
          data-testid="old-password"
          // errorMessage={methods.formState.errors.oldPassword?.message}
        />

        <Label htmlFor="password"> {t("profile:inputs.password.label")}</Label>
        <Input
          {...methods.register("password")}
          placeholder={t("profile:inputs.password.placeholder")}
          type="password"
          data-testid="new-password"
          // errorMessage={methods.formState.errors.password?.message}
        />

        <Label htmlFor="passwordConfirmation">
          {t("profile:inputs.passwordConfirmation.label")}
        </Label>
        <Input
          {...methods.register("passwordConfirmation")}
          placeholder={t("profile:inputs.passwordConfirmation.placeholder")}
          type="password"
          data-testid="password-confirmation"
          // errorMessage={methods.formState.errors.passwordConfirmation?.message}
        />

        <ChangePasswordFormActions />

        <Button asChild>
          <Link
            href="/profile"
            data-testid="cancel-edit-profile"
            className={buttonVariants({ variant: "light" })}
          >
            {t("profile:actions.cancel")}
          </Link>
        </Button>
      </form>
    </FormProvider>
  );
}

function FormChangePasswordWrapper() {
  return <FormChangePassword />;
}

function ProfilePasswordChange() {
  return (
    <>
      <div className="w-3/4 mx-auto flex flex-col mt-4 md:flex-row gap-12 items-center justify-center">
        <FormChangePasswordWrapper />
      </div>
    </>
  );
}

export default ProfilePasswordChange;
