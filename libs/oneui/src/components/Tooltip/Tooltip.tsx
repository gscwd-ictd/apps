import { FloatingPortal } from '@floating-ui/react-dom-interactions';
import { forwardRef, useMemo } from 'react';
import { TooltipState } from './useTooltip';
import { mergeRefs } from 'react-merge-refs';
import { AnimatePresence, m, LazyMotion, domAnimation } from 'framer-motion';

export const Tooltip = forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement> & { state: TooltipState }
>(({ state, ...props }, propRef) => {
  const ref = useMemo(
    () => mergeRefs([state.data.floating, propRef]),
    [state.data.floating, propRef]
  );

  return (
    <FloatingPortal id="tooltip-portal">
      <LazyMotion features={domAnimation}>
        <AnimatePresence>
          {state.open && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              ref={ref}
              style={{
                position: state.data.strategy,
                zIndex: 500,
                top: state.data.y ?? 0,
                left: state.data.x ?? 0,
                ...props.style,
              }}
              {...state.interactions.getFloatingProps(props)}
            />
          )}
        </AnimatePresence>
      </LazyMotion>
    </FloatingPortal>
  );
});
