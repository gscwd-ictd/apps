import { Editor } from '@tiptap/react';
import { BoldIcon, ItalicIcon, UnderlineIcon } from 'lucide-react';
import Underline from '@tiptap/extension-underline';

type Props = {
  editor: Editor | null;
  content: string;
};
export const RichTextMenuBar = ({ editor, content }: Props) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex gap-2 pb-1 mb-2 border-b">
      <button
        type="button"
        onClick={() => (editor.isActive('bold') ? editor.commands.unsetMark('bold') : editor.commands.setMark('bold'))}
        className={`flex gap-2 bg-slate-100 border-gray-50 border items-center justify-center rounded-lg px-2 py-2 w-10 h-10"
      ${editor.isActive('bold') ? 'bg-blue-500 text-white' : ''}
    `}
      >
        <BoldIcon className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() =>
          editor.isActive('italic') ? editor.commands.unsetMark('italic') : editor.commands.setMark('italic')
        }
        className={`flex gap-2 bg-slate-100 border-gray-50 border items-center justify-center rounded-lg px-2 py-2 w-10 h-10"
      ${editor.isActive('italic') ? 'bg-blue-500 text-white' : ''}
    `}
      >
        <ItalicIcon className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() =>
          editor.isActive('underline') ? editor.commands.unsetUnderline() : editor.commands.setUnderline()
        }
        className={`flex gap-2 bg-slate-100 border-gray-50 border items-center justify-center rounded-lg px-2 py-2 w-10 h-10"
      ${editor.isActive('underline') ? 'bg-blue-500 text-white' : ''}
    `}
      >
        <UnderlineIcon className="w-4 h-4" />
      </button>
    </div>
  );
};
