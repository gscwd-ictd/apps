import { flip, FloatingPortal, offset, Placement, shift, useFloating } from '@floating-ui/react-dom-interactions';
import { Menu } from '@headlessui/react';
import { AnimatePresence, domAnimation, LazyMotion, m } from 'framer-motion';
import { ReactNode } from 'react';
import { ListState } from '../Select/SelectItem';
import { menuContainerClass } from './Dropdown.styles';
import { MenuDef } from './useDropdown';

export type MenuListState = Omit<ListState, 'selected'>;

type DropdownProps<T> = {
  className?: string;
  children: ReactNode | ReactNode[];
  data: Array<T>;
  menuDef: MenuDef<T>;
  placement?: Placement;
  offsetValue?: number;
  shiftPaddingValue?: number;
  onSelect?: (menuItem: T, index: number) => void;
};

export const Dropdown = <T extends object | string>(props: DropdownProps<T>) => {
  // deconstruct props object
  const {
    className,
    children,
    data,
    menuDef,
    onSelect = () => null,
    placement = 'bottom',
    offsetValue = 10,
    shiftPaddingValue = 10,
  } = props;

  // deconstruct menu def object
  const { render, disable = () => false } = menuDef;

  // invoke floating ui to handle menu options container
  const { x, y, reference, floating, strategy } = useFloating({
    // calculated placement of the float ui
    placement,

    // additional functions for positioning the menu
    middleware: [offset(offsetValue), flip(), shift({ padding: shiftPaddingValue })],
  });

  return (
    <Menu as="div">
      {({ open }) => (
        <>
          <Menu.Button ref={reference} className={className}>
            {children}
          </Menu.Button>

          <FloatingPortal id="dropdown-menu-portal">
            <LazyMotion features={domAnimation}>
              <AnimatePresence>
                {open && (
                  <m.div
                    ref={floating}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}
                    style={{ position: strategy, top: y ?? 0, left: x ?? 0 }}
                  >
                    <Menu.Items as="ul" static className={menuContainerClass()}>
                      {data.map((menuItem, index) => {
                        return (
                          <Menu.Item
                            as="li"
                            key={index}
                            disabled={disable(menuItem, index)}
                            onClick={() => onSelect(menuItem, index)}
                          >
                            {(state) => <>{render(menuItem, state, index)}</>}
                          </Menu.Item>
                        );
                      })}
                    </Menu.Items>
                  </m.div>
                )}
              </AnimatePresence>
            </LazyMotion>
          </FloatingPortal>
        </>
      )}
    </Menu>
  );
};
