"use client";
import { useCreateCheckoutMutation } from "@/services/api/services/payment";
import { useAuthContext } from "@/services/auth/auth-context";
import { useTranslation } from "@/services/i18n/client";
import React from "react";
import { toast } from "sonner";
import HangerIcon from "../../../public/icons/HangerIcon";
import TickIcon from "../../../public/icons/TickIcon";
import { Button } from "../ui/button";

interface PricingPlan {
  name: string;
  price: string;
  duration: string;
  usage: string;
  contents?: string[];
  ideal_for: string;
  popular?: boolean;
  button: string;
  variant_id?: string;
}

interface PricingCardProps {
  planKey: string;
}

const PricingBox: React.FC<PricingCardProps> = ({ planKey }) => {
  const { t } = useTranslation("subscription");
  const { t: appT } = useTranslation("app");
  const auth = useAuthContext();

  const plan: PricingPlan = t(`plans.${planKey}`, { returnObjects: true });
  const createCheckoutMutation = useCreateCheckoutMutation();

  const handleCheckout = async () => {
    if (plan.name === "Free") {
      return;
    }

    if (plan.variant_id) {
      if (!auth.user) {
        toast.error(appT("toast.noAuth"));
        return;
      }

      const checkout = await createCheckoutMutation.mutateAsync(
        plan.variant_id
      );

      if (checkout.success) {
        window.open(checkout.checkoutUrl, "_blank");
      } else {
        toast.error(appT("toast.noAuth"));
      }
    }
  };

  return (
    <div
      className={`border-2 w-full min-[1060px]:min-w-[22rem] min-[960px]:max-w-72 ${planKey === "extra" ? "h-auto" : "h-full"} flex flex-col min-[1060px]:max-w-80 py-6 px-8 rounded-[16.09px] border-[#E9EAED] ${plan.popular ? " bg-gradient-to-b from-[#6E3FF321] to-[#6E3FF300]" : "bg-[#fefefe]"} `}
    >
      <div className="flex justify-between items-start">
        <h2 className=" xl:text-2xl mb-4 mt-2 lg:text-xl text-xl font-medium text-[#32353E] ">
          {plan.name}
        </h2>
        {plan.popular && (
          <div className="text-[#6E3FF3] rounded-2xl mt-2 px-2 h-[30px] border-2 border-[#6E3FF329] flex justify-center items-center bg-[#F5F2FD]">
            {t("plans.popular")}
          </div>
        )}
      </div>
      <div className="xl:text-xl mb-2  text-[#949595] lg:text-lg md:text-base text-sm">
        {plan.ideal_for}
      </div>
      <p className="xl:text-3xl text-2xl mt-3 mb-1 text-[#161618] line font-bold">
        {plan.price}
      </p>
      <p className="xl:text-1xl lg:text-xl md:text-lg text-base mb-2 text-[#646A7C]">
        {plan.duration}
      </p>
      <p className=" xl:text-1xl mt-3 lg:text-xl md:text-lg text-base  mb-4 text-[#949595]  flex gap-2 items-center">
        <HangerIcon className=" xl:w-6 xl:h-6 lg:w-5 lg:h-5 md:h-4 md:w-4 w-4 h-4" />{" "}
        {plan.usage}
      </p>

      {plan.contents && (
        <>
          <div className="w-full bg-[#E0E2E6] h-[1.77px]"></div>
          <span className="xl:text-xl lg:text-lg md:text-base my-5 ">
            {t("content")}
          </span>
          <div className="flex flex-col gap-2 mb-4">
            {plan.contents.map((content, index) => (
              <div className="flex gap-2 items-start w-full">
                <div className="mt-1">
                  <TickIcon className="h-5 w-5  whitespace-nowrap flex-shrink" />
                </div>

                <span
                  className="text-[#949595] xl:text-lg lg:text-base md:text-sm text-sm"
                  key={index}
                >
                  {content}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
      <Button
        className={`mt-auto !px-6 ${plan.name === "Free" ? "md:text-xs" : "text-md"}`}
        variant={plan.name === "Free" ? "outline" : "default"}
        onClick={handleCheckout}
        disabled={plan.name === "Free"}
      >
        {plan.button}
      </Button>
    </div>
  );
};

export default PricingBox;
