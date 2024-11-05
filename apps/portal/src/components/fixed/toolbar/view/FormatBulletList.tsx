import { FunctionComponent, useContext } from 'react';
import { ToolbarButton } from '../buttons/view/ToolbarButton';
import { ToolbarContext } from './Toolbar';

export const FormatBulletList: FunctionComponent = () => {
  const { editor } = useContext(ToolbarContext);

  return (
    <ToolbarButton
      tooltip="Bullet List (Ctrl + Shift + 8)"
      action="bullet-list"
      onClick={() => editor?.chain().focus().toggleBulletList().run()}
      className={editor?.isActive('bulletList') ? 'is-active' : ''}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="bi bi-list-ul" viewBox="0 0 15 15">
        <path
          fillRule="evenodd"
          d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
        />
      </svg>
    </ToolbarButton>
  );
};
