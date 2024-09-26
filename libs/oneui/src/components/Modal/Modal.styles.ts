import cls from 'classnames';
import { ModalProps, Props } from './Modal';

export const overlayClass = () => {
  return cls('fixed inset-0 flex items-center justify-center bg-black/80');
};

export const panelContainerClass = ({ size }: ModalProps) => {
  return cls('fixed inset-0 overflow-auto', {
    'p-5': size === 'full',
    'py-14': size !== 'full',
  });
};

export const panelClass = ({ size, className, fixedHeight }: ModalProps, shake: boolean, noShakeOnSteady: boolean) => {
  return cls(className, 'bg-white rounded-md mx-auto', {
    'animate-shake': shake && noShakeOnSteady === false,

    // 'min-h-[30%]': !fixedHeight && size === 'xs',
    // 'min-h-[50%]': !fixedHeight && size === 'sm',
    // 'min-h-[65%]': !fixedHeight && size === 'md',
    // 'min-h-[85%]': !fixedHeight && size === 'lg',
    // 'min-h-[95%]': !fixedHeight && size === 'xl',
    // 'min-h-[100%]': !fixedHeight && size === 'full',

    // 'overflow-y-auto h-[35%]': fixedHeight && size === 'xs',
    // 'overflow-y-auto h-[50%]': fixedHeight && size === 'sm',
    // 'overflow-y-auto h-[65%]': fixedHeight && size === 'md',
    // 'overflow-y-auto h-[85%]': fixedHeight && size === 'lg',
    // 'overflow-y-auto h-[95%]': fixedHeight && size === 'xl',
    // 'overflow-y-auto h-[100%]': fixedHeight && size === 'full',

    // width styles
    'sm:w-full lg:w-[20%]': size === 'xs',
    'sm:w-full lg:w-[35%]': size === 'sm',
    'sm:w-full lg:w-[45%]': size === 'md',
    'sm:w-full lg:w-[65%]': size === 'lg',
    'sm:w-full lg:w-[80%]': size === 'xl',
    'sm:w-full lg:w-[100%]': size === 'full',
  });
};

export const childrenContainer = () => {
  return cls('h-full w-full flex flex-col');
};

export const headerClass = ({ className }: Props) => {
  return cls('mb-3 p-3 border-b border-solid', className);
};

export const bodyClass = ({ className }: Props) => {
  return cls(className, 'overflow-y-auto flex-1 p-3');
};

export const footerClass = ({ className }: Props) => {
  return cls('mt-3 p-3 border-t border-solid', className);
};
