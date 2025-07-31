import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { FunctionComponent, ReactNode, useContext } from 'react';
import { Accordion } from '../Accordion';
import { PageContentContext } from '../Wrappers/PageContent';
import { itemClass, linkClass, sidebarClass } from './Sidebar.styles';

type Props = {
  children: ReactNode | ReactNode[];
  className?: string;
};

type SidebarProps = Props & {
  background?: string;
};

type ItemProps = Omit<Props, 'children'> & {
  icon: JSX.Element | React.ReactNode | ReactNode[];
  path: string;
  subItems?: React.ReactNode | React.ReactNode[];
  display: string;
  selected?: boolean;
  hasSubItem?: boolean;
  notificationCount?: number;
};

type SidebarComposition = {
  Header: typeof Header;
  Content: typeof Content;
  Footer: typeof Footer;
  Item: typeof Item;
};

/**
 *  the actual sidebar component with its compositions
 */
export const Sidebar: FunctionComponent<SidebarProps> & SidebarComposition = ({ background, children, className }) => {
  return <div className={sidebarClass(className, background)}>{children}</div>;
};

/**
 *  the header of the sidebar
 */
const Header: FunctionComponent<Props> = ({ children, className }) => {
  return <header className={className}>{children}</header>;
};

/**
 *  the content of the sidebar
 */
const Content: FunctionComponent<Props> = ({ children, className }) => {
  return (
    <main
      className={`${className} flex-1 scrollbar scrollbar-w-1 scrollbar-thumb-gray-400 scrollbar-thumb-rounded-lg overflow-y-auto overflow-x-hidden mr-1 `}
    >
      {children}
    </main>
  );
};

/**
 *  the footer of the sidebar
 */
const Footer: FunctionComponent<Props> = ({ children, className }) => {
  return <footer className={className}>{children}</footer>;
};

/**
 *  the sidebar item
 */

const Item: FunctionComponent<ItemProps> = ({
  selected,
  icon,
  path,
  className,
  subItems,
  display,
  notificationCount,
  hasSubItem = false,
}) => {
  const {
    aside: { isCollapsed, isDarkMode },
  } = useContext(PageContentContext);

  return (
    <li className={itemClass(className, selected, hasSubItem)}>
      {!hasSubItem ? (
        <Link href={path} className={linkClass(isCollapsed, selected, isDarkMode)}>
          {icon}
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.span initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }}>
                {display}
              </motion.span>
            )}
          </AnimatePresence>

          {notificationCount && notificationCount > 0 ? (
            <div className="w-full flex justify-end mr-3">
              <div className="w-min pl-2 pr-2 rounded-md select-none flex-grow-0 text-white justify-center text-xs bg-red-500">
                {notificationCount || 0}
              </div>
            </div>
          ) : null}
        </Link>
      ) : (
        <Accordion className="flex flex-col justify-center w-full">
          <Accordion.Button className={linkClass(isCollapsed, selected, isDarkMode)}>
            <div className={`flex w-full ${isCollapsed ? 'gap-0' : 'gap-5'} pr-2 text-center place-items-center`}>
              <span className={`${isCollapsed ? 'w-full' : 'w-[10%]'} flex justify-center`}>{icon}</span>
              {!isCollapsed ? (
                <div className="flex justify-between w-full text-left place-items-center">
                  <motion.span initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }}>
                    <span className={`${isCollapsed ? '' : ''}`}>{display}</span>
                  </motion.span>

                  {notificationCount && notificationCount > 0 ? (
                    <div className="w-full flex justify-end mr-1">
                      <div className="w-[10px] h-[10px] rounded-lg select-none flex-grow-0 text-white justify-center text-xs bg-red-500"></div>
                    </div>
                  ) : null}

                  <i className="bx bx-chevron-up ui-open:rotate-180 ui-open:transform ui-open:transition-all"></i>
                </div>
              ) : isCollapsed ? (
                <>
                  <motion.span initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} hidden>
                    {display}
                  </motion.span>

                  {notificationCount && notificationCount > 0 ? (
                    <div className="w-full flex justify-end mr-1">
                      <div className="w-[10px] h-[10px] rounded-lg select-none flex-grow-0 text-white justify-center text-xs bg-red-500"></div>
                    </div>
                  ) : null}

                  <i className="bx bx-chevron-up ui-open:rotate-180 ui-open:transform ui-open:transition-all"></i>
                </>
              ) : null}
            </div>
          </Accordion.Button>
          <Accordion.Body>
            <ul className="-ml-1">{subItems}</ul>
          </Accordion.Body>
        </Accordion>
      )}
    </li>
  );
};

Sidebar.Header = Header;

Sidebar.Content = Content;

Sidebar.Item = Item;

Sidebar.Footer = Footer;

Sidebar.defaultProps = {
  background: 'bg-slate-800/95',
};
