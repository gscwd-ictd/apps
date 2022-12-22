import { FunctionComponent } from 'react';
import { MenuListState } from './Dropdown';
import { menu } from './Dropdown.styles';

export type SimpleMenuProps = {
  state: MenuListState;
  menuItem: string;
};

export type WithIconMenuProps = SimpleMenuProps & {
  /** this icon element should adopt the size value of its parent. Thus, assign a height and width of full */
  icon: JSX.Element;
};

// simple menu component
export const SimpleMenu: FunctionComponent<SimpleMenuProps> = ({ state, menuItem }) => {
  return <div className={menu.simpleMenuClass(state)}>{menuItem}</div>;
};

export const WithIconMenu: FunctionComponent<WithIconMenuProps> = ({ state, menuItem, icon }) => {
  return (
    <div className={menu.withIconMenuContainerClass(state)}>
      <span className={menu.iconContainerClass()}>{icon}</span>
      <span>{menuItem}</span>
    </div>
  );
};
