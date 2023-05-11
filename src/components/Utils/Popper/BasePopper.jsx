import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { cn, ownerDocument } from '@utils';
import { useEnhancedEffect, useForkRef } from '@component-hooks';
import {
  computePosition,
  autoPlacement,
  autoUpdate,
  arrow,
  flip,
  hide,
  inline,
  limitShift,
  offset,
  shift,
  size
} from '@floating-ui/dom';
import { Fade, Portal } from '@components';
import { css } from '@emotion/react';

const resolveAnchorEl = (anchorEl) =>
  typeof anchorEl === 'function' ? anchorEl() : anchorEl;

const isHTMLElement = (element) => element.nodeType !== undefined;

const isDescendant = (parent, child) => {
  let node = child;
  while (node != null) {
    if (node == parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
};

const getArrowElementById = (arrowId) =>
  arrowId ? document.getElementById(arrowId) : document.getElementById('arrow');

/*--------------------------- PopperArrow ---------------------------*/
const PopperArrow = forwardRef(
  (
    {
      children,
      className: classNameProp,
      Component,
      height,
      id,
      position,
      width,
      ...arrowProps
    },
    ref
  ) => {
    const className = cn(
      'w-0 h-0 bg-transparent border-solid border-t-transparent border-r-transparent border-l-white border-b-white dark:border-l-black dark:border-b-black transition-shadow drop-shadow-md',
      classNameProp
    );

    console.log(className);

    return (
      <Component
        id={id}
        className={className}
        {...arrowProps}
        ref={ref}
        style={{
          position: `${position}`,
          borderTopWidth: `${width * 0.5}px`,
          borderLeftWidth: `${width * 0.5}px`,
          borderRightWidth: `${width * 0.5}px`,
          borderBottomWidth: `${height * 0.5}px`,
          ...arrowProps.style
        }}
      />
    );
  }
);
PopperArrow.displayName = 'PopperArrow';

/*--------------------------- PopperToolTip ---------------------------*/
const PopperTooltip = forwardRef(
  (
    {
      anchorEl,
      arrow: showArrow,
      autoPlace,
      autoUpdate: shouldAutoUpdate,
      avoidCollisions,
      component,
      components,
      componentsProps,
      children,
      flip: shouldFlip,
      hide: shouldHide,
      inline: shouldInline,
      offset: offsetPadding,
      open,
      placement: initialPlacement,
      popperRef: popperRefProp,
      position,
      shift: shouldShift,
      size: shouldResize,
      transition,
      TransitionProps,
      ...other
    },
    ref
  ) => {
    const tooltipRef = useRef(null);
    const ownRef = useForkRef(tooltipRef, ref);
    const popperRef = useRef(null);
    const handlePopperRef = useForkRef(popperRef, popperRefProp);
    const handlePopperRefRef = useRef(handlePopperRef);
    useEnhancedEffect(() => {
      handlePopperRefRef.current = handlePopperRef;
    }, [handlePopperRef]);
    useImperativeHandle(popperRefProp, () => popperRef.current, []);

    const [placement, setPlacement] = useState(initialPlacement);
    const [resolvedAnchorElement, setResolvedAnchorElement] = useState(
      resolveAnchorEl(anchorEl)
    );
    const [popperOptions, setPopperOptions] = useState({});

    useEnhancedEffect(() => {
      if (anchorEl) {
        setResolvedAnchorElement(resolveAnchorEl(anchorEl));
      }
    }, [anchorEl]);

    const arrowComponent = components?.arrow ?? 'div';
    const { height: arrowHeight = 12, id: arrowId = 'arrow' } =
      componentsProps?.arrow ?? {};
    const arrowWidth = arrowHeight;
    useEnhancedEffect(() => {
      setPlacement(initialPlacement);

      const arrowElement = arrowId
        ? document.getElementById(arrowId)
        : document.getElementById('arrow');

      setPopperOptions({
        arrow: showArrow ? { element: arrowElement } : {},
        offset:
          typeof offsetPadding === 'number'
            ? offsetPadding + (showArrow && arrowHeight)
            : typeof offsetPadding === 'string'
            ? parseInt(offsetPadding.replace(/\D/g, '')) +
              (showArrow && arrowHeight)
            : {
                mainAxis: 0 + (showArrow && arrowHeight),
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
              ? { limiter: limitShift() }
              : {}
            : {
                limiter: avoidCollisions ? limitShift() : undefined,
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
    }, [
      arrowHeight,
      arrowId,
      arrowWidth,
      autoPlace,
      avoidCollisions,
      componentsProps,
      initialPlacement,
      offsetPadding,
      shouldAutoUpdate,
      shouldFlip,
      shouldHide,
      shouldInline,
      shouldResize,
      shouldShift,
      showArrow
    ]);

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
          shouldInline ? inline(popperOptions.inline) : undefined,
          offset(popperOptions.offset),
          autoPlace
            ? autoPlacement(popperOptions.autoPlace)
            : shouldFlip
            ? flip(popperOptions.flip)
            : undefined,
          shouldShift ? shift(popperOptions.shift) : undefined,
          shouldResize ? size(popperOptions.size) : undefined,
          showArrow ? arrow(popperOptions.arrow) : undefined,
          shouldHide ? hide(popperOptions.hide) : undefined
        ].filter(Boolean)
      };

      let cleanup;
      if (shouldAutoUpdate) {
        function updatePosition() {
          computePosition(
            resolvedAnchorElement,
            tooltipRef.current,
            popperSettings
          ).then(({ x, y, placement, middlewareData: data }) => {
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
            if (showArrow) {
              const { x: arrowX, y: arrowY } = data.arrow;
              const staticSide = {
                top: { side: 'bottom', transform: 'rotate(315deg)' },
                right: { side: 'left', transform: 'rotate(45deg)' },
                bottom: { side: 'top', transform: 'rotate(135deg)' },
                left: { side: 'right', transform: 'rotate(225deg)' }
              }[placement.split('-')[0]];

              Object.assign(arrowElement.style, {
                left: arrowX != null ? `${arrowX}px` : '',
                top: arrowY != null ? `${arrowY}px` : '',
                right: '',
                transform: staticSide.transform,
                [staticSide.side]: `-${arrowHeight * 0.5 - 2}px`
              });
            }
            setPlacement(placement);
          });
        }

        cleanup = autoUpdate(
          resolvedAnchorElement,
          tooltipRef.current,
          updatePosition
        );
      } else {
        computePosition(
          resolvedAnchorElement,
          tooltipRef.current,
          popperSettings
        ).then(({ x, y, placement, middlewareData: data }) => {
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
          if (showArrow) {
            const { x: arrowX, y: arrowY } = data.arrow;
            const staticSide = {
              top: { side: 'bottom', transform: 'rotate(315deg)' },
              right: { side: 'left', transform: 'rotate(45deg)' },
              bottom: { side: 'top', transform: 'rotate(90deg)' },
              left: { side: 'right', transform: 'rotate(225deg)' }
            }[placement.split('-')[0]];

            Object.assign(arrowElement.style, {
              left: arrowX != null ? `${arrowX}px` : '',
              top: arrowY != null ? `${arrowY}px` : '',
              right: '',
              bottom: '',
              transform: staticSide.transform,
              [staticSide.side]: `-${arrowHeight * 0.5}px`
            });
          }
          setPlacement(placement);
        });
      }

      handlePopperRef(tooltipRef.current);

      return () => {
        if (typeof cleanup === 'function') {
          cleanup();
        }
        handlePopperRef(null);
      };
    }, [resolvedAnchorElement, popperOptions, open]);

    const childProps = {
      placement: placement,
      className: componentsProps?.className
    };

    if (TransitionProps !== null) {
      childProps.TransitionProps = TransitionProps;
    }

    const rootProps = {
      role: 'tooltip',
      ref: ownRef,
      className: cn(componentsProps?.root?.className, 'root'),
      ...other
    };

    const RootComponent = component ?? components?.root ?? 'div';

    return transition ? (
      <RootComponent {...rootProps}>
        {typeof children === 'function'
          ? children({ ...childProps, style: { zIndex: 1 } })
          : children}
        {showArrow && (
          <Fade {...TransitionProps}>
            <PopperArrow
              className={componentsProps?.className}
              Component={arrowComponent}
              height={arrowHeight}
              id={arrowId}
              position={position}
              width={arrowWidth}
              {...componentsProps?.arrow}
            />
          </Fade>
        )}
      </RootComponent>
    ) : (
      <RootComponent {...rootProps}>
        {showArrow && (
          <PopperArrow
            className={componentsProps?.className}
            Component={arrowComponent}
            height={arrowHeight}
            id={arrowId}
            position={position}
            width={arrowWidth}
          />
        )}
        {typeof children === 'function'
          ? children({ ...childProps, style: { zIndex: 1 } })
          : children}
      </RootComponent>
    );
  }
);
PopperTooltip.displayName = 'PopperTooltip';

/*--------------------------- BasePopper ---------------------------*/
const BasePopper = forwardRef(
  (
    {
      anchorEl,
      arrow = false,
      autoPlace = false,
      autoUpdate = true,
      avoidCollisions = true,
      children,
      component = 'div',
      components = {},
      componentsProps = {},
      container: containerProp,
      disablePortal = false,
      flip = true,
      hide = true,
      inline = false,
      keepMounted = false,
      offset = 0,
      open = false,
      placement = 'bottom-center',
      popperRef,
      position = 'absolute',
      shift = true,
      size = false,
      style,
      transition = false,
      ...other
    },
    ref
  ) => {
    const [exited, setExited] = useState(true);

    const handleEnter = () => {
      setExited(false);
    };

    const handleExited = () => {
      setExited(true);
    };

    if (!keepMounted && !open && (!transition || exited)) {
      return null;
    }

    let container;
    if (containerProp) {
      container = containerProp;
    } else if (anchorEl) {
      const resolvedAnchorEl = resolveAnchorEl(anchorEl);

      container =
        resolvedAnchorEl &&
        isHTMLElement(resolvedAnchorEl) &&
        isDescendant(document.getElementById('root'), resolvedAnchorEl) &&
        document.getElementById('root');
    }

    const display =
      !open && keepMounted && (!transition || exited) ? 'none' : undefined;
    const transitionProps = transition
      ? {
          in: open,
          onEnter: handleEnter,
          onExited: handleExited
        }
      : undefined;

    return (
      <Portal disablePortal={disablePortal} container={container}>
        <PopperTooltip
          anchorEl={anchorEl}
          arrow={arrow}
          autoPlace={autoPlace}
          autoUpdate={autoUpdate}
          avoidCollisions={avoidCollisions}
          component={component}
          components={components}
          componentsProps={componentsProps}
          flip={flip}
          hide={hide}
          inline={inline}
          offset={offset}
          open={transition ? !exited : open}
          placement={placement}
          popperRef={popperRef}
          position={position}
          ref={ref}
          shift={shift}
          size={size}
          {...other}
          style={{
            width: 'max-content',
            position: position,
            top: 0,
            left: 0,
            display,
            ...style
          }}
          transition={transition}
          TransitionProps={transitionProps}
        >
          {children}
        </PopperTooltip>
      </Portal>
    );
  }
);
BasePopper.displayName = 'BasePopper';

export default BasePopper;
