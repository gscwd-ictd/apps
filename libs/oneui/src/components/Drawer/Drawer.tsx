import { Dialog } from '@headlessui/react';
import { AnimatePresence, m, domAnimation, LazyMotion } from 'framer-motion';
import { FunctionComponent, ReactNode } from 'react';
import { bodyClass, childrenContainer, overlayClass, panelClass, panelContainerClass } from './Drawer.styles';

type Props = {
  className?: string;
  children: ReactNode | ReactNode[];
};

export type DrawerProps = Props & {
  open: boolean;
  setOpen: (state: boolean) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
};

type DrawerComposition = {
  Header: typeof Header;
  Body: typeof Body;
  Footer: typeof Footer;
};

export const Drawer: FunctionComponent<DrawerProps> & DrawerComposition = (props) => {
  const { children, open, setOpen } = props;

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {open && (
          <Dialog as="div" open={open} onClose={() => setOpen(false)} className="relative z-40">
            <Dialog.Overlay
              as={m.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15, ease: 'easeInOut' } }}
              className={overlayClass()}
              aria-hidden="true"
            />

            <div className={panelContainerClass()}>
              <Dialog.Panel
                as={m.div}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 18, duration: 0.1 }}
                className={panelClass(props)}
              >
                <div className={childrenContainer()}>{children}</div>
              </Dialog.Panel>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
};

const Header: FunctionComponent<Props> = ({ className, children }) => {
  return <header className={className}>{children}</header>;
};

const Body: FunctionComponent<Props> = ({ className, children }) => {
  return <main className={bodyClass(className)}>{children}</main>;
};

const Footer: FunctionComponent<Props> = ({ className, children }) => {
  return <footer className={className}>{children}</footer>;
};

Drawer.Header = Header;

Drawer.Body = Body;

Drawer.Footer = Footer;

Drawer.defaultProps = {
  size: 'sm',
};
