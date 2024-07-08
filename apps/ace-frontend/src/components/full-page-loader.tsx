import { LoadingSpinner } from "@/components/ui/spinner";

type FullPageLoaderType = {
  isLoading: boolean;
};

export function FullPageLoader({ isLoading }: FullPageLoaderType) {
  if (!isLoading) return null;
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
