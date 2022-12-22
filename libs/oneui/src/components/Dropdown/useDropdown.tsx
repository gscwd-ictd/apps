import { MenuListState } from './Dropdown';
import { SimpleMenu, SimpleMenuProps, WithIconMenu, WithIconMenuProps } from './MenuItem';

export const menuRenderer = {
  /**
   *  Renders a simple menu item with just the display text
   */
  simple: ({ menuItem, state }: SimpleMenuProps) => <SimpleMenu menuItem={menuItem} state={state} />,

  /**
   *  Renders a menu item with the display text and its corresponding icon
   */
  withIcon: ({ menuItem, state, icon }: WithIconMenuProps) => (
    /**
     *  this is the item menu with icon
     */
    <WithIconMenu state={state} menuItem={menuItem} icon={icon} />
  ),

  /**
   *  Renders a menu item with a user defined menu item component
   */
  custom: (customMenuItem: JSX.Element) => customMenuItem,
};

export type MenuDef<T> = {
  /**
   *  Render the menu item in the DOM
   */
  render: (menuItem: T, state: MenuListState, index?: number) => JSX.Element | string;

  /**
   *  Define a menu item that is supposed to be disabled
   */
  disable?: (menuItem: T, index: number) => boolean;
};

/**
 * Define the shape of your menu item data so the dropdown component would know
 * what to render and how to render it
 */
export const useDropdown = <T extends object | string>(menuDef: MenuDef<T>) => menuDef;
