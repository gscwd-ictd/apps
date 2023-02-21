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
export const Sidebar: FunctionComponent<SidebarProps> & SidebarComposition = ({
  background,
  children,
  className,
}) => {
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
    <main className={`${className} flex-1 overflow-y-auto overflow-x-hidden`}>
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
  hasSubItem = false,
}) => {
  const {
    aside: { isCollapsed },
  } = useContext(PageContentContext);

  return (
    <li className={itemClass(className, selected)}>
      {!hasSubItem ? (
        <Link href={path} className={linkClass(isCollapsed, selected)}>
          {icon}
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {display}
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      ) : (
        <Accordion className="flex flex-col justify-center w-full">
          <Accordion.Button className={linkClass(isCollapsed, selected)}>
            <div className="flex w-full gap-5 text-center place-items-center">
              <span
                className={`${
                  isCollapsed ? 'w-full' : 'w-[10%]'
                } flex justify-center`}
              >
                {icon}
              </span>
              {!isCollapsed && (
                <div className="flex w-[90%] text-left justify-between gap-28 place-items-center">
                  <motion.span
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {display}
                  </motion.span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    height={20}
                    width={20}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className=" ui-open:rotate-180 ui-open:transform ui-open:transition-all"
                  >
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                </div>
              )}
              {/* {!isCollapsed && (
                
              )} */}
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
