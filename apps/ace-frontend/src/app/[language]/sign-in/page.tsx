import { getServerTranslation } from "@/services/i18n";
import type { Metadata } from "next";
import SignIn from "./page-content";

type Props = {
  params: { language: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t } = await getServerTranslation(params.language, "sign-in");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default SignIn;
