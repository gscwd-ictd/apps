export const RecurringPageFooter = () => {
  return (
    <>
      <hr />
      <div className="flex justify-end w-full h-[4rem] items-center">
        <div className="flex">
          <div className="flex items-center justify-center w-full text-sm font-light border">
            <span className="px-2 text-gray-500 ">Previous</span>
          </div>
          <div className="flex items-center justify-center w-full text-sm font-light border">
            <span className="px-2 text-gray-500">Next</span>
          </div>
          <div className="px-5">
            <span className="text-xs font-medium">Page 1 of 1</span>
          </div>
          <div className="flex items-center justify-center w-full text-sm font-light border rounded">
            <span className="px-2 text-gray-500">Show 10</span>
          </div>
        </div>
      </div>
    </>
  );
};
