"use client";

import { FunctionComponent, useCallback, useContext } from "react";
import { ToolbarButton } from "../buttons/view/ToolbarButton";
import { ToolbarContext } from "./Toolbar";

export const FormatLink: FunctionComponent = () => {
  const { editor } = useContext(ToolbarContext);

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  return (
    <ToolbarButton
      tooltip="Link"
      action="link"
      onClick={setLink}
      className={editor?.isActive("link") ? "is-active" : ""}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1"
        stroke="black"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
        />
      </svg>
    </ToolbarButton>
  );
};
