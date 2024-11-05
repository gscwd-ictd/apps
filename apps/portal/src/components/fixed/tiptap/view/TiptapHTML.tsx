import { JSONContent, generateHTML } from "@tiptap/react";
import { useMemo } from "react";
import Paragraph from "@tiptap/extension-paragraph";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

type Props = {
  json: JSONContent;
};

export const TiptapHTML = ({ json }: Props) => {
  const output = useMemo(() => {
    return generateHTML(json, [
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
  }, [json]);

  return (
    <pre>
      <code>{JSON.stringify(output, null, 2)}</code>
    </pre>
  );
};
