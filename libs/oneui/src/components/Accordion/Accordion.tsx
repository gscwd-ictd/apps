import { Disclosure } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { createContext, FunctionComponent, ReactNode, useContext } from 'react';

type AccordionContextState = {
  open: boolean;
};

type AccordionProps = {
  children: ReactNode | ReactNode[];
  className?: string;
};

type AccordionComposition = {
  Button: typeof Button;
  Body: typeof Body;
};

const AccordionContext = createContext<AccordionContextState>({
  open: false,
});

export const Accordion: FunctionComponent<AccordionProps> &
  AccordionComposition = ({ className, children }) => {
  return (
    <Disclosure as="div" className={className}>
      {({ open }) => (
        <AccordionContext.Provider value={{ open }}>
          {children}
        </AccordionContext.Provider>
      )}
    </Disclosure>
  );
};

const Button: FunctionComponent<AccordionProps> = ({ children, className }) => {
  return (
    <Disclosure.Button className={className}>{children}</Disclosure.Button>
  );
};

const Body: FunctionComponent<AccordionProps> = ({ children, className }) => {
  const { open } = useContext(AccordionContext);

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          layout
          key={open ? 'less' : 'more'}
          initial={{ opacity: 1, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{
            opacity: 0,
            height: 0,
            transition: { duration: 0.15, ease: 'easeInOut' },
          }}
        >
          <Disclosure.Panel static className={className}>
            {children}
          </Disclosure.Panel>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

Accordion.Button = Button;

Accordion.Body = Body;
