import { FunctionComponent, useContext } from 'react';
import { ToolbarButton } from '../buttons/view/ToolbarButton';
import { ToolbarContext } from './Toolbar';

export const FormatAlignCenter: FunctionComponent = () => {
  const { editor } = useContext(ToolbarContext);

  return (
    <ToolbarButton
      tooltip="Align Center (Ctrl + Shift + E)"
      action="align-center"
      onClick={() => editor?.chain().focus().setTextAlign('center').run()}
    >
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4Z" />
        <path d="M4 13C3.44772 13 3 13.4477 3 14C3 14.5523 3.44772 15 4 15H20C20.5523 15 21 14.5523 21 14C21 13.4477 20.5523 13 20 13H4Z" />
        <path d="M6 10C6 9.44772 6.44772 9 7 9H17C17.5523 9 18 9.44772 18 10C18 10.5523 17.5523 11 17 11H7C6.44772 11 6 10.5523 6 10Z" />
        <path d="M7 17C6.44772 17 6 17.4477 6 18C6 18.5523 6.44772 19 7 19H17C17.5523 19 18 18.5523 18 18C18 17.4477 17.5523 17 17 17H7Z" />
      </svg>
    </ToolbarButton>
  );
};
