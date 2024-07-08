"use client";

import { image, ornek1, ornek2, ornek3, ornek4, ornek5 } from "@/assets";
import BackgroundIcon from "@/assets/tutorial/bg-icon";
import PositionIcon from "@/assets/tutorial/position-icon";
import { useTranslation } from "@/services/i18n/client";
import { Tabs } from "@radix-ui/react-tabs";
import i18n from "i18next";
import { Camera, Circle, Smile } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import React, { useEffect, useState } from "react";
import FeatureIcon from "../common/featureIcon";
import { Ratings } from "../common/rate";
import { Button } from "../ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { TabsList, TabsTrigger } from "../ui/tabs";

type TutorialsData = {
  id: number;
  title: string;
  icon: React.ReactNode;
  active: boolean;
  description: string;
  images: StaticImageData[];
};
let tutorial_data: TutorialsData[] = [];

const createTutorialData = () => {
  if (!i18n) return;
  const tutorial_data2 = [
    {
      id: 1,
      title: i18n?.t("tutorial:background.title"),
      icon: <BackgroundIcon />,
      active: true,
      description: i18n?.t("tutorial:background.description"),
      images: [ornek5, ornek1],
    },
    {
      id: 2,
      title: i18n?.t("tutorial:exposure.title"),
      icon: <PositionIcon />,
      active: false,
      description: i18n?.t("tutorial:exposure.description"),
      images: [ornek2, ornek3],
    },
    {
      id: 3,
      title: i18n?.t("tutorial:cameraAngle.title"),
      icon: <Camera size={15} />,
      active: false,
      description: i18n?.t("tutorial:cameraAngle.description"),
      images: [ornek4, image],
    },
  ];
  tutorial_data = tutorial_data2;
};

const currentItem = (data: TutorialsData[]) =>
  data.find((item) => item.active) ?? tutorial_data[0];

function TutorialStep({ data }: { data: TutorialsData[] }) {
  const activeItem = currentItem(data);

  return (
    <Tabs value={activeItem?.title} className="w-full">
      <TabsList className="w-full">
        {data.map((item) => {
          return (
            <TabsTrigger className="w-full flex gap-2" value={item.title}>
              {item.icon} {item.title}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}

function TutorialCarousel({
  data,
  currentCarousel,
  setCurrentCarousel,
  api,
  setApi,
}: {
  data: TutorialsData;
  currentCarousel: number;
  setCurrentCarousel: React.Dispatch<React.SetStateAction<number>>;
  api: CarouselApi;
  setApi: React.Dispatch<React.SetStateAction<CarouselApi>>;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrentCarousel(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrentCarousel(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <>
      <Carousel
        setApi={setApi}
        className="rounded-xl w-full overflow-hidden bg-neutral-100/50"
      >
        <CarouselContent>
          {data.images.map((item) => (
            <CarouselItem className="w-full flex justify-center">
              <Image
                src={item}
                alt="example"
                height={300}
                objectFit="cover"
                draggable="false"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {data.images.length > 1 && (
        <Ratings
          rating={currentCarousel}
          totalStars={count}
          Icon={<Circle />}
          variant="tutorial"
          size={10}
          className="mx-auto flex gap-2"
        />
      )}
    </>
  );
}

function Tutorial() {
  const { t } = useTranslation("tutorial");
  if (!i18n) return;
  createTutorialData();

  const [tutorial, setTutorial] = useState<boolean>();
  const [data, setData] = useState<TutorialsData[]>(tutorial_data);
  const [currentIndex, setCurrentIndex] = useState<number>(
    tutorial_data.indexOf(currentItem(data))
  );
  const [currentCarousel, setCurrentCarousel] = useState<number>(0);
  const [api, setApi] = useState<CarouselApi>();

  const lastStep =
    data.length - 1 === currentIndex &&
    currentItem(data).images.length - 1 !== currentCarousel;

  async function newStep() {
    if (!api) return;

    if (currentCarousel < data[currentIndex].images.length) {
      api.scrollNext();
      setCurrentCarousel((prev) => prev);
    }

    // Eğer son fotoğrafı gördüyse ve başka fotoğraf yoksa
    if (currentCarousel >= data[currentIndex].images.length) {
      const nextIndex = currentIndex + 1;
      if (nextIndex < data.length) {
        setCurrentIndex(nextIndex);
        setCurrentCarousel(0); // İlk fotoğraftan başla
        setData(
          data.map((item, idx) => ({
            ...item,
            active: idx === nextIndex,
          }))
        );
        api.scrollTo(0); // Carousel'i ilk fotoğrafa resetle
      }
    }
  }

  function completed() {
    localStorage.setItem("tutorial", "true");
    setTutorial(false);
  }

  useEffect(() => {
    if (localStorage.getItem("tutorial") !== "true")
      setTimeout(() => setTutorial(true), 1000);
  }, []);

  return (
    <Dialog open={tutorial}>
      <DialogContent close={false}>
        <DialogHeader className="flex flex-row items-center gap-4">
          <FeatureIcon>
            <Smile />
          </FeatureIcon>

          <div className="flex flex-col text-left gap-2">
            <DialogTitle className="font-medium">
              {t("tutorial:dialog.title")}
            </DialogTitle>

            <DialogDescription className="text-sm text-neutral-500">
              {t("tutorial:dialog.description")}
            </DialogDescription>
          </div>
        </DialogHeader>

        <TutorialStep data={data} />

        <span className="my-2 text-sm">{currentItem(data).description}</span>

        <TutorialCarousel
          api={api}
          setApi={setApi}
          data={currentItem(data)}
          currentCarousel={currentCarousel}
          setCurrentCarousel={setCurrentCarousel}
        />

        <DialogFooter>
          <Button
            onClick={() => (lastStep ? completed() : newStep())}
            className="w-full"
            variant={lastStep ? "default" : "black"}
          >
            {lastStep
              ? t("tutorial:dialog.buttonLastStep")
              : t("tutorial:dialog.button")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Tutorial;
