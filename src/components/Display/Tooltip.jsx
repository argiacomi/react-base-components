import React from 'react';
import clsx from 'clsx';
import { styled, useTheme } from '@styles';
import {
  appendOwnerState,
  createChainedFunction,
  useControlled,
  useEventCallback,
  useForkRef,
  useId,
  useIsFocusVisible
} from '@components/lib';
import { Popper, PopperContent } from '@components/utils';

export const tooltipClasses = {
  root: 'Tooltip-Root',
  tooltip: 'Tooltip-Tooltip',
  arrow: 'Tooltip-Arrow'
};

function round(value) {
  return Math.round(value * 1e5) / 1e5;
}

const TooltipPopper = styled(Popper)(({ theme, ownerState, open }) => ({
  zIndex: theme.zIndex.tooltip,
  pointerEvents: 'none',
  ...(!ownerState.disableInteractive && {
    pointerEvents: 'auto'
  }),
  ...(!open && {
    pointerEvents: 'none'
  })
}));

const TooltipTooltip = styled(PopperContent)(({ theme, ownerState }) => {
  const backgroundColor = theme.alpha.add(theme.color.gray[700], 0.92);
  return {
    backgroundColor: backgroundColor,
    ['--popper-arrow-bg']: backgroundColor,
    borderRadius: theme.rounded.md,
    color: theme.color.white,
    fontFamily: 'inherit',
    padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
    fontSize: theme.spacing(11 / 8),
    maxWidth: 300,
    margin: 2,
    wordWrap: 'break-word',
    fontWeight: theme.text.weight.medium,
    ...(ownerState.touch && {
      padding: '8px 16px',
      fontSize: theme.spacing(14 / 8),
      lineHeight: `${round(16 / 14)}em`,
      fontWeight: theme.text.weight.normal
    }),
    [`.${tooltipClasses.root}[data-popper-placement*="left"] &`]: {
      transformOrigin: 'right center',
      ...(!ownerState.isRtl
        ? {
            marginRight: theme.spacing(14 / 8),
            ...(ownerState.touch && {
              marginRight: theme.spacing(3)
            })
          }
        : {
            marginLeft: theme.spacing(14 / 8),
            ...(ownerState.touch && {
              marginLeft: theme.spacing(3)
            })
          })
    },
    [`.${tooltipClasses.root}[data-popper-placement*="right"] &`]: {
      transformOrigin: 'left center',
      ...(!ownerState.isRtl
        ? {
            marginLeft: theme.spacing(14 / 8),
            ...(ownerState.touch && {
              marginLeft: theme.spacing(3)
            })
          }
        : {
            marginRight: theme.spacing(14 / 8),
            ...(ownerState.touch && {
              marginRight: theme.spacing(3)
            })
          })
    },
    [`.${tooltipClasses.root}[data-popper-placement*="top"] &`]: {
      transformOrigin: 'center bottom',
      marginBottom: theme.spacing(14 / 8),
      ...(ownerState.touch && {
        marginBottom: theme.spacing(3)
      })
    },
    [`.${tooltipClasses.root}[data-popper-placement*="bottom"] &`]: {
      transformOrigin: 'center top',
      marginTop: theme.spacing(14 / 8),
      ...(ownerState.touch && {
        marginTop: theme.spacing(3)
      })
    }
  };
});

let hystersisOpen = false;
let hystersisTimer = null;

export function testReset() {
  hystersisOpen = false;
  clearTimeout(hystersisTimer);
}

