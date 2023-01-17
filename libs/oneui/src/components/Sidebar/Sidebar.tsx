import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { FunctionComponent, ReactNode, useContext } from 'react';
import { AsideContext } from '../Wrappers/PageContent';
import { itemClass, linkClass, sidebarClass } from './Sidebar.styles';

type Props = {
  children: ReactNode | ReactNode[];
  className?: string;
};

type SidebarProps = Props & {
  background?: string;
};

type ItemProps = Omit<Props, 'children'> & {
  display: string;
  icon: JSX.Element;
  path: string;
  selected?: boolean;
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
  display,
  path,
  className,
}) => {
  const { isCollapsed } = useContext(AsideContext);

  return (
    <li className={itemClass(className, selected)}>
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
    </li>
  );
};

Sidebar.Header = Header;

Sidebar.Content = Content;

Sidebar.Item = Item;

Sidebar.Footer = Footer;

Sidebar.defaultProps = {
  background: 'bg-gray-900/90',
};
