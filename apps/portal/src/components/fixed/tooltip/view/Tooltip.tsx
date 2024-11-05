"use client";

import { ComponentPropsWithRef, ElementRef, forwardRef } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

const TooltipProvider = TooltipPrimitive.Provider;

const TooltipRoot = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipPortal = TooltipPrimitive.Portal;

const TooltipContent = TooltipPrimitive.Content;

type TooltipProps = ComponentPropsWithRef<typeof TooltipPrimitive.Content> & {
  content: string;
  //options?: TooltipPrimitive.TooltipContentProps;
  withArrow?: boolean;
};

export const Tooltip = forwardRef<ElementRef<typeof TooltipPrimitive.Content>, TooltipProps>(
  ({ content, withArrow = false, children, ...props }, ref) => {
    return (
      <TooltipProvider>
        <TooltipRoot>
          <TooltipTrigger asChild>{children}</TooltipTrigger>
          <TooltipPortal>
            <TooltipContent
              {...props}
              ref={ref}
              className="px-2 py-1 rounded bg-zinc-900 text-zinc-200 z-[100] text-xs"
            >
              {content}
              {withArrow && <TooltipPrimitive.Arrow className="fill-zinc-900" />}
            </TooltipContent>
          </TooltipPortal>
        </TooltipRoot>
      </TooltipProvider>
    );
  }
);

Tooltip.displayName = "Tooltip";
