import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useMutation } from "@tanstack/react-query";

const supabase = createClientComponentClient();

const createCheckout = async (
  variantId: string
): Promise<{
  checkoutUrl: string;
  success: boolean;
}> => {
  const { data } = await supabase.auth.getSession();

  if (!data?.session?.access_token) {
    return {
      checkoutUrl: "",
      success: false,
    };
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/payment/checkout`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${data.session.access_token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ variantId }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create checkout");
  }

  return response.json();
};

export const useCreateCheckoutMutation = () => {
  return useMutation<{ checkoutUrl: string; success: boolean }, Error, string>({
    mutationFn: (variantId: string) => createCheckout(variantId),
  });
};
