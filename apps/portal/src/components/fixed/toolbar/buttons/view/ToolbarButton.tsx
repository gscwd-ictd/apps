"use client";

import { forwardRef, useContext } from "react";
import { ToolbarButtonProps } from "../utils/toolbar-button-props";
import { Tooltip } from "../../../tooltip/view/Tooltip";
import { ToolbarContext } from "../../view/Toolbar";

export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ action, tooltip, children, ...props }, ref) => {
    const { editor } = useContext(ToolbarContext);

    if (!editor) return null;

    return (
      <Tooltip content={tooltip} side="bottom" sideOffset={1}>
        <button
          ref={ref}
          {...props}
          className={`${
            editor.isActive(action) ? "bg-zinc-100 text-zinc-100" : "text-zinc-500 hover:text-zinc-500"
          } p-1 rounded-sm transition-colors duration-200`}
        >
          {children}
        </button>
      </Tooltip>
    );
  }
);
ToolbarButton.displayName = "ToolbarButton";
