"use client";

import { garment2 } from "@/assets";
import Gallery from "@/components/gallery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/spinner";
import {
  useClothesModelMutation,
  useDeleteClothes,
  useUploadClothes,
} from "@/services/api/services/clothes";
import { useScrapeService } from "@/services/api/services/scrape";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { ImageDataType } from "@/services/api/types/image";
import { useAuthContext } from "@/services/auth/auth-context";
import { useTranslation } from "@/services/i18n/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";
import { useSteps } from "../context";

type ProductFormData = {
  url: string;
};

type RemoteProductData = {
  title: string;
  image: File;
  type: string;
  source: string;
};

const imagesData: ImageDataType[] = [
  {
    image: garment2.src,
    width: 320,
    height: 400,
  },
];

const providerURLs = [
  {
    name: "trendyol",
    alias: ["trendyol.com", "ty.gl"],
  },
  {
    name: "amazon",
    alias: ["amazon.com"],
  },
];

const getProviderName = (url: string): string | null => {
  for (const provider of providerURLs) {
    for (const alias of provider.alias) {
      if (url.includes(alias)) {
        return provider.name;
      }
    }
  }
  return null;
};

function SelectProduct() {
  const { user, isLoaded } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { setCurrentStep } = useSteps();
  const [ImageDataType, setImageDataType] = useState<
    File | RemoteProductData | null
  >(null);

  const [galleryImages, setGalleryImages] =
    useState<ImageDataType[]>(imagesData);
  const [selectedImages, setSelectedImages] = useState<ImageDataType[]>([]);
  const { t } = useTranslation("select-product");
  const useValidationSchema = () => {
    return yup.object().shape({
      url: yup.string().url().required(t("select-product:emptyFieldError")),
    });
  };
  const validationSchema = useValidationSchema();
  const scrapeService = useScrapeService();

  const { mutateAsync } = useClothesModelMutation();
  const deleteClothesMutation = useDeleteClothes();
  const uploadClothesMutation = useUploadClothes();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isMounted || isLoaded) return;
    const fetchModels = async () => {
      if (user?.id) {
        const fetchedModels = await mutateAsync();
        const fetchedImages = fetchedModels.data;
        setGalleryImages(fetchedImages);
        setIsMounted(true);
      }
    };

    if (user?.id) {
      fetchModels();
    } else {
      setGalleryImages(imagesData);
      setIsMounted(true);
    }
  }, [user]);

  // useEffect(() => {
  //   if (clothesData) {
  //     setGalleryImages(clothesData.data);
  //   }
  //   const getUser = async () => {
  //     const session = await supabase.auth.getSession();

  //     setSession(session.data.session);
  //   };
  //   getUser();

  const methods = useForm<ProductFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      url: "",
    },
  });

  const { handleSubmit, setError } = methods;

  const onSubmit = async (formData: ProductFormData) => {
    const { url } = formData;

    const providerName = getProviderName(url);

    if (providerName) {
      try {
        setIsLoading(true);

        const payload = {
          url,
          type: providerName,
        };

        const response = await scrapeService(payload);
        if (response.status === HTTP_CODES_ENUM.OK || response.status === 201) {
          toast(t("select-product:toastSuccess.description"));

          const { product } = response.data;

          const finalProductData = {
            title: product.title,
            image: product.image,
            type: providerName,
            source: "remote",
          };

          setImageDataType(finalProductData);

          const newImage: ImageDataType = {
            image: product.image,
            width: 320,
            height: 400,
            caption: product.title,
            type: providerName,
            source: "remote",
          };

          setGalleryImages((prevImages) => [newImage, ...prevImages]);
        } else {
          toast(t(""));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("url", {
        type: "custom",
        message: t("select-product:wrongUrl"),
      });
    }
  };

  const handleRemoveImage = (image: ImageDataType) => {
    // @ts-ignore
    deleteClothesMutation.mutate(image.id, {
      onSuccess: () => {
        const filteredImages = galleryImages.filter(
          (img) => img.id !== image.id
        );
        setGalleryImages(filteredImages);
        toast(t("select-image:delete-success.description"));
      },
      onError: () => {
        toast(t("select-image:delete-error.description"));
      },
    });
  };

  const handleSelectImage = async (image: ImageDataType) => {
    if (selectedImages.includes(image)) {
      setSelectedImages((prevSelected) =>
        prevSelected.filter((img) => img !== image)
      );
      setImageDataType(null);
    } else {
      setSelectedImages([image]);
      setImageDataType({
        // @ts-ignore
        image: image.image ? image.image : image.url,
        title: image.caption ?? "",
        type: image.type ?? "",
        source: image.source ?? "local",
      });
    }
  };

  const handleImageUpload = (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("name", file.name);
    formData.append("image", file);
    const newImage: ImageDataType = {
      image: URL.createObjectURL(file),
      width: 320,
      height: 400,
      caption: file.name,
    };

    if (user?.id) {
      uploadClothesMutation.mutate(formData, {
        onSuccess: (response) => {
          const newImage: ImageDataType = {
            image: URL.createObjectURL(file),
            id: response.id, // Assuming response contains the id of the uploaded image
            width: 320,
            height: 400,
            caption: file.name,
          };
          setGalleryImages((prevImages) => [newImage, ...prevImages]);
          toast(t("select-product:create-success.description"));
        },
        onError: () => {
          toast(t("select-product:create-error.description"));
        },
        onSettled: () => {
          setIsUploading(false);
        },
      });
    } else {
      setGalleryImages((prevImages) => [newImage, ...prevImages]);
    }
  };

  const continueHandler = () => {
    if (!ImageDataType) return;
    // set ImageDataType to indexedDB
    let db: IDBDatabase;
    const request = indexedDB.open("giydir", 1);

    request.onupgradeneeded = function () {
      db = request.result;
      db.createObjectStore("images", { keyPath: "id" });
    };

    request.onsuccess = function () {
      db = request.result;
      const transaction = db.transaction("images", "readwrite");
      const store = transaction.objectStore("images");

      store.add({
        id: "productImage",
        image: {
          // @ts-ignore
          data: ImageDataType.image, // @ts-ignore
          source: ImageDataType.source ?? "local",
          provider: ImageDataType.type, // @ts-ignore
          title: ImageDataType.title,
        },
      });
    };

    request.onerror = function () {
      console.error("Error", request.error);
    };

    setCurrentStep(3);
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-[550px] w-full flex flex-col gap-2 md:py-12 py-4 px-4 md:px-0">
      <Label htmlFor="name" className="mb-2">
        {t("select-product:urlTitle.title")}
        <span className="font-normal ml-2 text-neutral-400">
          {t("select-product:urlTitle.info")}
        </span>
      </Label>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-1 items-start"
      >
        <div className="flex w-full gap-1">
          <div className="w-full">
            <Input
              id="name"
              type="text"
              placeholder={t("select-product:inputUrlPlaceholder")}
              {...methods.register("url")}
            />
          </div>

          <Button
            className="h-10 w-10 hover:bg-neutral-100"
            size={"icon"}
            variant={"outline"}
            type="submit"
          >
            {isLoading ? (
              <LoadingSpinner width={16} height={16} />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>
        {methods.formState.errors.url && (
          <p className="ml-2 mt-1 text-xs text-error">
            {methods.formState.errors.url.message}
          </p>
        )}
      </form>
      <div className="flex gap-4 flex-col w-full items-center justify-center text-neutral-900">
        <Gallery // @ts-ignore
          gridType="flex"
          // @ts-ignore
          images={galleryImages}
          // @ts-ignore
          className="!overflow-x-hidden py-2 px-1 flex justify-center sm:justify-start"
          selectedImages={selectedImages}
          onRemove={handleRemoveImage}
          onSelect={handleSelectImage}
          onUpload={handleImageUpload}
          isUploading={isUploading}
        />
      </div>
      <Button
        onClick={continueHandler}
        variant="black"
        disabled={selectedImages.length === 0}
      >
        {t("select-product:continueButton")}
      </Button>
    </div>
  );
}

export default SelectProduct;
