export const BreadCrumbs = () => {
  return (
    <div className="flex w-full h-16 bg-inherit ">
      <div className="flex justify-end w-full gap-2 px-5">
        <span className="flex items-center h-full text-xs text-gray-600 select-none">
          Dashboards
        </span>
        <span className="flex items-center h-full text-xs text-gray-400">
          /
        </span>
      </div>
    </div>
  );
};
