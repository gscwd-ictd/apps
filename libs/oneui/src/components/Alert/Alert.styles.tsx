import cx from 'classnames';

export const promptOverlayStyles = () => {
  return cx('fixed inset-0 bg-black bg-opacity-25');
};

export const promptContainerStyles = () => {
  return cx('flex min-h-full items-center justify-center p-4 text-center');
};

export const promptPanelStyles = () => {
  return cx(
    'w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all space-y-2'
  );
};

export const promptFooterStyles = (alignEnd: boolean | undefined) => {
  return cx({
    'flex items-center gap-2 pt-5': true,
    'justify-end': alignEnd
  });
};
