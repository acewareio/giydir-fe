import type { Metadata } from "next";
import ProfilePasswordChange from "./page-content";
import { getServerTranslation } from "@/services/i18n";

type Props = {
  params: { language: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t } = await getServerTranslation(params.language, "profile");

  return {
    title: t("title1"),
  };
}

export default ProfilePasswordChange;
