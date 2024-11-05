import { ButtonHTMLAttributes } from "react";

export type ToolbarButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  action:
    | "bold"
    | "italic"
    | "underline"
    | "align-left"
    | "align-center"
    | "align-right"
    | "align-justify"
    | "ordered-list"
    | "bullet-list"
    | "link"
    | "video"
    | "img";

  tooltip: string;
};
