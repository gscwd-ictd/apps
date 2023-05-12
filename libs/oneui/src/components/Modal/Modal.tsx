import { Dialog } from '@headlessui/react';
import { AnimatePresence, m, LazyMotion, domAnimation } from 'framer-motion';
import { FunctionComponent, ReactNode, useState } from 'react';
import {
  bodyClass,
  childrenContainer,
  footerClass,
  headerClass,
  overlayClass,
  panelClass,
  panelContainerClass,
} from './Modal.styles';

export type Props = {
  className?: string;
  children: ReactNode | ReactNode[];
};

export type ModalProps = Props & {
  open: boolean;
  setOpen: (state: boolean) => void;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  steady?: boolean;
  fixedHeight?: boolean;
};

type HeaderProps = Props & {
  withCloseBtn?: boolean;
};

type BodyProps = Omit<ModalProps, 'open' | 'setOpen'>;

type ModalComposition = {
  Header: typeof Header;
  Body: typeof Body;
  Footer: typeof Footer;
};

export const Modal: FunctionComponent<ModalProps> & ModalComposition = (
  props
) => {
  const { open, setOpen, steady, children } = props;

  const [shake, setShake] = useState(false);

  const onClose = () => (steady ? setShake(true) : setOpen(false));

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {open && (
          <Dialog
            as="div"
            open={open}
            onClose={onClose}
            className="relative z-40"
          >
            <Dialog.Overlay
              as={m.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={overlayClass()}
              aria-hidden="true"
            />

            <div className={panelContainerClass(props)}>
              <Dialog.Panel
                as={m.div}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100, transition: { duration: 0.25 } }}
                onAnimationEnd={() => setShake(false)}
                className={panelClass(props, shake)}
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

const Header: FunctionComponent<HeaderProps> = (props) => {
  const { children } = props;

  return <header className={headerClass(props)}>{children}</header>;
};

const Body: FunctionComponent<BodyProps> = (props) => {
  const { children } = props;

  return <main className={bodyClass(props)}>{children}</main>;
};

const Footer: FunctionComponent<Props> = (props) => {
  const { children } = props;

  return <footer className={footerClass(props)}>{children}</footer>;
};

Modal.Header = Header;

Modal.Body = Body;

Modal.Footer = Footer;

Modal.defaultProps = {
  size: 'sm',
  fixedHeight: true,
  steady: false,
};
