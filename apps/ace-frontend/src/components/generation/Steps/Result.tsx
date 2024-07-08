"use client";
import { EcommerceCard } from "@/app/[language]/page-content";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { FastAuth } from "@/components/app/modals/FastAuth";
import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";

import FeedbackWidget from "@/components/feedback";
import ShareModal from "@/components/shareSocialModal";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "@/services/i18n/client";
import { track } from "@vercel/analytics";
import { Download, Link, Share2, X } from "lucide-react";

export const ResultModal = ({
  image,
  onClose,
  title,
}: {
  image: string;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
}) => {
  const [isShareModalOpen, setShareModalOpen] = React.useState(false);
  const [copySuccess, setCopySuccess] = React.useState("");
  const { t } = useTranslation("result");

  const handleDownload = (url: string | URL | Request, filename: string) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();
      })
      .catch(console.error);
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(
      () => {
        setCopySuccess(t("result:copyToClipboard.onSuccess"));
        setTimeout(() => setCopySuccess(""), 2000);
      },
      (err) => {
        setCopySuccess(t("result:copyToClipboard.onFail"));
        setTimeout(() => setCopySuccess(""), 2000);
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-10 backdrop-blur-sm"
    >
      <div
        onClick={() => onClose(false)}
        className="fixed top-0 z-20 left-0 w-full h-full bg-black bg-opacity-50"
      ></div>
      <div className="z-30 object-cover rounded-xl flex items-center justify-center xl:w-1/3 w-[90%] sm:w-auto lg:w-1/2 h-[95%] relative overflow-hidden sm:py-0 sm:px-0">
        <img src={image} alt="result" className="w-full h-full" />
        <div className="absolute top-2 right-4 flex items-center gap-4 p-2">
          <button
            onClick={() => onClose(false)}
            className="text-purple bg-primary-lighter bg-opacity-50 hover:shadow-md p-3 hover:transition-all hover:duration-200 hover:shadow-purple-light transition-shadow duration-300 rounded-lg"
          >
            <X />
          </button>
        </div>
        <div className="absolute bottom-5 right-5 p-2 flex flex-col items-center gap-2">
          <Button
            className="w-14 h-12 p-3 rounded-xl text-purple hover:text-purple-dark"
            variant="light"
            onClick={() => {
              handleDownload(image, "giydir.jpeg");
              track("click result download");
            }}
          >
            <Download />
          </Button>
          <Button
            variant="light"
            className="w-14 h-12 p-3 rounded-xl text-purple hover:text-purple-dark"
            onClick={() => {
              setShareModalOpen(true);
              track("click result share social media");
            }}
          >
            <Share2 />
          </Button>
          <ShareModal
            isOpen={isShareModalOpen}
            onClose={() => setShareModalOpen(false)}
            url={image}
            title={title}
          />
          <Button
            className="w-14 h-12 p-3 rounded-xl text-purple hover:text-purple-dark"
            variant="light"
            onClick={() => {
              copyToClipboard(image);
              track("copied result link");
            }}
          >
            <Link />
            {copySuccess && (
              <span className="absolute -left-[9.5rem] text-purple bg-white border border-purple rounded-xl py-3 px-2">
                {copySuccess}
              </span>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

function ConnectMotion() {
  return (
    <motion.svg
      className={
        "absolute left-1/2 -translate-x-1/2 sm:-mt-14  mt-52 sm:bottom-0 -z-10"
      }
      width="364"
      height="96"
      viewBox="0 0 364 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        initial={{ pathLength: 0.12, pathSpacing: 0.12, pathOffset: 0.5 }}
        animate={{ pathLength: 0.12, pathSpacing: 0.12, pathOffset: 5 }}
        transition={{
          duration: 12,
          ease: "easeInOut",
          loop: true,
          repeat: Infinity,
          repeatType: "loop",
        }}
        d="M1 43V94.5H180.5M180.5 94.5V0M180.5 94.5H363V37"
        stroke="#FF7373"
        strokeWidth="1.5"
        strokeDasharray="12 24"
      />
    </motion.svg>
  );
}

function Result() {
  const { t } = useTranslation("result");

  const [userImage, setUserImage] = React.useState<{
    base64: string;
    file: File;
  }>();
  const [userImageUrl, setUserImgUrl] = useState(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [isUserImageReady, setIsUserImageReady] = useState(false);
  const supabase = createClientComponentClient();
  const [productImage, setProductImage] = React.useState<{
    base64: string;
    file: File;
  }>();

  const [status, setStatus] = React.useState(t("result:photosLoadingText"));
  const [isResultOpen, setIsResultOpen] = React.useState(false);

  const [isFastAuthOpen, setIsFastAuthOpen] = React.useState(false);

  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = React.useState(false);

  const sseSteps = {
    created: t("result:sseSteps.created"),
    analyzing: t("result:sseSteps.analyzing"),
    drafting: t("result:sseSteps.drafting"),
    completed: t("result:sseSteps.completed"),
  };

  useEffect(() => {
    const getUser = async () => {
      const session = await supabase.auth.getSession();

      if (!session.data.session) {
        // 1500 ms delay for fast auth modal
        setTimeout(() => {
          setIsFastAuthOpen(true);
        }, 2000);
      }

      setSession(session.data.session);
    };
    getUser();

    // add event listener escape key to close result
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsResultOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const queryClient = useQueryClient();

  useEffect(() => {
    let db;
    const dbRequest = indexedDB.open("giydir", 1);

    dbRequest.onsuccess = (event) => {
      db = dbRequest.result;
      const transaction = db.transaction("images", "readwrite");
      const store = transaction.objectStore("images");
      const productImageRequest = store.get("productImage");
      const userImageRequest = store.get("userImage");
      productImageRequest.onsuccess = (event) => {
        const result = productImageRequest.result;

        if (result) {
          setProductImage({
            base64: result.image.data || result.image,
            file: result.image.data as File, // @ts-ignore
            source: result.image.source,
            provider: result.image.provider,
            title: result.image.title,
          });
        }
      };
      userImageRequest.onsuccess = (event) => {
        const result = userImageRequest.result;

        if (result.image) {
          setUserImage({
            base64: result?.image?.image,
            file: result.image as File, // @ts-ignore
            source: result.source,
            isImageBlob: result.image.isImageBlob,
          });
        }
      };
    };
  }, []);

  const userImageQuery = useQuery({
    queryKey: ["uploadUserImage"],
    // @ts-ignore
    enabled: !!userImage?.isImageBlob && !!session,
    queryFn: async () => {
      const formData = new FormData();
      // @ts-ignore
      const media = userImage?.file?.baseFile;
      formData.append("image", media);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/model`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      const { data } = await res.json();
      setUserImgUrl(data.image);
      return data;
    },
  });

  useEffect(() => {
    if (!userImage) return;
    // @ts-ignore
    if (!!userImage?.isImageBlob && !!userImageQuery?.data) {
      setIsUserImageReady(true);
    } // @ts-ignore
    if (!!userImage?.isImageBlob === false) {
      // @ts-ignore
      setUserImgUrl(userImage?.base64);
      setIsUserImageReady(true);
    }
  }, [userImage, userImageQuery?.data]);
  const processQuery = useQuery({
    queryKey: ["process"],
    enabled: isUserImageReady && !!session,
    queryFn: async () => {
      const processData = {
        garm: productImage?.base64,
        customModel: userImageUrl,
      } as unknown as {
        garm: string;
        customModel: string;
      };

      if (processData?.garm && processData.garm.includes("_next")) {
        processData.garm = process.env.NEXT_PUBLIC_URL + processData.garm;
      }

      if (
        processData?.customModel &&
        processData.customModel.includes("_next")
      ) {
        processData.customModel =
          process.env.NEXT_PUBLIC_URL + processData.customModel;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/process/create_process`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify(processData),
        }
      );
      const data = await res.json();
      queryClient.invalidateQueries({ queryKey: ["me"] });
      return data;
    },
  });
  // productImageQuery.data.url;
  const sseQuery = useQuery({
    queryKey: ["sse"],
    enabled: processQuery.isSuccess && !!session,
    queryFn: async () => {
      const eventSource = new EventSource(
        `${process.env.NEXT_PUBLIC_API_URL}/process/sse/${processQuery.data.sse.id}`
      );
      return new Promise((resolve, reject) => {
        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          setStatus(data.status);

          if (data.status === "completed") {
            resolve(data);
            eventSource.close();
          }
        };
      });
    },
  });

  const giydirURL = "https://giydir.ai";

  return (
    <>
      <div className="flex flex-col gap-12 relative">
        <div className="sm:flex flex-col sm:flex-row gap-6 sm:gap-24 sm:visible hidden ">
          <Image
            src={userImage?.base64 as string}
            alt="photo"
            className="rounded-xl h-56 sm:h-[450px] w-80 object-cover relative z-0"
            width={320}
            height={450}
          />
          <EcommerceCard
            resultPage
            className="w-56 max-w-56 flex absolute top-[55%] left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 bg-red-500"
            // @ts-ignore
            source={productImage?.source as string} // @ts-ignore
            product={{
              thumbnail: productImage?.base64 as string, // @ts-ignore
              provider: productImage?.provider, // @ts-ignore
              title: productImage?.title,
            }}
          />

          {
            // @ts-ignore
            sseQuery.data?.output && (
              <button
                onClick={() => {
                  setIsResultOpen(true);
                  track("click result image");
                }}
              >
                <Image
                  // @ts-ignore
                  src={sseQuery.data.output}
                  alt="result"
                  width={320}
                  height={450}
                  className="w-[320px] h-[450px] object-cover rounded-xl"
                />
              </button>
            )
          }
          {
            // @ts-ignore
            !sseQuery.data?.output ?? (
              <p className="absolute right-2 -top-5 text-xs text-neutral-500">
                20-40 sn.
              </p>
            )
          }
          {
            // @ts-ignore
            !sseQuery.data?.output && (
              <div className="w-[320px] h-[250px] sm:h-[450px] bg-gradient-to-b bg-white rounded-xl">
                <div className="  overflow-y-hidden h-6 flex items-center justify-center flex-col text-xs font-medium ml-auto mt-4 mr-4 bg-neutral-200/50 rounded-full w-3/4 px-2 py-1 gap-2">
                  {
                    // @ts-ignore
                    sseSteps[status]
                  }
                </div>
              </div>
            )
          }
          <iframe
            src="https://lottie.host/embed/3b744a42-f18e-4355-9487-691e22010a68/tytkzN31dM.json"
            className="absolute bottom-0 w-20 h-20 right-0"
          ></iframe>
          <ConnectMotion />
        </div>
        <div className="flex flex-col gap-6 sm:hidden mb-20">
          <div className="flex flex-row sm:hidden justify-between relative min-h-max w-full">
            <Image
              src={userImage?.base64 as string}
              alt="photo"
              className="w-[45%] rounded-xl object-cover relative z-0"
              width={160}
              height={225}
            />
            <EcommerceCard
              resultPage
              className="w-[45%] bg-red-500"
              mobileClassName="flex visible object-cover"
              // @ts-ignore
              source={productImage?.source as string} // @ts-ignore
              product={{
                thumbnail: productImage?.base64 as string, // @ts-ignore
                provider: productImage?.provider, // @ts-ignore
                title: productImage?.title,
              }}
            />
            <ConnectMotion />
          </div>
          <div className="relative">
            {
              // @ts-ignore
              sseQuery.data?.output && (
                <button
                  onClick={() => {
                    setIsResultOpen(true);
                    track("click result image");
                  }}
                >
                  <Image
                    // @ts-ignore
                    src={sseQuery.data.output}
                    alt="result"
                    width={160}
                    height={180}
                    className="w-full object-cover rounded-xl mt-6"
                  />
                </button>
              )
            }
            {
              // @ts-ignore
              !sseQuery.data?.output && (
                <div className="min-h-[300px] bg-gradient-to-b bg-white rounded-xl">
                  <div className="overflow-y-hidden h-6 xl:flex items-center justify-center flex-col text-xs text-center  font-medium ml-auto mt-4  xs:mr-4 bg-neutral-200/50 rounded-full  xs:w-3/4 px-2 py-1 gap-2">
                    {
                      // @ts-ignore
                      sseSteps[status]
                    }
                  </div>
                </div>
              )
            }
            <iframe
              src="https://lottie.host/embed/3b744a42-f18e-4355-9487-691e22010a68/tytkzN31dM.json"
              className="absolute bottom-0 w-16 h-16 right-0"
            />
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isResultOpen && (
          <ResultModal // @ts-ignore
            image={sseQuery.data?.output as string}
            title={` ${t("shareText.shareTextPartOne")} | ${t("shareText.shareTextEn")} ${giydirURL}${t("shareText.shareTextPartTwo")}`}
            onClose={setIsResultOpen}
          />
        )}
      </AnimatePresence>
      {isFastAuthOpen && (
        <FastAuth
          supabaseClient={supabase}
          setIsFastAuthOpen={setIsFastAuthOpen}
          setSession={setSession}
        />
      )}

      <div className="fixed bottom-8 right-4">
        <AlertDialog
          open={isFeedbackDialogOpen}
          onOpenChange={setIsFeedbackDialogOpen}
        >
          <AlertDialogTrigger>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant={"light"}>{t("result:feedback")}</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("result:feedbackText")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </AlertDialogTrigger>
          <AlertDialogContent className="h-1/2 w-1/2">
            <FeedbackWidget onSubmit={setIsFeedbackDialogOpen} />
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}

export default Result;
