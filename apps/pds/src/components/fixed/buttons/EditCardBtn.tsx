type EditCardBtnProps = {
  action: () => void;
};

export const EditCardBtn = ({ action }: EditCardBtnProps) => {
  return (
    <button onClick={action} type="button" className="ring-0 focus:ring-0">
      <div className="flex items-center gap-2 text-gray-400 hover:text-gray-600">
        <i className="bx text-2xl bxs-edit"></i>
        <span className="text-lg">Edit</span>
      </div>
    </button>
  );
};
