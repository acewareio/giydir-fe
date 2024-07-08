"use client";

import { useEffect } from "react";

import { useAuthConfirmEmailService } from "@/services/api/services/auth";
import { useRouter } from "next/navigation";

import { LoadingSpinner } from "@/components/ui/spinner";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import { toast } from "sonner";

export default function ConfirmEmail() {
  const fetchConfirmEmail = useAuthConfirmEmailService();
  const router = useRouter();
  const { t } = useTranslation("confirm-email");

  useEffect(() => {
    const confirm = async () => {
      const params = new URLSearchParams(window.location.search);
      const hash = params.get("hash");

      if (hash) {
        const { status } = await fetchConfirmEmail({
          hash,
        });

        if (status === HTTP_CODES_ENUM.NO_CONTENT) {
          toast.warning(t("confirm-email:emailConfirmed"));
          router.replace("/profile");
        } else {
          toast.error(t("confirm-email:emailNotConfirmed"));
          router.replace("/");
        }
      }
    };

    confirm();
  }, [fetchConfirmEmail, router, toast, t]);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
