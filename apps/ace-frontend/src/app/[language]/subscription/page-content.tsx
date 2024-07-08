"use client";

import LayoutHeader from "@/components/layout-header";
import PricingBox from "@/components/subscription/pricing-box";
import { useTranslation } from "@/services/i18n/client";
import React from "react";

const Subscription: React.FC = () => {
  const { t } = useTranslation("subscription");
  const pricingListSplitted = t("pricing_list").split(" ");

  return (
    <div className="">
      <LayoutHeader type="authorize" />
      <div className="container sm:px-20 sm:py-24">
        <div className="flex min-[769px]:flex-row flex-col gap-6 justify-between h-auto lg:gap-4">
          <div className="flex flex-col items-start justify-between lg:w-1/3">
            <div className="flex flex-col gap-2 mb-6 font-semibold ">
              <span className="text-[#6E3FF3] xl:text-5xl lg:text-5xl md:text-4xl text-3xl ">
                {pricingListSplitted[0]}
              </span>
              <span className=" xl:text-5xl lg:text-5xl md:text-4xl text-3xl ">
                {pricingListSplitted[1]}
              </span>{" "}
            </div>
            <PricingBox planKey="extra" />
          </div>
          <div className="lg:w-1/3">
            <PricingBox planKey="free" />
          </div>
          <div className="lg:w-1/3">
            <PricingBox planKey="premium" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
