import React from 'react';
import { forwardRef, HTMLProps, useMemo } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { TooltipState } from './useTooltip';

type TooltipAnchorProps = {
  state: TooltipState;
  asChild?: boolean;
};

export const TooltipAnchor = forwardRef<HTMLElement, HTMLProps<HTMLElement> & TooltipAnchorProps>(
  ({ state, asChild, children, ...props }, propRef) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const childrenRef = (children as any).ref;

    const ref = useMemo(
      () => mergeRefs([state.data.reference, propRef, childrenRef]),
      [state.data.reference, propRef, childrenRef]
    );

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, state.interactions.getReferenceProps({ ref, ...props, ...children.props }));
    }

    return (
      <div ref={ref} {...state.interactions.getReferenceProps(props)}>
        {children}
      </div>
    );
  }
);
