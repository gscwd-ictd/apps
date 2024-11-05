import { generateJSON } from "@tiptap/react";
import { useMemo } from "react";
import Paragraph from "@tiptap/extension-paragraph";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";

type Props = {
  html: string;
};

export const TiptapJSON = ({ html }: Props) => {
  const output = useMemo(() => {
    return generateJSON(html, [
      Document,
      Paragraph,
      Text,
      OrderedList,
      BulletList,
      ListItem,
      Placeholder,
      Underline,
      Image,
      TextAlign,
      Link,
    ]);
  }, [html]);

  return JSON.stringify(output, null, 2);
};
