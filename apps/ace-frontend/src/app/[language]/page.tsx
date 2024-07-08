import { getServerTranslation } from "@/services/i18n";
import type { Metadata } from "next";

import Home from "./page-content";

type Props = {
  params: { language: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t } = await getServerTranslation(params.language, "home");

  return {
    title: t("title"),
    description: t("seo-description"),
  };
}

export default Home;
