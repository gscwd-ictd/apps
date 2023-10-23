/* eslint-disable react-hooks/rules-of-hooks */
import './styles.css';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Document from '@tiptap/extension-document';
import { useEditor, EditorContent } from '@tiptap/react';
import React, { useEffect, useState } from 'react';

export const Tiptap = () => {
  const [isBullet, setIsBullet] = useState<boolean>(false);

  const editor = useEditor({
    extensions: [Document, Paragraph, Text, BulletList, ListItem],
    content: `
        <ul>
          <li>*</li>
       
        </ul>
      `,
  });

  if (!editor) {
    return null;
  }
  // useEffect(() => {
  //   if (!isBullet) {
  //     setIsBullet(true);
  //   }
  // }, []);

  return (
    <div className="w-full p-2 mt-1 rounded text-slate-500 text-md border-slate-300">
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${editor.isActive('bulletList') ? 'is-active' : ''} w-auto h-5 border`}
        type="button"
      >
        toggleBulletList
      </button>

      <EditorContent editor={editor} />
    </div>
  );
};
