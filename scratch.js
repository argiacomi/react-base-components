// Various utility libraries are imported to handle certain tasks
// such as checking if an element is focus visible, providing controlled state,
// creating a unique id, and appending state to owner objects.
// These utilities simplify common tasks or abstract complex behavior.
import * as React from 'react';
import clsx from 'clsx';
import { appendOwnerState } from '@mui/base';
import { alpha } from '@mui/system';
import styled from '../styles/styled';
import useTheme from '../styles/useTheme';
import useThemeProps from '../styles/useThemeProps';
import Grow from '../Grow';
import Popper from '../Popper';
import useEventCallback from '../utils/useEventCallback';
import useForkRef from '../utils/useForkRef';
import useId from '../utils/useId';
import useIsFocusVisible from '../utils/useIsFocusVisible';
import useControlled from '../utils/useControlled';

// Helper function for rounding numbers
function round(value) {
  return Math.round(value * 1e5) / 1e5;
}

// Styled components for Tooltip.
// These are simple wrappers for components like Popper, div, and span
// with a different classname attached to it for styling purposes.
const TooltipPopper = styled(Popper)({});
const TooltipTooltip = styled('div')({});
const TooltipArrow = styled('span')({});

// Variables for hysteresis behavior. They are used for delaying the opening or closing of the tooltip.
let hystersisOpen = false;
let hystersisTimer = null;
let cursorPosition = { x: 0, y: 0 }; // Store the current cursor position

// Reset the hysteresis state.
export function testReset() {
  hystersisOpen = false;
  clearTimeout(hystersisTimer);
}

// Helper function to compose multiple event handlers into one
function composeEventHandler(handler, eventHandler) {
  return (event) => {
    if (eventHandler) {
      eventHandler(event);
    }
    handler(event);
  };
}

