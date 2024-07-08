"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { AuthContext } from "@/services/auth/auth-context";
import useAuthActions from "@/services/auth/use-auth-actions";
import { useTranslation } from "@/services/i18n/client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { track } from "@vercel/analytics";
import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import Logo from "./logo";
import TokenBadge from "./token-badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import LanguageSwitcher from "./languageSwitcher";

type Status = "default" | "active" | "completed";
interface Props {
  type?: "authorize" | "generation";
  currentStep?: number;
}

interface Steps {
  id: number;
  label: string;
  status: Status;
}

interface CheckBageProps {
  children: React.ReactNode;
  status?: Status;
}

function CheckBage({ children, status = "default" }: CheckBageProps) {
  const statusClass = {
    default:
      "border border-neutral-200 bg-white text-neutral-700 button-outline",
    active: "bg-primary text-white",
    completed: "bg-green text-white",
  };

  return (
    <div
      className={cn(
        "font-medium rounded-full text-xs md:h-5 md:w-5 w-3 h-3 flex items-center justify-center",
        statusClass[status]
      )}
    >
      {status !== "completed" ? (
        children
      ) : (
        <CheckIcon className="md:h-3 md:w-3 h-2 w-2" />
      )}
    </div>
  );
}

function Steps({ currentStep }: { currentStep: number }) {
  const { t } = useTranslation("layout-header");
  const [steps, setSteps] = useState<Steps[]>([
    { id: 1, label: t("layout-header:steps.selectImage"), status: "active" },
    { id: 2, label: t("layout-header:steps.selectProduct"), status: "default" },
    { id: 3, label: t("layout-header:steps.result"), status: "default" },
  ]);

  useEffect(() => {
    const updatedSteps: Steps[] = steps.map((step) => {
      if (step.id < currentStep) {
        return { ...step, status: "completed" };
      } else if (step.id === currentStep) {
        return { ...step, status: "active" };
      } else {
        return { ...step, status: "default" };
      }
    });

    setSteps(updatedSteps);
  }, [currentStep]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {steps.map((step, idx) => (
          <React.Fragment key={idx + step.id}>
            <BreadcrumbItem
              key={step.id}
              className={cn(
                "cursor-pointer text-xs",
                step.status === "active"
                  ? "text-neutral-900"
                  : "text-neutral-500"
              )}
            >
              <CheckBage status={step.status}>{step.id}</CheckBage>
              <BreadcrumbLink>{step.label}</BreadcrumbLink>
            </BreadcrumbItem>
            {steps.length - 1 !== idx && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function UserDropdown() {
  const router = useRouter();
  const { setUser } = useAuthActions();
  const { user } = useContext(AuthContext);
  const { t } = useTranslation("layout-header");

  const logoutHandler = async () => {
    try {
      const supabase = createClientComponentClient();
      await supabase.auth.signOut();
      setUser(null);
      localStorage.clear();
      router.push("/");
    } catch (error) {
      console.error(error, "logout error");
    }
  };

  return (
    <div className="ml-auto flex items-center space-x-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="border relative h-8 w-8 rounded-full"
          >
            <Avatar data-testId="PersonIcon" className="h-8 w-8">
              <AvatarImage
                src={user?.user_metadata?.avatar_url}
                alt={
                  user?.user_metadata?.firstName +
                  " " +
                  user?.user_metadata?.lastName
                }
              />
              <AvatarFallback>
                <span>
                  {user?.user_metadata?.firstName?.charAt(0)}
                  {user?.user_metadata?.lastName?.charAt(0)}
                </span>
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1 border-b border-neutral-200 pb-3">
              <p className="text-sm font-medium leading-none">
                {user && user.user_metadata?.full_name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user && user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          {/* <DropdownMenuItem data-testid="logout-menu-item">
            <button className="w-full flex gap-x-2 items-center">
              {t("layout-header:auth.subscription")}{" "}
              <span className="text-purple text-xs px-2 py-0.5 rounded-full bg-white border border-purple-light">
                {t("layout-header:auth.plan")}{" "}
              </span>
            </button>
          </DropdownMenuItem> */}
          <DropdownMenuItem
            data-testid="logout-menu-item"
            onClick={() => logoutHandler()}
          >
            <button className="w-full text-left">
              {t("layout-header:auth.logout")}
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function LayoutHeader({ type = "authorize", currentStep = 1 }: Props) {
  const { t } = useTranslation("layout-header");
  const { user } = useContext(AuthContext);

  const authorizedComponents = user ? (
    <div className="flex items-center gap-4">
      <TokenBadge />
      <LanguageSwitcher />
      <UserDropdown />
    </div>
  ) : (
    <div className="flex items-center gap-4">
      <LanguageSwitcher />
      <Link className="relative" href={"/sign-in"}>
        <Button onClick={() => track("click sign in")}>
          {t("layout-header:auth.signin")}
        </Button>
      </Link>
    </div>
  );

  return (
    <div className="border-b border-neutral-200 w-full flex items-center md:px-12 px-4 py-2">
      <div
        className={cn(
          "flex items-center h-16 w-full justify-between mx-auto max-w-7xl relative",
          type === "generation" && "after:content-[''] after:relative"
        )}
      >
        <div className="sm:w-8 sm:h-8 h-6 w-6">
          <Logo size={48} />
        </div>

        {type === "generation" ? (
          <>
            <div className="absolute top-1/2 sm:left-1/2 left-56 w-[90%] sm:w-auto -translate-x-1/2 -translate-y-1/2">
              <Steps currentStep={currentStep} />
            </div>
            <div className="ml-auto">
              <TokenBadge />
            </div>
          </>
        ) : (
          authorizedComponents
        )}
      </div>
    </div>
  );
}
export default LayoutHeader;
