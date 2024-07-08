import { useQuery } from "@tanstack/react-query";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Define a User type based on the expected API response
interface User {
  id: string;
  name: string;
  email: string;
  tokenCount: number;
  // Add other user properties as needed
}

const supabase = createClientComponentClient();

// Function to fetch the user data from the API
const fetchUser = async (): Promise<User> => {
  const { data } = await supabase.auth.getSession();

  if (!data?.session?.access_token)
    return Promise.reject("No access token found");

  const meResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${data.session?.access_token}`,
    },
  });

  return meResponse.json();
};

// Custom hook to use the fetchUser function with React Query
export const useGetMe = () => {
  return useQuery<User, Error>({
    queryKey: ["me"],
    queryFn: fetchUser,
  });
};
