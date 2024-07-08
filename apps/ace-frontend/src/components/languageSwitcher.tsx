"use client";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { ChevronDown, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { track } from "@vercel/analytics";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const [language, setLanguage] = useState(i18n.language);

  const changeLanguage = async (newLanguage: string) => {
    setLanguage(newLanguage);
    await i18n.changeLanguage(newLanguage);
    document.cookie = `i18next=${newLanguage}; path=/;`;
    localStorage.setItem("i18nextLng", newLanguage);

    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(/^\/(en|tr)/, `/${newLanguage}`);
    router.push(newPath);
  };

  useEffect(() => {
    language;
  }, [i18n.language]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-x-2 !text-neutral-500 border bg-white border-black rounded-md py-2 px-2">
            <Globe className="w-4 h-4" />
            <div className="flex flex-col uppercase text-xs">
              {i18n.language}
            </div>
            <ChevronDown className="w-4 h-4 !text-neutral-400" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="!min-w-20" align="end" forceMount>
          <DropdownMenuItem
            onSelect={() => {
              changeLanguage("en"), track("changed language with EN");
            }}
            className="text-sm text-center !border-none !outline-none hover:bg-neutral-200 hover:bg-opacity-50 rounded-md transition-all duration-200 hover:transition-all hover:duration-200"
          >
            EN
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              changeLanguage("tr"), track("changed language with TR");
            }}
            className="text-sm text-center !border-none !outline-none hover:bg-neutral-200 hover:bg-opacity-50 rounded-md transition-all duration-200 hover:transition-all hover:duration-200"
          >
            TR
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default LanguageSwitcher;
