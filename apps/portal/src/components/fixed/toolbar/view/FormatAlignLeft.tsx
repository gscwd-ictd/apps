import { FunctionComponent, useContext } from 'react';
import { ToolbarButton } from '../buttons/view/ToolbarButton';
import { ToolbarContext } from './Toolbar';

export const FormatAlignLeft: FunctionComponent = () => {
  const { editor } = useContext(ToolbarContext);

  return (
    <ToolbarButton
      tooltip="Align Left (Ctrl + Shift + L)"
      action="align-left"
      onClick={() => editor?.chain().focus().setTextAlign('left').run()}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4Z" />
        <path d="M4 9C3.44772 9 3 9.44772 3 10C3 10.5523 3.44772 11 4 11H12C12.5523 11 13 10.5523 13 10C13 9.44772 12.5523 9 12 9H4Z" />
        <path d="M3 14C3 13.4477 3.44772 13 4 13H20C20.5523 13 21 13.4477 21 14C21 14.5523 20.5523 15 20 15H4C3.44772 15 3 14.5523 3 14Z" />
        <path d="M4 17C3.44772 17 3 17.4477 3 18C3 18.5523 3.44772 19 4 19H12C12.5523 19 13 18.5523 13 18C13 17.4477 12.5523 17 12 17H4Z" />
      </svg>
    </ToolbarButton>
  );
};