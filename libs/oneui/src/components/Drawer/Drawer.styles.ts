import cls from 'classnames';
import { DrawerProps } from './Drawer';

export const overlayClass = () => {
  return cls('fixed inset-0 bg-black/10');
};

export const panelContainerClass = () => {
  return cls('fixed inset-0 flex justify-end');
};

export const panelClass = ({ size, className }: DrawerProps) => {
  return cls(className, {
    'bg-white pointer-events-auto overflow-y-auto': true,
    'w-[24rem]': size === 'sm',
    'w-[28rem]': size === 'md',
    'w-[32rem]': size === 'lg',
    'w-[36rem]': size === 'xl',
    'w-[42rem]': size === '2xl',
  });
};

export const childrenContainer = () => {
  return cls('flex h-full flex-col');
};

export const bodyClass = (className: string | undefined) => {
  return cls(className, { 'flex-1 overflow-y-auto': true });
};
