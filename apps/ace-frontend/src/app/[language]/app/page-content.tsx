"use client";
import Gallery from "@/components/gallery";
import LayoutHeader from "@/components/layout-header";
import { Button } from "@/components/ui/button";
import {
  useClothesModel,
  useDeleteClothes,
  useUploadClothes,
} from "@/services/api/services/clothes";
import {
  useDeleteModel,
  useGetModel,
  useUploadModel,
} from "@/services/api/services/model";
import { useProcessModel } from "@/services/api/services/result";
import { useTranslation } from "@/services/i18n/client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { track } from "@vercel/analytics";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface ImageData {
  authorId: string;
  id: string;
  image: string;
  name: string;
}

interface CategoryProps {
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
}

function Category({ children, title, description }: CategoryProps) {
  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="font-semibold text-lg text-neutral-700">{title}</h2>
          {description && (
            <p className="text-sm text-neutral-500">{description}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

function App() {
  const router = useRouter();
  const { t } = useTranslation("app");
  const { data: modelData } = useGetModel();
  const { data: resultData } = useProcessModel();
  const { data: clothesData } = useClothesModel();
  const deleteModelMutation = useDeleteModel();
  const uploadModelMutation = useUploadModel();
  const deleteClothesMutation = useDeleteClothes();
  const uploadClothesMutation = useUploadClothes();

  const [selectedModelImages, setSelectedModelImages] = useState<ImageData[]>(
    []
  );
  const [selectedGarmentImages, setSelectedGarmentImages] = useState<
    ImageData[]
  >([]);
  const supabase = createClientComponentClient();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getUser();
      // @ts-ignore
      setUser(data.user);

      if (!data.user) {
        router.push("/");
      }
    };

    getSession();
  }, [supabase, router]);

  useEffect(() => {
    if (modelData) {
      setSelectedModelImages(modelData.data);
    }
    if (clothesData) {
      setSelectedGarmentImages(clothesData.data);
    }
  }, [modelData, clothesData]);

  const handleRemoveImage = (
    images: ImageData[],
    setImages: React.Dispatch<React.SetStateAction<ImageData[]>>,
    image: ImageData,
    deleteMutation: any
  ) => {
    deleteMutation.mutate(image.id, {
      onSuccess: () => {
        const filteredImages = images.filter((img) => img.id !== image.id);
        setImages(filteredImages);
        toast.success(t("toast.imageDeleteOnSuccess"));
      },
      onError: () => {
        toast.error(t("toast.imageDeleteOnFail"));
      },
    });
  };

  const handleImageUpload = (
    images: ImageData[],
    setImages: React.Dispatch<React.SetStateAction<ImageData[]>>,
    file: File,
    uploadMutation: any
  ) => {
    const newImage: ImageData = {
      image: URL.createObjectURL(file),
      id: "123",
      name: file.name,
      authorId: "1",
    };

    const formData = new FormData();
    formData.append("name", file.name);
    formData.append("image", file);

    uploadMutation.mutate(formData, {
      onSuccess: () => {
        setImages([newImage, ...images]);
        toast.success(t("toast.imageOnSuccess"));
      },
      onError: () => {
        toast.error(t("toast.imageOnFail"));
      },
    });
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <LayoutHeader type="authorize" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-x-12 xl:gap-8 min-h-[calc(100vh-200px)] w-full max-w-7xl px-4 lg:px-16 xl:px-4 mx-auto py-12 justify-start text-neutral-900">
        <div className="w-full flex flex-col gap-4 border p-4 border-neutral-200 rounded-xl shadow-sm">
          <Category
            title={t("app:categories.last-dressed.title")}
            description={t("app:categories.last-dressed.description")}
          >
            <Button
              onClick={() => {
                router.push("/generation");
                track("clicked generation button on Dashboard");
              }}
              className="flex gap-1 items-center"
            >
              {t("app:categories.last-dressed.button")}
              <Plus size={18} />
            </Button>
          </Category>
          <Gallery
            images={resultData?.data || []}
            disableRemoving
            disableSelecting
            disableUploading
            selectedImages={[]}
            onSelect={() => {}}
            onRemove={() => {}}
            onUpload={() => {}}
            isGalleryLoading={resultData ? resultData.isLoading : true}
          />
        </div>

        <div className="flex flex-col gap-4 w-full border p-4 border-neutral-200 rounded-xl shadow-sm">
          <Category
            title={t("app:categories.model-photos.title")}
            description={t("app:categories.model-photos.description")}
          ></Category>
          <Gallery
            images={selectedModelImages}
            selectedImages={[]}
            disableSelecting
            onSelect={() => {}}
            onRemove={(image) => {
              handleRemoveImage(
                selectedModelImages,
                setSelectedModelImages,
                image as ImageData,
                deleteModelMutation
              );
            }}
            onUpload={(file) =>
              handleImageUpload(
                selectedModelImages,
                setSelectedModelImages,
                file,
                uploadModelMutation
              )
            }
            isGalleryLoading={modelData ? modelData.isLoading : true}
          />
        </div>
        <div className="flex flex-col gap-4 w-full border p-4 border-neutral-200 rounded-xl shadow-sm">
          <Category
            title={t("app:categories.my-clothes.title")}
            description={t("app:categories.my-clothes.description")}
          />
          <Gallery
            images={selectedGarmentImages}
            selectedImages={[]}
            disableSelecting
            onSelect={() => {}}
            isGalleryLoading={clothesData ? clothesData.isLoading : true}
            onRemove={(image) =>
              handleRemoveImage(
                selectedGarmentImages,
                setSelectedGarmentImages,
                image as ImageData,
                deleteClothesMutation
              )
            }
            onUpload={(file) =>
              handleImageUpload(
                selectedGarmentImages,
                setSelectedGarmentImages,
                file,
                uploadClothesMutation
              )
            }
          />
        </div>
      </div>
    </>
  );
}

export default App;
