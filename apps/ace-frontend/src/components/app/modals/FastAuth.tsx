// FastAuth.tsx
import FeatureIcon from "@/components/common/featureIcon";
import { useSteps } from "@/components/generation/context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/services/i18n/client";
import SocialAuth from "@/services/social-auth/social-auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { Session, SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Lock } from "lucide-react";
import React, { SetStateAction, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";

type SignInFormData = {
  email: string;
  password: string;
};

type SignUpFormData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

type SignInProps = {
  submitHandler: (formData: SignInFormData) => void;
  children: React.ReactNode;
};

type SignUpProps = {
  submitHandler: (formData: SignUpFormData) => void;
  children: React.ReactNode;
};

const SignupScreen = ({ submitHandler, children }: SignUpProps) => {
  const validationSchema = useValidationSchemaSignUp();
  const { t } = useTranslation("sign-up");

  const methods = useForm<SignUpFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col gap-3"
        onSubmit={handleSubmit(submitHandler)}
      >
        <div>
          <Label className="mb-1 inline-block text-neutral-900">
            {t("sign-up:inputs.firstName.label")}
            <span className="text-blue text-sm tracking-[-0.6%]">*</span>
          </Label>
          <Input
            {...methods.register("firstName")}
            placeholder={t("sign-up:inputs.firstName.placeholder")}
          />
          {errors.firstName && (
            <p className="text-error p-1">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <Label className="mb-1 inline-block text-neutral-900">
            {t("sign-up:inputs.lastName.label")}
            <span className="text-blue text-sm tracking-[-0.6%]">*</span>
          </Label>
          <Input
            {...methods.register("lastName")}
            placeholder={t("sign-up:inputs.lastName.placeholder")}
          />
          {errors.lastName && (
            <p className="text-error p-1">{errors.lastName.message}</p>
          )}
        </div>
        <div>
          <Label className="mb-1 inline-block text-neutral-900">
            {t("sign-up:inputs.email.label")}
            <span className="text-blue text-sm tracking-[-0.6%]">*</span>
          </Label>
          <Input
            {...methods.register("email")}
            placeholder={t("sign-up:inputs.email.placeholder")}
            type="email"
          />
          {errors.email && (
            <p className="text-error p-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Label className="mb-1 inline-block text-neutral-900">
            {t("sign-up:inputs.password.label")}
            <span className="text-blue text-sm tracking-[-0.6%]">*</span>
          </Label>
          <Input
            {...methods.register("password")}
            placeholder={t("sign-up:inputs.password.placeholder")}
            type="password"
          />
          {errors.password && (
            <p className="text-error p-1">{errors.password.message}</p>
          )}
        </div>
        {children}
      </form>
    </FormProvider>
  );
};

const useValidationSchemaSignUp = () => {
  const { t } = useTranslation("sign-up");

  return yup.object().shape({
    email: yup
      .string()
      .email(t("sign-up:inputs.email.validation.invalid"))
      .required(t("sign-up:inputs.email.validation.required")),
    password: yup
      .string()
      .min(6, t("sign-up:inputs.password.validation.min"))
      .required(t("sign-up:inputs.password.validation.required")),
    firstName: yup
      .string()
      .min(2, t("sign-up:inputs.firstName.validation.min"))
      .required(t("sign-up:inputs.firstName.validation.required")),
    lastName: yup
      .string()
      .min(2, t("sign-up:inputs.lastName.validation.min"))
      .required(t("sign-up:inputs.lastName.validation.required")),
  });
};

const useValidationSchemaSignIn = () => {
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

const LoginScreen = ({ submitHandler, children }: SignInProps) => {
  const { t } = useTranslation("fast-auth");

  const validationSchema = useValidationSchemaSignIn();

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

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col gap-3"
        onSubmit={handleSubmit(submitHandler)}
        noValidate
      >
        <div>
          <Label className="mb-1 inline-block text-neutral-900">
            {t("fast-auth:form.email")}
            <span className="text-blue text-sm tracking-[-0.6%]">*</span>
          </Label>
          <Input
            type="email"
            {...methods.register("email")}
            placeholder={t("fast-auth:form.emailPlaceholder")}
          />
          {errors.email && (
            <p className="text-error p-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Label className="mb-1 inline-block text-neutral-900">
            {t("fast-auth:form.password")}
            <span className="text-blue text-sm tracking-[-0.6%]">*</span>
          </Label>
          <Input
            {...methods.register("password")}
            type="password"
            placeholder={t("fast-auth:form.passwordPlaceholder")}
          />
          {errors.password && (
            <p className="text-error p-1">{errors.password.message}</p>
          )}
          {children}
        </div>
      </form>
    </FormProvider>
  );
};

export const FastAuth = ({
  setIsFastAuthOpen,
  supabaseClient,
  setSession,
}: {
  setIsFastAuthOpen: React.Dispatch<SetStateAction<boolean>>;
  supabaseClient: SupabaseClient;
  setSession: React.Dispatch<SetStateAction<Session | null>>;
}) => {
  const [screen, setScreen] = useState<"signup" | "login">("signup");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation("fast-auth");
  const { setCurrentStep } = useSteps();
  const redirectUrl = `${window.location.origin}/generation`;

  const screenChangeHandler = () => {
    setScreen((prevScreen) => (prevScreen === "signup" ? "login" : "signup"));
  };

  const onSignUpSubmit = async (formData: SignUpFormData) => {
    try {
      setIsLoading(true);
      const { email, password, firstName, lastName } = formData;
      const { data, error } = await supabaseClient.auth.signUp({
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
        toast.error(t("fast-auth:alerts.error.description"));
      } else {
        setSession(data.session);
        setCurrentStep(3);
        setIsFastAuthOpen(false);
      }
    } catch (error) {
      toast.error(t("fast-auth:alerts.error.description"));
    } finally {
      setIsLoading(false);
    }
  };

  const onSignInSubmit = async (formData: SignInFormData) => {
    try {
      setIsLoading(true);
      const { email, password } = formData;
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setSession(data.session);
        setCurrentStep(3);
        setIsFastAuthOpen(false);
      }
    } catch (error) {
      toast(t("fast-auth:alerts.error.description"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open>
      <DialogContent>
        <DialogHeader className="flex flex-row items-center gap-4">
          <FeatureIcon>
            <Lock />
          </FeatureIcon>
          <div className="flex flex-col text-left gap-2">
            <DialogTitle className="font-medium">
              {screen === "signup"
                ? t("fast-auth:register")
                : t("fast-auth:login")}
            </DialogTitle>
            <DialogDescription className="text-sm text-neutral-500">
              {t("fast-auth:dialogDescription.oneThPeace")}{" "}
              {screen === "signup"
                ? t("fast-auth:dialogDescription.ifItIsNotUser")
                : t("fast-auth:dialogDescription.ifUser")}{" "}
              {t("fast-auth:dialogDescription.twoThPeace")}{" "}
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogDescription>
          <div className="flex flex-col gap-3">
            {screen === "signup" ? (
              <SignupScreen submitHandler={onSignUpSubmit}>
                <div className="flex w-full items-center justify-center my-2">
                  <button
                    type="button"
                    onClick={screenChangeHandler}
                    className="text-neutral-500 text-sm underline font-medium"
                  >
                    {t("fast-auth:alreadyRegisteredText")}
                  </button>
                </div>
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? "Loading..." : t("fast-auth:register")}
                </Button>
                <SocialAuth isLogin={false} redirectTo={redirectUrl} />
              </SignupScreen>
            ) : (
              <LoginScreen submitHandler={onSignInSubmit}>
                <div className="flex w-full items-center justify-center my-3">
                  <button
                    type="button"
                    onClick={screenChangeHandler}
                    className="text-neutral-500 text-sm underline font-medium"
                  >
                    {t("fast-auth:noAccountText")}
                  </button>
                </div>
                <Button
                  className="w-full mb-3"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : t("fast-auth:login")}
                </Button>
                <SocialAuth isLogin={true} redirectTo={redirectUrl} />
              </LoginScreen>
            )}
          </div>
        </DialogDescription>
        <DialogFooter className="!flex-col"></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
