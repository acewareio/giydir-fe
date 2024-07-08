import Link from "next/link";
import { useGetMe } from "@/services/api/services/me";
import { twMerge } from "tailwind-merge";
import { GemIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "@/services/i18n/client";

const TokenBadge = () => {
  const { t } = useTranslation("token-badge");
  const { data: meData } = useGetMe();
  // @ts-ignore
  if (meData?.success == false || meData?.tokenCount === null) return null;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Link
            href={"#"}
            className={twMerge(
              "bg-white border border-purple  flex items-center sm:gap-2 tracking-wider py-2 sm:px-4 px-1 text-[0.7rem] rounded-md text-black"
            )}
          >
            {
              // @ts-ignore
              meData?.tokenCount !== null && (
                <>
                  <GemIcon className="sm:h-4 sm:w-4 h-3 w-3 mr-1 text-purple" />
                  <span className="text-purple">{meData?.tokenCount}</span>
                </>
              )
            }
          </Link>{" "}
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("token-badge:tooltip-text")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TokenBadge;
