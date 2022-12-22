import { ListState, SelectItemSimple, SelectItemWithAvatar } from './SelectItem';

export type ListDef<T> = {
  key: keyof T;
  render: (item: T, state: ListState) => JSX.Element;
  disable?: (item: T, index: number) => boolean;
};

export type ListWithAvatar = {
  avatarSrc: string;
  heading: string;
  subheading?: string;
};

export const listRenderer = {
  // render the default select list item component
  simple: (displayItem: string, state: ListState) => <SelectItemSimple displayItem={displayItem} state={state} />,

  withAvatar: (strategy: ListWithAvatar, state: ListState) => (
    <SelectItemWithAvatar strategy={strategy} state={state} />
  ),

  // render a custom select list item component
  custom: (itemComponent: JSX.Element) => itemComponent,
};

export const useSelect = <T extends object>(listDef: ListDef<T>) => {
  return { listDef };
};