// The Tooltip component itself
const Tooltip = React.forwardRef((props, ref) => {
  // Destructure all the props and provide default values
  const {
    arrow = false,
    children,
    classes: classesProp,
    components = {},
    componentsProps = {},
    describeChild = false,
    disableFocusListener = false,
    disableHoverListener = false,
    disableInteractive: disableInteractiveProp = false,
    disableTouchListener = false,
    enterDelay = 100,
    enterNextDelay = 0,
    enterTouchDelay = 700,
    followCursor = false,
    id: idProp,
    leaveDelay = 0,
    leaveTouchDelay = 1500,
    onClose,
    onOpen,
    open: openProp,
    placement = 'bottom',
    PopperComponent: PopperComponentProp,
    PopperProps = {},
    slotProps = {},
    slots = {},
    title,
    TransitionComponent: TransitionComponentProp = Grow,
    TransitionProps,
    ...other
  } = props;

  // Use theme for direction
  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';

  // Create a state variable for childNode and arrowRef using React's useState.
  // Initialize ignoreNonTouchEvents to false. This will help us handle touch and non-touch events differently.
  const [childNode, setChildNode] = React.useState();
  const [arrowRef, setArrowRef] = React.useState(null); // TODO: Remove
  const ignoreNonTouchEvents = React.useRef(false);

  // disableInteractive is true if disableInteractiveProp or followCursor are true.
  const disableInteractive = disableInteractiveProp || followCursor;

  // Create refs for timers. These are used to handle delays before the tooltip opens or closes.
  const closeTimer = React.useRef();
  const enterTimer = React.useRef();
  const leaveTimer = React.useRef();
  const touchTimer = React.useRef();

  // 'useControlled' hook is used to create the 'openState' state variable.
  // This variable tracks whether the tooltip is currently open or not.
  // Also checks if the Tooltip is controlled or uncontrolled based on whether openProp is provided or not.
  const [openState, setOpenState] = useControlled({
    controlled: openProp,
    default: false,
    name: 'Tooltip',
    state: 'open'
  });

  let open = openState;

  // In non-production environments, an effect is used to warn if a disabled button is used as a child of Tooltip.
  // Disabled elements do not fire events, which Tooltip needs in order to work properly.
  if (process.env.NODE_ENV !== 'production') {
    const { current: isControlled } = React.useRef(openProp !== undefined);
    React.useEffect(() => {
      if (
        childNode &&
        childNode.disabled &&
        !isControlled &&
        title !== '' &&
        childNode.tagName.toLowerCase() === 'button'
      ) {
        console.error(
          `You are providing a disabled 'button' child to the Tooltip component. A disabled element does not fire events. Tooltip needs to listen to the child element's events to display the title. Add a simple wrapper element, such as a 'span'.`
        );
      }
    }, [title, childNode, isControlled]);
  }

  // Generate a unique id for the Tooltip.
  const id = useId(idProp);

  // PrevUserSelect stores the user-select style before a tooltip is shown.
  const prevUserSelect = React.useRef();

  // stopTouchInteraction is a function that reverts the user-select style after the tooltip is shown and clears the touch timer.
  const stopTouchInteraction = React.useCallback(() => {
    if (prevUserSelect.current !== undefined) {
      document.body.style.WebkitUserSelect = prevUserSelect.current;
      prevUserSelect.current = undefined;
    }
    clearTimeout(touchTimer.current);
  }, []);

  // An effect is used to clean up timeouts when the Tooltip component unmounts.
  React.useEffect(() => {
    return () => {
      clearTimeout(closeTimer.current);
      clearTimeout(enterTimer.current);
      clearTimeout(leaveTimer.current);
      stopTouchInteraction();
    };
  }, [stopTouchInteraction]);

  // handleOpen is a function that opens the tooltip and calls onOpen if provided.
  const handleOpen = (event) => {
    clearTimeout(hystersisTimer);
    hystersisOpen = true;

    setOpenState(true);

    if (onOpen && !open) {
      onOpen(event);
    }
  };

  // handleClose is a function that closes the tooltip and calls onClose if provided.
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
    }, theme.transitions.duration.shortest);
  });

  // handleEnter opens the tooltip with a delay.
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

  // handleLeave closes the tooltip with a delay.
  const handleLeave = (event) => {
    clearTimeout(enterTimer.current);
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => {
      handleClose(event);
    }, leaveDelay);
  };

  // Define an object that can hold a reference to the tooltip and check its visibility.
  // If the tooltip is not visible, call handleLeave to close the tooltip.
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

  // Continue here...// handleFocus is called when the tooltip gets focus. It updates the childNode and calls handleEnter.
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

  // detectTouchStart sets ignoreNonTouchEvents to true and calls onTouchStart of the children props if it exists.
  const detectTouchStart = (event) => {
    ignoreNonTouchEvents.current = true;

    const childrenProps = children.props;
    if (childrenProps.onTouchStart) {
      childrenProps.onTouchStart(event);
    }
  };

  // handleMouseOver and handleMouseLeave are references to handleEnter and handleLeave respectively.
  const handleMouseOver = handleEnter;
  const handleMouseLeave = handleLeave;

  // handleTouchStart disables text selection on long-tap on iOS devices, sets a timeout to revert this change, and calls handleEnter.
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

  // handleTouchEnd calls onTouchEnd of the children props if it exists, calls stopTouchInteraction, and sets a timeout to call handleClose.
  const handleTouchEnd = (event) => {
    if (children.props.onTouchEnd) {
      children.props.onTouchEnd(event);
    }

    stopTouchInteraction();
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => {
      handleClose(event);
    }, leaveTouchDelay);
  };

  // This effect sets up a keydown event listener on the document that closes the tooltip if the escape key is pressed.
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

  // handleRef is a function that sets the ref for the child node.
  const handleRef = useForkRef(children.ref, focusVisibleRef, setChildNode, ref);

  // If the title is empty, the tooltip is not displayed.
  if (!title && title !== 0) {
    open = false;
  }

  const popperRef = React.useRef();

  // handleMouseMove updates the cursorPosition and calls onMouseMove of the children props if it exists.
  const handleMouseMove = (event) => {
    const childrenProps = children.props;
    if (childrenProps.onMouseMove) {
      childrenProps.onMouseMove(event);
    }

    cursorPosition = { x: event.clientX, y: event.clientY };

    if (popperRef.current) {
      popperRef.current.update();
    }
  };

  // This section sets up the properties for the tooltip.
  // nameOrDescProps sets either the 'aria-label' or the 'aria-labelledby' and 'title' attributes depending on whether the tooltip text is a string and whether it describes the child.
  const nameOrDescProps = {};
  const titleIsString = typeof title === 'string';
  if (describeChild) {
    nameOrDescProps.title = !open && titleIsString && !disableHoverListener ? title : null;
    nameOrDescProps['aria-describedby'] = open ? id : null;
  } else {
    nameOrDescProps['aria-label'] = titleIsString ? title : null;
    nameOrDescProps['aria-labelledby'] = open && !titleIsString ? id : null;
  }

  // childrenProps are the props that are passed to the child of the tooltip.
  const childrenProps = {
    ...nameOrDescProps,
    ...other,
    ...children.props,
    className: clsx(other.className, children.props.className),
    onTouchStart: detectTouchStart,
    ref: handleRef,
    ...(followCursor ? { onMouseMove: handleMouseMove } : {})
  };

  // This section contains a warning for development mode if the 'title' prop is present on the children of the Tooltip.
  if (process.env.NODE_ENV !== 'production') {
    if (children.props.title) {
      console.error(
        [
          'MUI: You have provided a `title` prop to the child of <Tooltip />.',
          `Remove this title prop \`${children.props.title}\` or the Tooltip component.`
        ].join('\n')
      );
    }
  }

  // Define an empty object for interactive wrapper listeners
  const interactiveWrapperListeners = {};

  // This block adds 'touchstart' and 'touchend' event handlers to childrenProps if 'disableTouchListener' prop is not set.
  // The handlers are directly assigned using the 'handleTouchStart' and 'handleTouchEnd' functions.
  if (!disableTouchListener) {
    childrenProps.onTouchStart = handleTouchStart;
    childrenProps.onTouchEnd = handleTouchEnd;
  }

  // This block adds 'mouseover' and 'mouseleave' event handlers to childrenProps if 'disableHoverListener' prop is not set.
  // The handlers are created using the 'composeEventHandler' function which combines the provided handlers with the existing ones in the 'childrenProps'.
  // If 'disableInteractive' is not set, the same handlers are added to the 'interactiveWrapperListeners'.
  if (!disableHoverListener) {
    childrenProps.onMouseOver = composeEventHandler(handleMouseOver, childrenProps.onMouseOver);
    childrenProps.onMouseLeave = composeEventHandler(handleMouseLeave, childrenProps.onMouseLeave);

    if (!disableInteractive) {
      interactiveWrapperListeners.onMouseOver = handleMouseOver;
      interactiveWrapperListeners.onMouseLeave = handleMouseLeave;
    }
  }

  // Similar to the block above, this one adds 'focus' and 'blur' event handlers to the 'childrenProps' if 'disableFocusListener' prop is not set.
  // Again, if 'disableInteractive' is not set, the same handlers are added to the 'interactiveWrapperListeners'.
  if (!disableFocusListener) {
    childrenProps.onFocus = composeEventHandler(handleFocus, childrenProps.onFocus);
    childrenProps.onBlur = composeEventHandler(handleBlur, childrenProps.onBlur);

    if (!disableInteractive) {
      interactiveWrapperListeners.onFocus = handleFocus;
      interactiveWrapperListeners.onBlur = handleBlur;
    }
  }

  // This block in the development mode warns the developer if the 'title' prop is set on the children of the Tooltip component.
  // It recommends either removing the 'title' prop from the children or the Tooltip component.
  if (process.env.NODE_ENV !== 'production') {
    if (children.props.title) {
      console.error(
        [
          'MUI: You have provided a `title` prop to the child of <Tooltip />.',
          `Remove this title prop \`${children.props.title}\` or the Tooltip component.`
        ].join('\n')
      );
    }
  }

  // tooltipModifiers are the modifiers used by the tooltip popper.
  // The popperOptions merges tooltipModifiers with any modifiers passed in the PopperProps.
  const popperOptions = React.useMemo(() => {
    let tooltipModifiers = [
      {
        name: 'arrow',
        enabled: Boolean(arrowRef),
        options: {
          element: arrowRef,
          padding: 4
        }
      }
    ];

    if (PopperProps.popperOptions?.modifiers) {
      tooltipModifiers = tooltipModifiers.concat(PopperProps.popperOptions.modifiers);
    }

    return {
      ...PopperProps.popperOptions,
      modifiers: tooltipModifiers
    };
  }, [arrowRef, PopperProps]);

  // ownerState contains properties of the Tooltip component.
  const ownerState = {
    ...props,
    isRtl,
    arrow,
    disableInteractive,
    placement,
    PopperComponentProp,
    touch: ignoreNonTouchEvents.current
  };

  // classes are the utility classes used by the Tooltip component.
  const classes = useUtilityClasses(ownerState);

  // PopperComponent is the popper component used by the Tooltip.
  const PopperComponent = slots.popper ?? components.Popper ?? TooltipPopper;

  // TransitionComponent is the transition component used by the Tooltip.
  const TransitionComponent =
    slots.transition ?? components.Transition ?? TransitionComponentProp ?? Grow;

  // TooltipComponent is the actual tooltip component.
  const TooltipComponent = slots.tooltip ?? components.Tooltip ?? TooltipTooltip;

  // TooltipArrow is a styled component that applies styles to a span element
  const ArrowComponent = slots.arrow ?? components.Arrow ?? TooltipArrow;

  // The popperProps, transitionProps, tooltipProps, and tooltipArrowProps objects are created.
  // They are used to combine classes, ownerState, and props for their respective components.
  const popperProps = appendOwnerState(
    PopperComponent,
    {
      ...PopperProps,
      ...(slotProps.popper ?? componentsProps.popper),
      className: clsx(
        classes.popper,
        PopperProps?.className,
        (slotProps.popper ?? componentsProps.popper)?.className
      )
    },
    ownerState
  );

  const transitionProps = appendOwnerState(
    TransitionComponent,
    { ...TransitionProps, ...(slotProps.transition ?? componentsProps.transition) },
    ownerState
  );

  const tooltipProps = appendOwnerState(
    TooltipComponent,
    {
      ...(slotProps.tooltip ?? componentsProps.tooltip),
      className: clsx(classes.tooltip, (slotProps.tooltip ?? componentsProps.tooltip)?.className)
    },
    ownerState
  );

  const tooltipArrowProps = appendOwnerState(
    ArrowComponent,
    {
      ...(slotProps.arrow ?? componentsProps.arrow),
      className: clsx(classes.arrow, (slotProps.arrow ?? componentsProps.arrow)?.className)
    },
    ownerState
  );

  // Rendering tooltip along with children. React.Fragment is used to group the Tooltip and child components without adding extra nodes to the DOM.
  return (
    <React.Fragment>
      {/* React.cloneElement is used to clone and return a new React element using children as the starting element.
        The resulting element will have the original element’s props with the new props merged in shallowly.
        In this case, it will have all the event handlers needed for the Tooltip to work. */}
      {React.cloneElement(children, childrenProps)}
      {/* If the tooltip is open, then the Popper component is rendered, otherwise null */}
      {open && (
        // The Popper component is used for positioning the Tooltip. It uses the popper.js library under the hood.
        <PopperComponent
          {...popperProps}
          as={Popper}
          anchorEl={anchorEl}
          open
          ref={popperRef}
          role={undefined} // popper does not have an accessible role.
          transition
          popperOptions={popperOptions}
          placement={placement}
        >
          {/* Render prop function as a child to the Popper component.
            It receives the placement of the Tooltip and whether the Tooltip is exiting (TransitionProps). */}
          {({ TransitionProps: TransitionPropsInner }) => (
            <TransitionComponent
              {...transitionProps}
              {...TransitionPropsInner}
              timeout={theme.transitions.duration.shorter}
            >
              <TooltipComponent {...tooltipProps}>
                {/* If the arrow prop is true, the ArrowComponent is rendered */}
                {arrow ? (
                  <ArrowComponent {...tooltipArrowProps} ref={setArrowRef} data-popper-arrow />
                ) : null}
                {title}
              </TooltipComponent>
            </TransitionComponent>
          )}
        </PopperComponent>
      )}
    </React.Fragment>
  );
});

Tooltip.displayName = 'Tooltip';

export default Tooltip;
