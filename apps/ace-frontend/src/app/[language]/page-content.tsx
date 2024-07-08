"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

import Marquee from "react-fast-marquee";

import { amazon, trendyol } from "@/assets";
import LayoutHeader from "@/components/layout-header";
import { example_models } from "@/constants/seed";
import useRandomInterval from "@/hooks/useRandomInterval";
import { cn } from "@/lib/utils";
import { track } from "@vercel/analytics";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Trans, useTranslation } from "@/services/i18n/client";
import CookieConsent from "react-cookie-consent";
import { twMerge } from "tailwind-merge";
import { TupleToUnion } from "type-fest";

type Models = TupleToUnion<typeof example_models>;

const contentMotionProps = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 20, opacity: 0 },
};

function Letter({ letter, key }: { letter: string; key: string }) {
  return (
    <motion.span
      key={key}
      transition={{ ease: "backInOut", duration: 0.6 }}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      className="text-[#FF7373] w-96"
    >
      {letter}
    </motion.span>
  );
}

function ConnectMotion({ className }: { className?: string }) {
  return (
    <motion.svg
      className={className}
      width="120"
      height="120"
      viewBox="0 0 107 105"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        initial={{ pathLength: 0.12, pathSpacing: 0.12, pathOffset: 0.2 }}
        animate={{ pathLength: 0.12, pathSpacing: 0.12, pathOffset: 5 }}
        transition={{
          duration: 12,
          ease: "easeInOut",
          loop: true,
          repeat: Infinity,
          repeatType: "loop",
        }}
        strokeWidth={2}
        stroke-dasharray="16 16"
        d="M1 0V104H107"
        stroke="#FF7373"
        stroke-width="2"
      />
    </motion.svg>
  );
}

export function EcommerceCard(
  props: Models & {
    className?: string;
    resultPage?: boolean;
    mobileClassName?: string;
  }
) {
  function processUrl(url: string): [boolean, string] {
    if (!url) return [false, ""];
    if (url.startsWith("https://")) {
      return [true, url.slice(8).replace(/^www\./, "")];
    } else if (url.startsWith("http://")) {
      return [false, url.slice(7).replace(/^www\./, "")];
    } else if (url.startsWith("www.")) {
      return [false, url.slice(4)];
    } else {
      return [false, url];
    }
  }

  const { t } = useTranslation("home");

  // @ts-ignore
  const [isSafe, url] = processUrl(props.product?.url);

  interface ComponentInterface {
    href?: string;
    target?: string;
    className?: string;
  }

  const Component =
    props.source === "remote"
      ? "a"
      : ("div" as unknown as React.FC<ComponentInterface>);

  return (
    <div key={url ?? "productData"} className={props.className}>
      <Component
        {...(props.source === "remote" && { href: props.product.url })}
        {...(props.source === "remote" && { target: "_blank" })}
        className={cn(
          props.mobileClassName
            ? props.mobileClassName
            : "hidden sm:flex flex-col gap-2 w-64  xl:top-auto xl:translate-x-0",
          !props.resultPage &&
            "absolute left-1/2 -translate-x-1/2 top-56 xl:-bottom-12 xl:-left-12"
        )}
      >
        {/* {props.source === "remote" && (
          <div className="hidden xl:flex text-xs font-medium bg-neutral-200/50 rounded-full w-3/4 px-2 py-1 gap-2">
            <EarthLock
              size={16}
              className={cn(
                "flex-shrink-0",
                isSafe ? "text-green" : "text-neutral-400"
              )}
            />
            <span className="w-full truncate text-neutral-500">{url}</span>
          </div>
        )} */}

        <div className="bg-white w-full p-4 rounded-lg shadow-[0px_6px_6px_0px_rgba(0,0,0,0.04)] overflow-hidden relative">
          <motion.div
            transition={{ ease: "backInOut", duration: 0.6 }}
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 1 }}
          >
            <Image
              src={props.product.thumbnail}
              alt="product"
              className={twMerge(
                !props.mobileClassName && "h-88 w-64 object-cover",
                props.resultPage && !props.mobileClassName && "w-48 h-72",
                props.mobileClassName && props.mobileClassName
              )}
              width={150}
              height={150}
            />

            {/* {props.source === "remote" && (
              <div className="flex gap-2 font-medium text-neutral-400 text-xs">
                {!!props.product.rate ? (
                  <>
                    <Ratings
                      rating={props.product.rate.point}
                      size={12}
                      variant="yellow"
                    />
                    {`${props.product.rate.count} degerlendirme`}
                  </>
                ) : (
                  props.product.created_date
                )}
              </div>
            )} */}
            <div className="pt-3">
              <h1 className="text-neutral-900 font-medium text-xs sm:text-md">
                {props.source === "remote" &&
                  props.product?.title.slice(0, 40) + "..."}
                {props.source === "local" && t("home:e-commerce-card.title")}
              </h1>
              <p className="text-[0.6rem] text-neutral-500 capitalize sm:mt-1">
                {props.source === "remote" && (
                  <span className="pr-0.5">{t("home:sales_on")}</span>
                )}
                <span className="font-medium text-neutral-800">
                  {props.source === "remote" &&
                    props.product?.provider.slice(0, 1).toUpperCase() +
                      props.product?.provider.slice(1)}
                  {props.source === "local" &&
                    t("home:e-commerce-card.provider")}
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      </Component>
    </div>
  );
}

