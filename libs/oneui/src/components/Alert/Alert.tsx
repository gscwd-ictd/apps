import { Dialog, Transition } from '@headlessui/react';
import { Fragment, FunctionComponent, ReactNode } from 'react';
import { FadeAndScale } from '../FadeAndScale';
import { FadeInOut } from '../FadeInOut';
import {
  promptPanelStyles,
  promptContainerStyles,
  promptOverlayStyles,
  promptFooterStyles,
} from './Alert.styles';

type Props = {
  children: ReactNode | Array<ReactNode>;
};

type FooterProps = Props & {
  alignEnd?: boolean;
};

type AlertComposition = {
  Title: typeof Title;
  Description: typeof Description;
  Footer: typeof Footer;
};

export type AlertProps = Props & {
  open: boolean;
  setOpen: (state: boolean) => void;
};

export const Alert: FunctionComponent<AlertProps> & AlertComposition = ({
  open,
  setOpen,
  children,
}) => {
  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setOpen(false)}
        >
          <FadeInOut>
            <div className={promptOverlayStyles()} />
          </FadeInOut>

          <div className="fixed inset-0 overflow-y-auto">
            <div className={promptContainerStyles()}>
              <FadeAndScale>
                <Dialog.Panel className={promptPanelStyles()}>
                  {children}
                </Dialog.Panel>
              </FadeAndScale>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

const Title: FunctionComponent<Props> = ({ children }) => {
  return <header>{children}</header>;
};

const Description: FunctionComponent<Props> = ({ children }) => {
  return <main>{children}</main>;
};

const Footer: FunctionComponent<FooterProps> = ({ alignEnd, children }) => {
  return <footer className={promptFooterStyles(alignEnd)}>{children}</footer>;
};

Alert.Title = Title;

Alert.Description = Description;

Alert.Footer = Footer;

Footer.defaultProps = {
  alignEnd: false,
};

Alert.defaultProps = {
  open: false,
};
