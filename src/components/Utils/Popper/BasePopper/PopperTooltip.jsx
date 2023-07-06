import React from 'react';
import PopperContent from './PopperContent';
import clsx from 'clsx';
import * as Floating from '@floating-ui/dom';
import { useEnhancedEffect, useForkRef } from '@components/lib';
import * as Transitions from '@transitions';

export const popperTooltipClasses = {
  root: 'Popper-Content',
  popperArrow: 'Popper-Arrow'
};

const resolveAnchorEl = (anchorEl) => (typeof anchorEl === 'function' ? anchorEl() : anchorEl);

const getArrowElementById = (arrowId) =>
  arrowId ? document.getElementById(arrowId) : document.getElementById('arrow');

const PopperTooltip = React.forwardRef((props, ref) => {
  const {
    anchorEl,
    className,
    component = 'div',
    disableArrow = true,
    children,
    open,
    popperOptions: popperOptionsProp,
    popperRef: popperRefProp,
    slots = {},
    slotProps = {},
    transition,
    TransitionProps,
    ...other
  } = props;

  const {
    arrow,
    autoPlace,
    autoUpdate: shouldAutoUpdate,
    avoidCollisions,
    flip: shouldFlip,
    hide: shouldHide,
    inline: shouldInline,
    offset: offsetPadding,
    placement: initialPlacement,
    position,
    shift: shouldShift,
    size: shouldResize
  } = popperOptionsProp;

  const tooltipRef = React.useRef(null);
  const ownRef = useForkRef(tooltipRef, ref);
  const popperRef = React.useRef(null);
  const handlePopperRef = useForkRef(popperRef, popperRefProp);
  const handlePopperRefRef = React.useRef(handlePopperRef);
  useEnhancedEffect(() => {
    handlePopperRefRef.current = handlePopperRef;
  }, [handlePopperRef]);
  React.useImperativeHandle(popperRefProp, () => popperRef.current, []);

  const [placement, setPlacement] = React.useState(initialPlacement);
  const [resolvedAnchorElement, setResolvedAnchorElement] = React.useState(
    resolveAnchorEl(anchorEl)
  );
  const [popperOptions, setPopperOptions] = React.useState({});

  useEnhancedEffect(() => {
    if (anchorEl) {
      setResolvedAnchorElement(resolveAnchorEl(anchorEl));
    }
  }, [anchorEl]);

  const {
    id: arrowId = 'arrow',
    width: arrowInputWidth = 8,
    padding: arrowPadding = 8
  } = arrow || {};
  const arrowWidth = Math.max(arrowInputWidth, 8);

  useEnhancedEffect(() => {
    setPlacement(initialPlacement);

    const arrowElement = getArrowElementById(arrowId);

    setPopperOptions({
      autoUpdate: typeof shouldAutoUpdate === 'boolean' ? {} : { ...shouldAutoUpdate },
      arrow: !disableArrow ? { element: arrowElement, padding: arrowPadding } : {},
      offset:
        typeof offsetPadding === 'number' || typeof offsetPadding === 'boolean'
          ? offsetPadding + (!disableArrow && arrowWidth / 2)
          : typeof offsetPadding === 'string'
          ? parseInt(offsetPadding.replace(/\D/g, '')) + (!disableArrow && arrowWidth / 2)
          : typeof offsetPadding === 'function'
          ? offsetPadding
          : {
              mainAxis: 0 + (!disableArrow && arrowWidth / 2),
              ...offsetPadding
            },
      autoPlace:
        typeof autoPlace === 'boolean'
          ? {}
          : {
              ...autoPlace
            },
      flip:
        typeof shouldFlip === 'boolean'
          ? {}
          : {
              ...shouldFlip
            },
      hide: typeof shouldHide === 'boolean' ? {} : { ...shouldHide },
      inline: typeof shouldInline === 'boolean' ? {} : { ...shouldInline },
      shift:
        typeof shouldShift === 'boolean'
          ? avoidCollisions
            ? { limiter: Floating.limitShift() }
            : {}
          : {
              limiter: avoidCollisions ? Floating.limitShift() : undefined,
              ...shouldShift
            },
      size:
        typeof shouldResize === 'boolean'
          ? {
              apply({ availableWidth, availableHeight, elements }) {
                Object.assign(elements.floating.style, {
                  maxWidth: `${availableWidth}px`,
                  maxHeight: `${availableHeight}px`
                });
              }
            }
          : {}
    });
  }, [arrowId, arrowWidth, disableArrow, popperOptionsProp]);

  useEnhancedEffect(() => {
    if (!resolvedAnchorElement || !open) {
      return undefined;
    }

    const arrowElement = arrowId
      ? document.getElementById(arrowId)
      : document.getElementById('arrow');

    const popperSettings = {
      strategy: tooltipRef.current.style.position,
      placement: placement,
      middleware: [
        shouldInline ? Floating.inline(popperOptions.inline) : undefined,
        Floating.offset(popperOptions.offset),
        autoPlace
          ? Floating.autoPlacement(popperOptions.autoPlace)
          : shouldFlip
          ? Floating.flip(popperOptions.flip)
          : undefined,
        shouldShift ? Floating.shift(popperOptions.shift) : undefined,
        shouldResize ? Floating.size(popperOptions.size) : undefined,
        !disableArrow ? Floating.arrow(popperOptions.arrow) : undefined,
        shouldHide ? Floating.hide(popperOptions.hide) : undefined
      ].filter(Boolean)
    };

    let cleanup;
    if (shouldAutoUpdate) {
      const updatePosition = () => {
        Floating.computePosition(resolvedAnchorElement, tooltipRef.current, popperSettings).then(
          ({ x, y, placement, middlewareData: data }) => {
            if (shouldHide) {
              const referenceHidden = data.hide.referenceHidden;
              Object.assign(tooltipRef.current.style, {
                visibility: referenceHidden ? 'hidden' : 'visible'
              });
            }

            Object.assign(tooltipRef.current.style, {
              left: `${x}px`,
              top: `${y}px`
            });

            if (!disableArrow) {
              const { x: arrowX, y: arrowY } = data.arrow;
              const staticSide = {
                top: { side: 'bottom', transform: 'rotate(180deg)' },
                right: { side: 'left', transform: 'rotate(270deg)' },
                bottom: { side: 'top', transform: 'rotate(0deg)' },
                left: { side: 'right', transform: 'rotate(90deg)' }
              }[placement.split('-')[0]];

              Object.assign(arrowElement.style, {
                left: arrowX != null ? `${arrowX}px` : '',
                top: arrowY != null ? `${arrowY}px` : '',
                transform: staticSide.transform,
                [staticSide.side]: `-${arrowWidth - Math.max(1, 9 - 0.5 * arrowWidth)}px`
              });
            }
            setPlacement(placement);
          }
        );
      };

      cleanup = Floating.autoUpdate(
        resolvedAnchorElement,
        tooltipRef.current,
        updatePosition,
        popperOptions.autoUpdate
      );
    } else {
      Floating.computePosition(resolvedAnchorElement, tooltipRef.current, popperSettings).then(
        ({ x, y, placement, middlewareData: data }) => {
          if (shouldHide) {
            const referenceHidden = data.hide.referenceHidden;
            Object.assign(tooltipRef.current.style, {
              visibility: referenceHidden ? 'hidden' : 'visible'
            });
          }

          Object.assign(tooltipRef.current.style, {
            left: `${x}px`,
            top: `${y}px`,
            zIndex: 1
          });
          if (!disableArrow) {
            const { x: arrowX, y: arrowY } = data.arrow;
            const staticSide = {
              top: { side: 'bottom', transform: 'rotate(180deg)' },
              right: { side: 'left', transform: 'rotate(270deg)' },
              bottom: { side: 'top', transform: 'rotate(0deg)' },
              left: { side: 'right', transform: 'rotate(90deg)' }
            }[placement.split('-')[0]];

            Object.assign(arrowElement.style, {
              left: arrowX != null ? `${arrowX}px` : '',
              top: arrowY != null ? `${arrowY}px` : '',
              transform: staticSide.transform,
              [staticSide.side]: `-${arrowWidth - Math.max(1, 9 - 0.5 * arrowWidth)}px`
            });
          }
          setPlacement(placement);
        }
      );
    }

    handlePopperRef(tooltipRef.current);

    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
      handlePopperRef(null);
    };
  }, [resolvedAnchorElement, popperOptions, open]);

  const arrowProps = {
    component: slots.arrow ?? 'div',
    ...slotProps.arrow,
    className: clsx(slotProps.arrow?.className, popperTooltipClasses.arrow),
    arrowId: arrowId,
    disableArrow: disableArrow,
    position: position,
    width: arrowWidth
  };

  const rootProps = {
    role: 'tooltip',
    ref: ownRef,
    className: clsx(className, slotProps?.root?.className, popperTooltipClasses.root),
    disableArrow: disableArrow,
    elevation: props.elevation,
    outlined: props.outlined,
    position: position,
    square: props.square,
    slotProps: { root: slotProps.root, arrow: arrowProps },
    ...other
  };

  const rootComponent = component || slots.root || 'div';
  const TransitionComponent =
    typeof transition === 'string'
      ? Transitions[transition] || Transitions['Fade']
      : Transitions['Fade'];

  return transition ? (
    <TransitionComponent {...TransitionProps}>
      <PopperContent component={rootComponent} {...rootProps}>
        {children}
      </PopperContent>
    </TransitionComponent>
  ) : (
    <PopperContent component={rootComponent} {...rootProps}>
      {children}
    </PopperContent>
  );
});
PopperTooltip.displayName = 'PopperTooltip';

export default PopperTooltip;
