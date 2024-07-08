"use client";

import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 button-default",
        light:
          "bg-primary-lighter text-primary hover:bg-primary/80 hover:text-primary-foreground",
        error:
          "bg-error text-error-foreground hover:bg-error/90 h-10 px-4 py-2",
        outline:
          "bg-white border border-neutral-200 *:hover:stroke-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 button-outline",
        black:
          "bg-neutral-900 text-neutral-0 hover:bg-neutral-900/90 button-black h-10 px-4 py-2",
        ghost: "hover:bg-neutral-200 hover:text-neutral-900",
        link: "text-neutral-500 hover:text-primary underline-offset-4 underline outline-offset-[6px] w-auto h-auto text-sm",
        "link-extra-light":
          "text-neutral-300 hover:text-primary outline-offset-[6px] w-auto h-auto text-sm",
        menu: "text-neutral-900 hover:text-primary font-medium outline-offset-[6px] w-auto h-auto text-sm",
        icon: "h-10 w-10 *:hover:stroke-neutral-400",
        none: "*:hover:stroke-neutral-400",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 text-lg py-3 px-4",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
