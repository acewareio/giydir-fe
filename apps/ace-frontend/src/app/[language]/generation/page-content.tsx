// Generation.tsx
"use client";
import Result from "@/components/generation/Steps/Result";
import SelectImage from "@/components/generation/Steps/SelectImage";
import SelectProduct from "@/components/generation/Steps/SelectProduct";
import Tutorial from "@/components/generation/Tutorial";
import { StepsProvider, useSteps } from "@/components/generation/context";
import LayoutHeader from "@/components/layout-header";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useGetMe } from "@/services/api/services/me";
import { useTranslation } from "@/services/i18n/client";
import { track } from "@vercel/analytics";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const steps = [<SelectImage />, <SelectProduct />, <Result />];

function Generation() {
  const { data: meData } = useGetMe();
  // const router = useRouter();
  const searchParams = useSearchParams();
  const { currentStep, setCurrentStep } = useSteps();
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const { t } = useTranslation("generation");

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      setTimeout(() => {
        setCurrentStep(3);
      }, 1000);
    }

    // @ts-ignore
    if (meData?.success != false && meData?.tokenCount === 0) {
      toast.error(t("noCountToast"));

      // setTimeout(() => {
      // router.push("/tr/subscription");
      //}, 2000);
    }

    const tutorialDone = localStorage.getItem("tutorial");
    if (tutorialDone !== "true") {
      setIsTutorialOpen(true);
    }
  }, [meData, searchParams, ,]);

  // if step is changed, track with vercel analytics
  useEffect(() => {
    track("generation step", {
      step: currentStep,
    });
  }, [currentStep]);

  const toggleTutorial = () => {
    localStorage.setItem("tutorial", "false");
    setIsTutorialOpen(!isTutorialOpen);
  };

  return (
    <>
      <LayoutHeader currentStep={currentStep} type="generation" />
      {isTutorialOpen && <Tutorial />}

      <div className="flex min-h-[80vh] w-full items-center justify-center text-neutral-900">
        {steps[currentStep - 1]}
      </div>

      {currentStep === 1 && (
        <div className="flex justify-center">
          <Button
            onClick={() => {
              toggleTutorial(), track("toggle tutorial on generation");
            }}
            className="bg-white transition-all duration-300 hover:transition-all hover:duration-300 hover:!bg-white hover:shadow-sm flex items-center gap-2 tracking-wider py-2 px-4 text-xs rounded-md text-purple"
          >
            <Logo size={10} />
            {t("generation:onboarding-tutorial")}
          </Button>
        </div>
      )}
    </>
  );
}

export default function ProvidedOnboard() {
  return (
    <StepsProvider>
      <Generation />
    </StepsProvider>
  );
}
