"use client";

import { useState } from "react";
import { FullPageLoader } from "@/components/full-page-loader";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import GoogleLogo from "@/assets/tutorial/GoogleLogo";
import { useTranslation } from "react-i18next";

export function GoogleSignUp({ redirectTo }: { redirectTo?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation("sign-up");

  const supabase = createClientComponentClient();

  const onSuccess = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectTo ? redirectTo : process.env.NEXT_PUBLIC_URL,
        },
      });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full rounded-lg border border-neutral-400 py-2">
      <button
        onClick={onSuccess}
        type="button"
        className="gap gap-2 w-full flex justify-center items-center"
      >
        <GoogleLogo /> {t("sign-up:google")}
      </button>

      <FullPageLoader isLoading={isLoading} />
    </div>
  );
}

export function GoogleSignIn({ redirectTo }: { redirectTo?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation("sign-up");

  const supabase = createClientComponentClient();

  const onSuccess = async () => {
    try {
      setIsLoading(true);

      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectTo ? redirectTo : process.env.NEXT_PUBLIC_URL,
        },
      });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full rounded-lg border border-neutral-400 py-2">
      <button
        onClick={onSuccess}
        type="button"
        className="gap gap-2 w-full flex justify-center items-center"
      >
        <GoogleLogo /> {t("sign-in:google")}
      </button>

      <FullPageLoader isLoading={isLoading} />
    </div>
  );
}
