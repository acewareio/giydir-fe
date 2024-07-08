import type { Metadata } from "next";
import Subscription from "./page-content";
import { getServerTranslation } from "@/services/i18n";

type Props = {
  params: { language: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t } = await getServerTranslation(params.language, "subscription");

  return {
    title: t("subscription:pricing_list"),
  };
}

export default Subscription;
