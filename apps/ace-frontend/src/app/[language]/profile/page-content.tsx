"use client";
import useAuth from "@/services/auth/use-auth";
// import { useTranslation } from "@/services/i18n/client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/services/i18n/client";
import Link from "next/link";

function Profile() {
  const { user } = useAuth();
  const { t } = useTranslation("profile");
  return (
    <div className="flex min-h-[480px] relative flex-col w-3/4 mx-auto items-center">
      <div className=" w-full flex justify-end p-2 h-36 bg-slate-200 relative">
        <Link
          data-testid="edit-profile"
          className="absolute right-2 -bottom-12"
          href="/profile/edit"
        >
          <Button>{t("profile:actions.edit")}</Button>
        </Link>
      </div>
      <Avatar className="h-32 w-32 -mt-16">
        {/* <AvatarImage
          src={user?.photo?.path}
          alt={user?.firstName + " " + user?.lastName}
        /> */}
        <AvatarFallback>
          {/* <span>
            {user?.firstName?.charAt(0)}
            {user?.lastName?.charAt(0)}
          </span> */}
        </AvatarFallback>
      </Avatar>
      {/* <Link href="/profile/edit">
        <Button>Edit</Button>
      </Link> */}
      <span data-testid="user-email" className="text-sm text-muted-foreground">
        {user?.email}{" "}
      </span>

      <h2
        data-testid="user-name"
        className=" scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0"
      >
        {/* {user?.firstName} {user?.lastName} */}
      </h2>

      <p className=" mt-1"> Software engineer</p>
    </div>
  );
}

export default Profile;
