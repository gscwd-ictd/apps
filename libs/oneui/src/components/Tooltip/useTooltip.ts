import {
  autoUpdate,
  flip,
  offset,
  Placement,
  ReferenceType,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  UseFloatingReturn,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react-dom-interactions';
import { useMemo, useState } from 'react';

type UsePopper = {
  initialOpen?: boolean;
  placement: Placement | undefined;
  click?: boolean;
  hover?: boolean;
  focus?: boolean;
  enableSafeClose?: boolean;
  showDelay?: number;
  dismissOnPress?: boolean;
  offsetValue?: number;
};

export type TooltipState = {
  open: boolean;
  setOpen: (state: boolean) => void;
  data: UseFloatingReturn<ReferenceType>;
  interactions: ReturnType<typeof useInteractions>;
};

export const useTooltip = ({
  initialOpen = false,
  placement = 'bottom',
  click = false,
  hover = false,
  focus = false,
  enableSafeClose = false,
  dismissOnPress = false,
  showDelay = 0,
  offsetValue = 5,
}: UsePopper) => {
  const [open, setOpen] = useState(initialOpen);

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [offset(offsetValue), flip(), shift({ padding: 5 })],
  });

  const context = data.context;

  // click event interaction handler
  const clickEvent = useClick(context, { enabled: click, toggle: true });

  // hover event interaction handler
  const hoverEvent = useHover(context, {
    move: false,
    enabled: hover,
    restMs: showDelay,
    handleClose: enableSafeClose ? safePolygon() : undefined,
  });

  // focus event interaction handler
  const focusEvent = useFocus(context, { enabled: focus });

  // dismiss event interaction handler
  const dismiss = useDismiss(context, { referencePress: dismissOnPress, referencePressEvent: 'click' });

  // element role handler
  const role = useRole(context, { role: 'tooltip' });

  // add all interactions
  const interactions = useInteractions([hoverEvent, focusEvent, dismiss, clickEvent, role]);

  return useMemo(
    () =>
      ({
        open,
        setOpen,
        interactions,
        data,
      } as TooltipState),
    [open, setOpen, interactions, data]
  );
};
