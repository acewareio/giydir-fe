import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const supabase = createClientComponentClient();

const fetchModels = async (): Promise<any> => {
  const { data } = await supabase.auth.getSession();

  if (!data?.session?.access_token) {
    return Promise.reject("No access token found");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/model`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${data.session.access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch models");
  }

  return response.json();
};

export const useGetModel = () => {
  return useQuery<any, Error>({
    queryKey: ["models"],
    queryFn: fetchModels,
  });
};

export const useGetModelMutation = () => {
  return useMutation<any, Error>({
    mutationFn: fetchModels,
  });
};

const setDefaultModel = async (modelId: string): Promise<any> => {
  const { data } = await supabase.auth.getSession();

  if (!data?.session?.access_token) {
    return Promise.reject("No access token found");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/model/setDefaultModel`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${data.session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ modelId }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to set default model");
  }

  return response.json();
};

export const useSetDefaultModel = () => {
  return useQuery<any, Error>({
    queryKey: ["set-model"],
    queryFn: () => setDefaultModel(""), // Placeholder, should be handled appropriately
  });
};

const deleteModel = async (modelId: string): Promise<any> => {
  const { data } = await supabase.auth.getSession();

  if (!data?.session?.access_token) {
    return Promise.reject("No access token found");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/model/${modelId}`,
    {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${data.session.access_token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete model");
  }

  return response.json();
};

export const useDeleteModel = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, string>({
    mutationFn: deleteModel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
    },
  });
};

const uploadModel = async (formData: any): Promise<any> => {
  const { data } = await supabase.auth.getSession();

  if (!data?.session?.access_token) {
    return Promise.reject("No access token found");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/model`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${data.session.access_token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload model");
  }

  return response.json();
};

export const useUploadModel = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: (formData) => uploadModel(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
    },
  });
};
