import { JSONContent } from "@tiptap/react";

export type TiptapProps = {
  id: string;
  content: JSONContent | string | null;
  setContent: (content: string | JSONContent | null) => void;
  viewOnly?: boolean;
  editable?: boolean;
  type?: "JSON" | "HTML";
  className?: string;
};

export type ViewTipTapProps = {
  id: string;
  content: string;
  setContent: (content: string) => void;
  viewOnly?: boolean;
  editable?: boolean;
};
