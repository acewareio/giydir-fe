"use client";

import { PropsWithChildren, useContext, useMemo, useState } from "react";
import {
  LeavePageActionsContext,
  LeavePageContext,
  LeavePageContextParamsType,
  LeavePageInfoContext,
  LeavePageModalContext,
} from "./leave-page-context";

// Need for leave page logic
// eslint-disable-next-line no-restricted-imports
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NextLink from "next/link";
import { useTranslation } from "../i18n/client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

function Provider(props: PropsWithChildren<{}>) {
  const [isOpen, setIsOpen] = useState(false);
  const [leavePage, setLeavePage] = useState<LeavePageContextParamsType>(null);
  const [leavePageCounter, setIsLeavePage] = useState(0);

  const contextModalValue = useMemo(
    () => ({
      isOpen,
    }),
    [isOpen]
  );

  const contextValue = useMemo(
    () => ({
      isLeavePage: leavePageCounter !== 0,
    }),
    [leavePageCounter]
  );

  const contextInfoValue = useMemo(
    () => ({
      leavePage,
    }),
    [leavePage]
  );

  const contextActionsValue = useMemo(
    () => ({
      trackLeavePage: () => {
        setIsLeavePage((prevValue) => prevValue + 1);
      },
      setLeavePage: (params: LeavePageContextParamsType) => {
        setLeavePage(params);
      },
      untrackLeavePage: () => {
        setLeavePage(null);
        setIsLeavePage((prevValue) => prevValue - 1);
      },
      openModal: () => {
        setIsOpen(true);
      },
      closeModal: () => {
        setIsOpen(false);
      },
    }),
    []
  );

  return (
    <LeavePageContext.Provider value={contextValue}>
      <LeavePageModalContext.Provider value={contextModalValue}>
        <LeavePageActionsContext.Provider value={contextActionsValue}>
          <LeavePageInfoContext.Provider value={contextInfoValue}>
            {props.children}
          </LeavePageInfoContext.Provider>
        </LeavePageActionsContext.Provider>
      </LeavePageModalContext.Provider>
    </LeavePageContext.Provider>
  );
}

function Modal() {
  const { t } = useTranslation("common");
  const { isOpen } = useContext(LeavePageModalContext);
  const { leavePage } = useContext(LeavePageInfoContext);
  const { closeModal } = useContext(LeavePageActionsContext);

  const href = (leavePage?.push ?? leavePage?.replace) || "";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={closeModal}
      modal={true}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      data-testid="want-to-leave-modal"
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle id="alert-dialog-title">
            {t("common:leavePage.title")}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>{t("common:leavePage.message")}</DialogDescription>
        <DialogFooter className="flex items-center">
          <Button
            onClick={closeModal}
            color="primary"
            autoFocus
            data-testid="stay"
          >
            {t("common:leavePage.stay")}
          </Button>

          <NextLink
            color="primary"
            onClick={closeModal}
            href={href}
            replace={!!leavePage?.replace}
            data-testid="leave"
          >
            {t("common:leavePage.leave")}
          </NextLink>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function LeavePageProvider(props: PropsWithChildren<{}> ) {
  const pathname = usePathname()

  return (
    <Provider key={pathname}>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 560,
          damping: 20,
        }}
      >

        {props.children}
      </motion.div>
      <Modal />
    </Provider>
  );
}
