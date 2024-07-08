import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "@tanstack/react-query";

const supabase = createClientComponentClient();

export enum ResultStatus {
  CREATED = "CREATED",
  RUNNING = "RUNNING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

// Function to fetch the user data from the API
const fetchAllProcesses = async (): Promise<any> => {
  const { data } = await supabase.auth.getSession();

  if (!data?.session?.access_token)
    return Promise.reject("No access token found");

  const models = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/process/all?status=${ResultStatus.SUCCESS}`,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${data.session?.access_token}`,
      },
    }
  );

  return models.json();
};

// Custom hook to use the fetchUser function with React Query
export const useProcessModel = () => {
  return useQuery<any, Error>({
    queryKey: ["processes"],
    queryFn: fetchAllProcesses,
  });
};
