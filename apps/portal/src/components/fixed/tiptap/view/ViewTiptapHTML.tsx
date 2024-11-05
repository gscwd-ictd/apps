"use client";

import Underline from "@tiptap/extension-underline";
import { EditorContent, NodeViewContent, NodeViewWrapper, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { FunctionComponent } from "react";
import { Toolbar } from "../../toolbar/view/Toolbar";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import { ViewTipTapProps } from "../utils/tiptap-props";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

export const ViewTiptapHTML: FunctionComponent<ViewTipTapProps> = ({ id, content, viewOnly = false, setContent }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        orderedList: { HTMLAttributes: { class: "list-decimal pl-5" } },
        bulletList: { HTMLAttributes: { class: "list-disc pl-5" } },
        listItem: { HTMLAttributes: { class: "" } },
      }),
      Placeholder.configure({
        placeholder: "Write here ...",
        includeChildren: true,
        emptyEditorClass: "is-editor-empty",
        emptyNodeClass: "my-custom-is-empty-class",
        showOnlyCurrent: false,
        showOnlyWhenEditable: false,
      }),
      Underline,
      Color,
      Image.configure({ inline: true, allowBase64: true }).extend({ name: "ResizableImage" }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "underline text-indigo-500 link" } }),
    ],
    editorProps: { attributes: { class: "p-1 min-h-[4rem] w-full focus:outline-none" } },
    content,
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
  });

  return (
    <div id={id} className="p-2 rounded bg-zinc-200">
      {viewOnly ? null : <Toolbar editor={editor} />}

      <EditorContent editor={editor} contentEditable="false" />
    </div>
  );
};
