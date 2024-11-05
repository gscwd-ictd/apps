"use client";

import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { FunctionComponent } from "react";
import { Toolbar } from "../../toolbar/view/Toolbar";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import { TiptapProps } from "../utils/tiptap-props";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

export const Tiptap: FunctionComponent<TiptapProps> = ({
  id,
  content,
  setContent,
  viewOnly = false,
  editable = true,
  type = "JSON",
  className = "p-2 rounded bg-zinc-200/50",
}) => {
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
      TextAlign.configure({
        // defaultAlignment: "justify",
        types: ["heading", "paragraph"],
      }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "underline text-indigo-500 link" } }),
    ],
    editorProps: { attributes: { class: "p-1 min-h-[4rem] w-full focus:outline-none", id } },
    content: content ?? undefined,
    onUpdate({ editor }) {
      // checks if editor is empty and has no white spaces
      if (editor?.isEmpty === false && editor?.state.doc.textContent.trim().length > 0)
        setContent(type === "HTML" ? editor.getHTML() : type === "JSON" ? editor.getJSON() : null);
      else setContent(null);
    },

    editable,
  });

  return (
    <div id={id} className={className}>
      {viewOnly ? null : <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
};
