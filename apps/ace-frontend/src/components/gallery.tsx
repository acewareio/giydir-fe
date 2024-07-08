import { ImageDataType } from "@/services/api/types/image";
import { cx } from "class-variance-authority";
import { Loader2Icon, PlusIcon, XIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { ResultModal } from "./generation/Steps/Result";

interface GalleryProps {
  images: ImageDataType[];
  selectedImages: ImageDataType[];
  onRemove: (image: ImageDataType) => void;
  onSelect: (image: ImageDataType) => void;
  onUpload: (file: File) => void;
  disableSelecting?: boolean;
  disableRemoving?: boolean;
  disableUploading?: boolean;
  isUploading?: boolean;
  isGalleryLoading?: boolean;
  className?: string;
  gridType?: "flex" | "grid";
}

const Gallery: React.FC<GalleryProps> = ({
  images,
  selectedImages,
  onRemove,
  onSelect,
  onUpload,
  disableSelecting = false,
  disableRemoving = false,
  disableUploading = false,
  isUploading = false,
  isGalleryLoading = false,
  className,
  gridType = "grid",
}) => {
  const [isUploadLoading, setIsUploading] = useState(false);
  const [deletingImage, setDeletingImage] = useState<string | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState({
    active: false,
    image: "",
  });

  const handleImageClick = (image: string) => {
    setIsResultModalOpen({ active: true, image });
  };

  const handleCloseModal = () => {
    setIsResultModalOpen({ active: false, image: "" });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (!file) return;

    setIsUploading(true);
    onUpload(file);
    setTimeout(() => {
      setIsUploading(false);
    }, 400);
  };

  const handleImageDelete = async (image: ImageDataType) => {
    setDeletingImage(image.id as string);
    await onRemove(image);
    setTimeout(() => {
      setDeletingImage(null);
    }, 200);
  };

  return (
    <div
      className={`mx-auto w-full ${images.length >= 2 && !className ? "lg:!overflow-y-scroll overflow-x-scroll lg:!overflow-x-hidden" : className} max-h-[65vh] py-2`}
    >
      <div
        className={cx(
          gridType === "flex"
            ? "flex flex-wrap gap-4 pl-2"
            : "xl:grid flex flex-row lg:flex-col xl:grid-cols-2 gap-4 lg:gap-2 xl:gap-4",
          className
        )}
      >
        {!disableUploading && (
          <label className="w-40 xl:w-40 lg:w-52 h-60 xl:h-60 lg:h-72 flex-shrink-0 lg:mx-auto xl:mx-0 lg:mb-4 xl:mb-0 border-2 border-dashed border-neutral-400 group rounded-lg flex items-center justify-center cursor-pointer hover:border-neutral-600 transition duration-200 ease-in-out">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            {isUploading ? (
              <div className="loader"></div>
            ) : (
              <span className="text-xl text-neutral-400 transition duration-200 ease-in-out group-hover:text-neutral-600">
                {isUploadLoading ? (
                  <Loader2Icon className="w-4 h-4 animate-spin" />
                ) : (
                  <PlusIcon className="w-4 h-4" />
                )}
              </span>
            )}
          </label>
        )}
        {isGalleryLoading
          ? Array.from({ length: 1 }).map((_, index) => (
              <div
                key={index}
                className="w-40 h-60 bg-neutral-300 animate-pulse rounded-lg"
              ></div>
            ))
          : images?.map((image, index) => (
              <div
                key={index}
                className={`relative group lg:mx-auto xl:mx-0 lg:mb-4 mb-4 xl:mb-0 flex-shrink-0 w-40 xl:w-40 lg:w-52 h-60 xl:h-60 lg:h-72 ${
                  disableSelecting ? "" : "cursor-pointer"
                } rounded-lg ${
                  selectedImages.includes(image)
                    ? "ring-1 ring-neutral-400"
                    : ""
                }`}
                onClick={() => !disableSelecting && onSelect(image)}
              >
                <button
                  onClick={() => {
                    image.result &&
                      handleImageClick(
                        image.image || image.result || (image.url as string)
                      );
                  }}
                >
                  <Image
                    src={image.image || image.result || (image.url as string)}
                    alt={image.name || ""}
                    layout="fill"
                    objectFit="cover"
                    className={`transition duration-200 ease-in-out rounded-lg ${
                      selectedImages.includes(image) ? "opacity-70" : ""
                    }`}
                  />
                </button>
                {!disableRemoving && image.authorId && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageDelete(image as ImageDataType);
                    }}
                    className={cx(
                      "absolute z-100 text-red -top-2 -right-2 items-center rounded-full bg-neutral-200 p-1 font-medium hidden group-hover:flex cursor-pointer",
                      selectedImages.includes(image)
                        ? "ring-1 ring-inset ring-neutral-200"
                        : "",
                      deletingImage === image.id && "!flex"
                    )}
                  >
                    {deletingImage === image.id ? (
                      <Loader2Icon className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <XIcon className="w-3.5 h-3.5" />
                    )}
                  </div>
                )}
                {/* {selectedImages.includes(image) && !disableSelecting && (
                  <button
                    className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(image as ImageDataType);
                    }}
                  >
                    ✓
                  </button>
                )} */}
              </div>
            ))}
        {isResultModalOpen.active === true && (
          <ResultModal
            image={isResultModalOpen.image}
            title={`İşte benim satın almadan denediklerim! | Giydir.ai'ı denemeyi unutma!`}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default Gallery;
