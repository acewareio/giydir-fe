import ConfirmDialogProvider from "@/components/confirm-dialog/confirm-dialog-provider";
import LayoutFooter from "@/components/layout-footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/services/auth/auth-provider";
import { getServerTranslation } from "@/services/i18n";
import "@/services/i18n/config";
import { languages } from "@/services/i18n/config";
import StoreLanguageProvider from "@/services/i18n/store-language-provider";
import LeavePageProvider from "@/services/leave-page/leave-page-provider";
import { CSPostHogProvider } from "@/services/posthog";
import queryClient from "@/services/react-query/query-client";
import QueryClientProvider from "@/services/react-query/query-client-provider";
import ReactQueryDevtools from "@/services/react-query/react-query-devtools";
import GoogleAuthProvider from "@/services/social-auth/google/google-auth-provider";
import { GoogleTagManager } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import { dir } from "i18next";
import type { Metadata } from "next";
import "../globals.css";

type Props = {
  params: { language: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t } = await getServerTranslation(params.language, "common");

  return {
    title: t("title"),
  };
}

export function generateStaticParams() {
  return languages.map((language) => ({ language }));
}

export default function RootLayout({
  children,
  params: { language },
}: {
  children: React.ReactNode;
  params: { language: string };
}) {
  return (
    <html lang={language} dir={dir(language)} className="h-full w-full">
      <body className="relative h-full w-full">
        <GoogleTagManager gtmId="AW-16589271743" />
        <CSPostHogProvider>
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <Analytics />
              <StoreLanguageProvider>
                <ConfirmDialogProvider>
                  <AuthProvider>
                    <GoogleAuthProvider>
                      <LeavePageProvider>
                        {children}
                        <Toaster position="top-right" closeButton />
                        <LayoutFooter />
                      </LeavePageProvider>
                    </GoogleAuthProvider>
                  </AuthProvider>
                </ConfirmDialogProvider>
              </StoreLanguageProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </CSPostHogProvider>
      </body>
    </html>
  );
}
