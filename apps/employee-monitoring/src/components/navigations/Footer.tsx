export const Footer = () => {
  return (
    <footer
      id="page-bottombar"
      className="flex w-full px-5 py-5 bg-gray-200/70"
    >
      <div className="flex justify-between w-full">
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