function Home() {
  const { t } = useTranslation("home");

  const letter = [t("1"), t("2"), t("3"), t("4")];

  const [selectedWord, setSelectedWord] = useState<string>(letter[0]);
  const [selectedModel, setSelectedModel] = useState<Models>(example_models[0]);

  useRandomInterval<string>(letter, setSelectedWord, 1500);
  useRandomInterval<Models>(example_models, setSelectedModel, 5000);

  return (
    <>
      <LayoutHeader />

      <main className="max-w-7xl px-4 md:px-12  flex flex-col xl:flex-row xl:items-center mx-auto p-4 mb-64">
        <div className="md:mt-12 xl:mt-0 flex items-center xl:items-start flex-col gap-5 flex-shrink-0 xl:w-1/2">
          <motion.h1
            {...contentMotionProps}
            transition={{ ease: "circInOut", duration: 0.5, delay: 0.1 }}
            className="text-center text-6xl md:text-8xl xl:text-left bg-clip-text text-transparent bg-gradient-to-r from-[#414D5A] to-[#2B343F] font-bold"
          >
            {t("slogan1")} <br />
            <Letter letter={selectedWord} key={selectedWord} /> {t("slogan2")}
          </motion.h1>
          <motion.p
            {...contentMotionProps}
            transition={{ ease: "circInOut", duration: 0.5, delay: 0.2 }}
            className="text-center text-lg text-neutral-400 xl:text-left"
          >
            <Trans t={t} i18nKey="description" components={{ br: <br /> }} />
          </motion.p>

          <motion.div
            className="w-full mx-auto flex  justify-center xl:justify-start gap-2 xl:ml-0 max-w-xs"
            {...contentMotionProps}
            transition={{ ease: "circInOut", duration: 0.5, delay: 0.3 }}
          >
            <Link href="/generation">
              <Button
                onClick={() => track("click go to generation")}
                size="lg"
                className="w-full xl:w-auto"
              >
                {t("home:try_it_now")}
              </Button>
            </Link>
            <Link
              target="_blank"
              href={
                "https://chromewebstore.google.com/detail/giydir/hfecjbippecjkigihbbhlnlmnopcgcma?hl=tr&authuser=2"
              }
            >
              <Button
                onClick={() => track("click go to extension")}
                size="lg"
                className="w-full xl:w-auto"
                variant={"outline"}
              >
                {t("home:extension")}
              </Button>
            </Link>
          </motion.div>

          <motion.div
            {...contentMotionProps}
            transition={{ ease: "circInOut", duration: 0.5, delay: 0.4 }}
          >
            <Marquee
              autoFill
              className="max-w-md mt-5"
              gradient
              gradientColor="#f6f8fa"
            >
              <div className="flex z-10 items-start grayscale relative">
                <Image
                  src={trendyol}
                  alt="trendyol"
                  width={110}
                  height={40}
                  className="ml-6"
                />
                <Image
                  src={amazon}
                  alt="amazon"
                  width={80}
                  height={40}
                  className="ml-6"
                />
              </div>
            </Marquee>
            <p className="text-xs text-neutral-400">{t("home:platform")}</p>
          </motion.div>
        </div>

        <motion.div
          className="w-full h-full p-12 relative flex flex-col items-center sm:flex-row justify-center gap-4 xl:block"
          transition={{ ease: "circInOut", duration: 0.5, delay: 0.6 }}
          {...contentMotionProps}
        >
          <motion.div
            transition={{ ease: "backInOut", duration: 0.6 }}
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 1 }}
            className="h-88 w-64 xl:ml-24 rounded-[24px] overflow-hidden relative"
          >
            <Image
              src={selectedModel.photo}
              alt="user_photo"
              className="h-88 w-64 object-cover"
              width={256}
              height={352}
            />
          </motion.div>
          <div className="bg-neutral-100 relative h-88 w-64 xl:ml-64 overflow-hidden xl:-mt-12 rounded-[24px] xl:border-[12px] border-[#f6f8fa]">
            <motion.div
              key={selectedModel.result}
              transition={{ ease: "backInOut", duration: 0.6 }}
              initial={{ opacity: 0.2 }}
              animate={{ opacity: 1 }}
            >
              <Image
                src={selectedModel.result}
                alt="result_photo"
                className="h-88 w-64 object-cover"
                width={256}
                height={352}
              />
            </motion.div>
          </div>

          <ConnectMotion className="absolute top-1/2 translate-y-1/2 -mt-4 left-44 hidden xl:block" />

          <EcommerceCard {...selectedModel} />
        </motion.div>
      </main>
      <CookieConsent
        location="bottom"
        buttonText="Kabul ediyorum"
        cookieName="myAwesomeCookieName2"
        style={{ background: "#f2f2f2", color: "#4e503b" }}
        buttonStyle={{
          color: "#f2f2f2",
          background: "#6E3FF3",
          fontSize: "13px",
        }}
        expires={150}
      >
        {t("home:cookies.title")}{" "}
        <Link
          target="_blank"
          href="https://app.termly.io/policy-viewer/policy.html?policyUUID=618aae32-d278-4cac-9e6e-b8e306344e6c"
        >
          {t("home:cookies.click")}
        </Link>
      </CookieConsent>
    </>
  );
}

export default Home;
