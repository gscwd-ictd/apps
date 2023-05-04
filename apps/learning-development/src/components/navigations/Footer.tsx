export const Footer = () => {
  return (
    <footer
      id="page-bottombar"
      className={`relative overflow-x-hidden flex mt-2 px-5 py-5 bg-slate-50 transition-all `}
    >
      <div className={`flex justify-between w-full`}>
        <span className="text-xs font-light text-gray-500">
          {new Date().getFullYear()} © GSCWD.
        </span>
        <span className="text-xs font-light text-gray-500">
          Designed and Developed by GSCWD-ICTD.
        </span>
      </div>
    </footer>
  );
};
