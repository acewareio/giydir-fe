import { getServerTranslation } from "@/services/i18n";
import type { Metadata } from "next";
import Generation from "./page-content";

type Props = {
  params: { language: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t } = await getServerTranslation(params.language, "generation");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default Generation;
