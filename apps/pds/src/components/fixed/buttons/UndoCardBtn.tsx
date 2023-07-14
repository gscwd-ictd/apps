type UndoCardBtnProps = {
  action: () => void;
};

export const UndoCardBtn = ({ action }: UndoCardBtnProps) => {
  return (
    <button onClick={action} type="button" className="ring-0 focus:ring-0">
      <div className="flex items-center gap-1 text-gray-400 hover:text-gray-600">
        <i className="bx text-2xl bx-undo "></i>
        <span>Undo</span>
      </div>
    </button>
  );
};
