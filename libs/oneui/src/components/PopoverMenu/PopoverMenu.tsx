import { flip, offset, Placement, shift, useFloating } from '@floating-ui/react-dom-interactions';
import { Popover } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Fragment, FunctionComponent, ReactNode } from 'react';
import { popoverClass } from './PopoverMenu.styles';

type Props = {
  children: ReactNode | ReactNode[];
  className?: string;
};

type PopoverMenuprops = Props & {
  size?: 'sm' | 'md' | 'lg';
  display: JSX.Element | string;
  placement?: Placement;
  offsetValue?: number;
};

type PopoverMenuComposition = {
  Header: typeof Header;
  Content: typeof Content;
  Footer: typeof Footer;
};

export const PopoverMenu: FunctionComponent<PopoverMenuprops> & PopoverMenuComposition = ({
  display,
  children,
  className,
  size,
  placement,
  offsetValue,
}) => {
  const { reference, floating, x, y, strategy } = useFloating({
    placement,
    middleware: [offset(offsetValue), flip(), shift()],
  });

  return (
    <Popover as={Fragment}>
      {({ open }) => (
        <>
          <Popover.Button ref={reference} className={`${className} focus:outline-none`}>
            {display}
          </Popover.Button>
          <AnimatePresence>
            {open && (
              <Popover.Panel
                as={motion.div}
                static
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10, transition: { duration: 0.25 } }}
                ref={floating}
                className={popoverClass(size)}
                style={{
                  position: strategy,
                  top: y ?? 0,
                  left: x ?? 0,
                  zIndex: 500,
                }}
              >
                {children}
              </Popover.Panel>
            )}
          </AnimatePresence>
        </>
      )}
    </Popover>
  );
};

const Header: FunctionComponent<Props> = ({ children, className }) => {
  return <header className={`${className} px-4 py-3`}>{children}</header>;
};

const Content: FunctionComponent<Props> = ({ children, className }) => {
  return <main className={`${className} flex-1 overflow-y-auto`}>{children}</main>;
};

const Footer: FunctionComponent<Props> = ({ children, className }) => {
  return <footer className={`${className} px-4 py-3`}>{children}</footer>;
};

PopoverMenu.Header = Header;

PopoverMenu.Content = Content;

PopoverMenu.Footer = Footer;

PopoverMenu.defaultProps = {
  size: 'lg',
  placement: 'bottom',
  offsetValue: 5,
};
