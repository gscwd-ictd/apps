import { PageContentContext } from '@gscwd-apps/oneui';
import { useContext } from 'react';

export const Footer = () => {
  const {
    aside: { isCollapsed },
  } = useContext(PageContentContext);

  return (
    <footer
      id="page-bottombar"
      className={`relative z-50 overflow-x-hidden flex px-5 py-5 bg-gray-200/70 `}
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
