export const Footer = () => {
  return (
    <footer id="page-bottombar">
      <div className="static bottom-0 flex w-full px-5 py-5 bg-slate-200 ">
        <div className="flex justify-between w-full">
          <span className="text-xs font-light text-gray-500">
            {new Date().getFullYear()} © GSCWD.
          </span>
          <span className="text-xs font-light text-gray-500">
            Designed and Developed by GSCWD-ICTD.
          </span>
        </div>
      </div>
    </footer>
  );
};