const Tooltip = React.forwardRef((props, ref) => {
  const {
    arrow = false,
    anchorEl,
    children,
    className,
    describeChild = false,
    disableFocusListener = false,
    disableHoverListener = false,
    disableInteractive: disableInteractiveProp = false,
    disablePortal = false,
    disableTouchListener = false,
    enterDelay = 100,
    enterNextDelay = 0,
    enterTouchDelay = 700,
    followCursor = false,
    keepMounted = false,
    id: idProp,
    leaveDelay = 50,
    leaveTouchDelay = 1500,
    onClose,
    onOpen,
    open: openProp,
    placement = 'bottom-center',
    popperOptions: popperOptionsProp = {},
    slotProps: slotPropsprop = {},
    slots = {},
    title,
    transition: transitionProp,
    TransitionProps,
    ...other
  } = props;

  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';

  const [childNode, setChildNode] = React.useState();
  const [virtualEl, setvirtualEl] = React.useState();
  const ignoreNonTouchEvents = React.useRef(false);

  const disableInteractive = disableInteractiveProp || followCursor;

  const closeTimer = React.useRef();
  const enterTimer = React.useRef();
  const leaveTimer = React.useRef();
  const touchTimer = React.useRef();

  const [openState, setOpenState] = useControlled({
    controlled: openProp,
    default: false,
    name: 'Tooltip',
    state: 'open'
  });

  let open = openState;

  if (!import.meta.env.PROD) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { current: isControlled } = React.useRef(openProp !== undefined);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      if (
        childNode &&
        childNode.disabled &&
        !isControlled &&
        title !== '' &&
        childNode.tagName.toLowerCase() === 'button'
      ) {
        console.error(
          `You are providing a disabled 'button' child to the Tooltip component.
          A disabled element does not fire events.
          Tooltip needs to listen to the child element's events to display the title.
          Add a simple wrapper element, such as a 'span'.`
        );
      }
    }, [title, childNode, isControlled]);
  }

  const id = useId(idProp);

  const prevUserSelect = React.useRef();

  const stopTouchInteraction = React.useCallback(() => {
    if (prevUserSelect.current !== undefined) {
      document.body.style.WebkitUserSelect = prevUserSelect.current;
      prevUserSelect.current = undefined;
    }
    clearTimeout(touchTimer.current);
  }, []);

  React.useEffect(() => {
    return () => {
      clearTimeout(closeTimer.current);
      clearTimeout(enterTimer.current);
      clearTimeout(leaveTimer.current);
      stopTouchInteraction();
    };
  }, [stopTouchInteraction]);

  const handleOpen = (event) => {
    clearTimeout(hystersisTimer);
    hystersisOpen = true;

    setOpenState(true);

    if (onOpen && !open) {
      onOpen(event);
    }
  };

  const handleClose = useEventCallback((event) => {
    clearTimeout(hystersisTimer);
    hystersisTimer = setTimeout(() => {
      hystersisOpen = false;
    }, 800 + leaveDelay);
    setOpenState(false);

    if (onClose && open) {
      onClose(event);
    }

    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      ignoreNonTouchEvents.current = false;
    }, theme.transition.duration.shortest);
  });

  const handleEnter = (event) => {
    if (ignoreNonTouchEvents.current && event.type !== 'touchstart') {
      return;
    }

    if (childNode) {
      childNode.removeAttribute('title');
    }

    clearTimeout(enterTimer.current);
    clearTimeout(leaveTimer.current);
    if (enterDelay || (hystersisOpen && enterNextDelay)) {
      enterTimer.current = setTimeout(
        () => {
          handleOpen(event);
        },
        hystersisOpen ? enterNextDelay : enterDelay
      );
    } else {
      handleOpen(event);
    }
  };

  const handleLeave = (event) => {
    clearTimeout(enterTimer.current);
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => {
      handleClose(event);
    }, leaveDelay);
  };

  const {
    isFocusVisibleRef,
    onBlur: handleBlurVisible,
    onFocus: handleFocusVisible,
    ref: focusVisibleRef
  } = useIsFocusVisible();
  const [, setChildIsFocusVisible] = React.useState(false);
  const handleBlur = (event) => {
    handleBlurVisible(event);
    if (isFocusVisibleRef.current === false) {
      setChildIsFocusVisible(false);
      handleLeave(event);
    }
  };

  const handleFocus = (event) => {
    if (!childNode) {
      setChildNode(event.currentTarget);
    }

    handleFocusVisible(event);
    if (isFocusVisibleRef.current === true) {
      setChildIsFocusVisible(true);
      handleEnter(event);
    }
  };

  const detectTouchStart = (event) => {
    ignoreNonTouchEvents.current = true;

    const childrenProps = children.props;
    if (childrenProps.onTouchStart) {
      childrenProps.onTouchStart(event);
    }
  };

  const handleMouseOver = handleEnter;
  const handleMouseLeave = handleLeave;

  const handleTouchStart = (event) => {
    detectTouchStart(event);
    clearTimeout(leaveTimer.current);
    clearTimeout(closeTimer.current);
    stopTouchInteraction();

    prevUserSelect.current = document.body.style.WebkitUserSelect;
    document.body.style.WebkitUserSelect = 'none';

    touchTimer.current = setTimeout(() => {
      document.body.style.WebkitUserSelect = prevUserSelect.current;
      handleEnter(event);
    }, enterTouchDelay);
  };

  const handleTouchEnd = (event) => {
    if (children.props?.onTouchEnd) {
      children.props?.onTouchEnd(event);
    }

    stopTouchInteraction();
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => {
      handleClose(event);
    }, leaveTouchDelay);
  };

  React.useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handleKeyDown(nativeEvent) {
      if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
        handleClose(nativeEvent);
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose, open]);

  const handleRef = useForkRef(children.ref, focusVisibleRef, setChildNode, ref);

  if (!title && title !== 0) {
    open = false;
  }

  const popperRef = React.useRef();

  const handleMouseMove = (event) => {
    const childrenProps = children.props;
    if (childrenProps.onMouseMove) {
      childrenProps.onMouseMove(event);
    }

    setvirtualEl({
      getBoundingClientRect() {
        return {
          width: 0,
          height: 0,
          x: event.clientX,
          y: event.clientY,
          top: event.clientY,
          left: event.clientX,
          right: event.clientX,
          bottom: event.clientY
        };
      }
    });
  };

  const nameOrDescProps = {};
  const titleIsString = typeof title === 'string';
  if (describeChild) {
    nameOrDescProps.title = !open && titleIsString && !disableHoverListener ? title : null;
    nameOrDescProps['aria-describedby'] = open ? id : null;
  } else {
    nameOrDescProps['aria-label'] = titleIsString ? title : null;
    nameOrDescProps['aria-labelledby'] = open && !titleIsString ? id : null;
  }

  const childrenProps = {
    ...nameOrDescProps,
    ...other,
    ...children.props,
    className: clsx(className, children.props?.className),
    onTouchStart: detectTouchStart,
    ref: handleRef,
    ...(followCursor ? { onMouseMove: handleMouseMove } : {})
  };

  if (!import.meta.env.PROD) {
    if (children.props?.title) {
      console.error(
        `You have provided a 'title' prop to the child of <Tooltip />.
        Remove this title prop ${children.props?.title} or the Tooltip component.`
      );
    }
  }

  const interactiveWrapperListeners = {};

  if (!disableTouchListener) {
    childrenProps.onTouchStart = handleTouchStart;
    childrenProps.onTouchEnd = handleTouchEnd;
  }

  if (!disableHoverListener) {
    childrenProps.onMouseOver = createChainedFunction([handleMouseOver, childrenProps.onMouseOver]);
    childrenProps.onMouseLeave = createChainedFunction([
      handleMouseLeave,
      childrenProps.onMouseLeave
    ]);

    if (!disableInteractive) {
      interactiveWrapperListeners.onMouseOver = handleMouseOver;
      interactiveWrapperListeners.onMouseLeave = handleMouseLeave;
    }
  }

  if (!disableFocusListener) {
    childrenProps.onFocus = createChainedFunction([handleFocus, childrenProps.onFocus]);
    childrenProps.onBlur = createChainedFunction([handleBlur, childrenProps.onBlur]);

    if (!disableInteractive) {
      interactiveWrapperListeners.onFocus = handleFocus;
      interactiveWrapperListeners.onBlur = handleBlur;
    }
  }

  if (!import.meta.env.PROD) {
    if (children.props?.title) {
      console.error(
        `You have provided a 'title' prop to the child of <Tooltip />.
        Remove this title prop ${children.props?.title} or the Tooltip component.`
      );
    }
  }

  const popperOptions = React.useMemo(() => {
    let tooltipModifiers = {
      arrow: {
        id: 'arrow',
        width: 15,
        padding: 8
      },
      size: false,
      autoUpdate: (followCursor || anchorEl) && { animationFrame: true }
    };

    if (popperOptionsProp) {
      tooltipModifiers = { ...tooltipModifiers, ...popperOptionsProp };
    }

    return tooltipModifiers;
  }, [anchorEl, followCursor, popperOptionsProp]);

  const ownerState = {
    ...props,
    isRtl,
    arrow,
    disableInteractive,
    placement,
    touch: ignoreNonTouchEvents.current
  };

  const PopperComponent = slots.popper ?? TooltipPopper;

  const transition = slots.transition ?? transitionProp ?? 'Grow';

  const TooltipComponent = slots.tooltip ?? TooltipTooltip;

  const popperProps = appendOwnerState(
    PopperComponent,
    {
      ...popperOptionsProp,
      ...slotPropsprop.popper,
      className: clsx(
        tooltipClasses.root,
        popperOptionsProp?.className,
        slotPropsprop.popper?.className
      )
    },
    ownerState
  );

  const transitionProps = { ...TransitionProps, ...slotPropsprop.transition };

  const tooltipProps = {
    ...slotPropsprop.tooltip,
    className: clsx(tooltipClasses.tooltip, slotPropsprop.tooltip?.className)
  };

  const tooltipArrowProps = {
    ...slotPropsprop.arrow,
    className: clsx(tooltipClasses.arrow, slotPropsprop.arrow?.className)
  };

  const slotProps = { root: tooltipProps, arrow: tooltipArrowProps };

  return (
    <React.Fragment>
      {React.cloneElement(children, childrenProps)}
      {open && (
        <PopperComponent
          as={Popper}
          placement={placement}
          anchorEl={anchorEl ?? (followCursor ? virtualEl : childNode)}
          component={TooltipComponent}
          keepMounted={keepMounted}
          disablePortal={disablePortal}
          popperRef={popperRef}
          disableArrow={!arrow}
          open={childNode ? open : false}
          popperOptions={popperOptions}
          id={id}
          slotProps={slotProps}
          transition={transition}
          TransitionProps={transitionProps}
          {...interactiveWrapperListeners}
          {...popperProps}
          {...other}
        >
          {title}
        </PopperComponent>
      )}
    </React.Fragment>
  );
});

Tooltip.displayName = 'Tooltip';

export { Tooltip };
