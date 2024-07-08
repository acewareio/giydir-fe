"use client";
import { ornek2, ornek5 } from "@/assets";
import { FullPageLoader } from "@/components/full-page-loader";
import Gallery from "@/components/gallery";
import { Button } from "@/components/ui/button";
import {
  useDeleteModel,
  useGetModelMutation,
  useUploadModel,
} from "@/services/api/services/model";
import { AuthContext } from "@/services/auth/auth-context";
import { useTranslation } from "@/services/i18n/client";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { useSteps } from "../context";

interface ImageDataType {
  image: string;
  width: number;
  height: number;
  caption?: string;
  alt?: string;
  baseFile?: File;
  isImageBlob?: boolean;
  id?: string;
}

const placeholderImages: ImageDataType[] = [
  {
    image: ornek5.src,
    width: 320,
    height: 400,
  },
  {
    image: ornek2.src,
    width: 320,
    height: 400,
  },
];

function SelectImage() {
  const { t } = useTranslation("select-image");
  const { setCurrentStep } = useSteps();
  const { user, isLoaded } = useContext(AuthContext); // Get user from AuthContext

  const { mutateAsync } = useGetModelMutation();
  const [userImageDataType, setUserImageDataType] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<ImageDataType[]>([]);
  const [selectedImages, setSelectedImages] = useState<ImageDataType[]>([]);
  const uploadModelsMutation = useUploadModel();
  const deleteModelMutation = useDeleteModel();
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
      setGalleryImages(placeholderImages);
      setIsMounted(true);
    }
  }, [user]);

  const handleRemoveImage = (image: ImageDataType) => {
    if (user) {
      // @ts-ignore
      deleteModelMutation.mutate(image.id, {
        onSuccess: () => {
          setGalleryImages((prevImages) =>
            prevImages.filter((img) => img !== image)
          );
          setSelectedImages((prevSelected) =>
            prevSelected.filter((img) => img !== image)
          );
          toast(t("select-image:delete-success.description"));
        },
        onError: () => {
          toast(t("select-image:delete-error.description"));
        },
      });
    } else {
      setGalleryImages((prevImages) =>
        prevImages.filter((img) => img !== image)
      );
      setSelectedImages((prevSelected) =>
        prevSelected.filter((img) => img !== image)
      );
    }
  };

  const handleSelectImage = async (image: ImageDataType) => {
    if (selectedImages.includes(image)) {
      setSelectedImages((prevSelected) =>
        prevSelected.filter((img) => img !== image)
      );
      setUserImageDataType(null);
    } else {
      setSelectedImages([image]);
      // @ts-ignore
      setUserImageDataType(image);
    }
  };

  const handleImageUpload = (file: File) => {
    const newImage: ImageDataType = {
      image: URL.createObjectURL(file),
      baseFile: file,
      isImageBlob: true,
      width: 320,
      height: 400,
      caption: file.name,
    };

    if (user?.id) {
      const formData = new FormData();
      formData.append("name", file.name);
      formData.append("image", file);

      uploadModelsMutation.mutate(formData, {
        onSuccess: (response) => {
          const uploadedImage: ImageDataType = {
            image: URL.createObjectURL(file),
            id: response.id,
            width: 320,
            height: 400,
            caption: file.name,
          };
          setGalleryImages((prevImages) => [uploadedImage, ...prevImages]);
          setUserImageDataType(file);

          toast.success(t("select-image:create-success.description"));
        },
        onError: () => {
          toast.error(t("select-image:create-error.description"));
        },
      });
    } else {
      setGalleryImages((prevImages) => [newImage, ...prevImages]);
    }
  };

  const continueHandler = () => {
    if (!userImageDataType) return;
    indexedDB.deleteDatabase("giydir");

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

      store.add({ id: "userImage", image: userImageDataType });
    };

    request.onerror = function () {
      console.error("Error", request.error);
    };

    setCurrentStep(2);
  };

  if (!isMounted) {
    return <FullPageLoader isLoading />;
  }

  return (
    <div className="flex gap-4 flex-col min-h-[calc(100vh-200px)] w-full items-center justify-center text-neutral-900">
      <div className="mx-auto w-full max-w-xl text-center p-5 rounded-xl lg:mb-20">
        <Gallery
          images={galleryImages}
          selectedImages={selectedImages}
          // @ts-ignore
          onRemove={handleRemoveImage}
          // @ts-ignore
          onSelect={handleSelectImage}
          onUpload={handleImageUpload}
          gridType="flex"
          className="!overflow-x-hidden py-1"
        />
        <Button
          className="mt-4"
          variant="black"
          disabled={!userImageDataType}
          onClick={continueHandler}
        >
          {t("select-image:continueButton")}
        </Button>
      </div>
    </div>
  );
}

export default SelectImage;
