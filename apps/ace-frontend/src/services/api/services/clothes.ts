import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const supabase = createClientComponentClient();

// Function to fetch all clothes
const fetchAllClothes = async (): Promise<any> => {
  const { data } = await supabase.auth.getSession();

  if (!data?.session?.access_token)
    return Promise.reject("No access token found");

  const models = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clothes/all`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${data.session?.access_token}`,
    },
  });

  if (!models.ok) {
    throw new Error("Failed to fetch clothes");
  }

  return models.json();
};

// Function to upload clothes
const uploadClothes = async (formData: FormData): Promise<any> => {
  const { data } = await supabase.auth.getSession();

  if (!data?.session?.access_token)
    return Promise.reject("No access token found");

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clothes`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${data.session?.access_token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload clothes");
  }

  return response.json();
};

// Function to delete clothes
const deleteClothes = async (clothesId: string): Promise<any> => {
  const { data } = await supabase.auth.getSession();

  if (!data?.session?.access_token)
    return Promise.reject("No access token found");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/clothes/${clothesId}`,
    {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${data.session?.access_token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete clothes");
  }

  return response.json();
};

// Custom hook to use the fetchAllClothes function with React Query
export const useClothesModel = () => {
  return useQuery<any, Error>({
    queryKey: ["clothes"],
    queryFn: fetchAllClothes,
  });
};

export const useClothesModelMutation = () => {
  return useMutation<any, Error>({
    mutationFn: fetchAllClothes,
  });
};

// Custom hook to use the uploadClothes function with React Query
export const useUploadClothes = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, FormData>({
    mutationFn: uploadClothes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clothes"] });
    },
  });
};

// Custom hook to use the deleteClothes function with React Query
export const useDeleteClothes = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, string>({
    mutationFn: deleteClothes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clothes"] });
    },
  });
};
