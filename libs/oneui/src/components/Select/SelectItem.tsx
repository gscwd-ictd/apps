import { FunctionComponent } from 'react';
import { simpleListItemClass, withAvtr } from './Select.styles';
import { ListWithAvatar } from './useSelect';

export type ListState = {
  active: boolean;
  selected: boolean;
  disabled: boolean;
};

type SelectItemSimpleProps = {
  displayItem: string;
  state: ListState;
};

type SelectItemWithAvatarProps = {
  strategy: ListWithAvatar;
  state: ListState;
};

export const SelectItemSimple: FunctionComponent<SelectItemSimpleProps> = ({ displayItem, state }) => {
  return (
    <div className={simpleListItemClass(state)}>
      <span>{displayItem}</span>
    </div>
  );
};

export const SelectItemWithAvatar: FunctionComponent<SelectItemWithAvatarProps> = ({
  strategy: { heading, subheading, avatarSrc },
  state,
}) => {
  return (
    <div className={withAvtr.withAvatarListItemClass(state)}>
      <img src={avatarSrc} className={withAvtr.imgClass()} />
      <div className={withAvtr.listClass(state)}>
        <div>
          <h3 className={withAvtr.headingClass()}>{heading}</h3>
          <p className={withAvtr.subheadingClass(state)}>{subheading}</p>
        </div>
      </div>
    </div>
  );
};
