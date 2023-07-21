type UpdateCardBtnProps = {
  action: () => void;
};

export const UpdateCardBtn = ({ action }: UpdateCardBtnProps) => {
  return (
    <button onClick={action} type="button" className="ring-0 focus:ring-0">
      <div className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800">
        <i className="bx text-2xl bxs-save"></i>
        <span>Update</span>
      </div>
    </button>
  );
};
