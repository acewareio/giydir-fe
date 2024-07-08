"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Switch } from "@/components/ui/switch";

export function ModeToggle({
  className,
  ...props
}: React.ComponentProps<typeof Switch> & {
  className?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  const { setTheme } = useTheme();

  return (
    <Switch
      className={className}
      {...props}
      checked={props.checked}
      onCheckedChange={(checked) => {
        setTheme(checked ? "dark" : "light");
        props.onCheckedChange(checked);
      }}
    />
  );
}
