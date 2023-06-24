import React from 'react';
import styled, { useTheme } from '@styles';
import { useSlotProps } from '@components/lib';
import { ClickAwayListener } from '@components/utils';
import useSnackbar from './useSnackbar';
import SnackbarContent from './SnackbarContent';
import * as Transitions from '@transitions';

const getDirection = (vertical, horizontal) => {
  if (horizontal === 'left') return 'right';
  if (horizontal === 'right') return 'left';
  if (vertical === 'top') return 'down';
  if (vertical === 'bottom') return 'up';
};

const SnackbarRoot = styled('div')(
  ({ theme, ownerState }) => {
    const center = {
      left: '50%',
      right: 'auto',
      transform: 'translateX(-50%)'
    };

    return {
      zIndex: theme.zIndex.snackbar,
      position: 'fixed',
      display: 'flex',
      left: theme.spacing(1),
      right: theme.spacing(1),
      justifyContent: 'center',
      alignItems: 'center',
      ...(ownerState.anchorOrigin.vertical === 'top'
        ? { top: theme.spacing(1) }
        : { bottom: theme.spacing(1) }),
      ...(ownerState.anchorOrigin.horizontal === 'left' && { justifyContent: 'flex-start' }),
      ...(ownerState.anchorOrigin.horizontal === 'right' && { justifyContent: 'flex-end' }),
      [theme.breakpoints.up('sm')]: {
        ...(ownerState.anchorOrigin.vertical === 'top'
          ? { top: theme.spacing(3) }
          : { bottom: theme.spacing(3) }),
        ...(ownerState.anchorOrigin.horizontal === 'center' && center),
        ...(ownerState.anchorOrigin.horizontal === 'left' && {
          left: theme.spacing(3),
          right: 'auto'
        }),
        ...(ownerState.anchorOrigin.horizontal === 'right' && {
          right: theme.spacing(3),
          left: 'auto'
        })
      }
    };
  },
  ({ theme, ownerState }) => ({
    ...(ownerState.queue && {
      zIndex: 'auto',
      position: 'relative',
      inset: 'auto',
      [theme.breakpoints.up('sm')]: { inset: 'auto' }
    })
  })
);

const Snackbar = React.forwardRef((props, ref) => {
  const theme = useTheme();
  const defaultTransitionDuration = {
    enter: theme.transition.duration.enteringScreen,
    exit: theme.transition.duration.leavingScreen
  };

  const {
    action,
    anchorOrigin: { vertical, horizontal } = { vertical: 'bottom', horizontal: 'left' },
    autoHideDuration = null,
    children,
    className,
    ClickAwayListenerProps,
    Component,
    ContentProps,
    disableWindowBlurListener = false,
    id,
    message,
    open,
    queue = false,
    transition = 'Slide',
    transitionDuration = defaultTransitionDuration,
    TransitionProps: { onEnter, onExited, ...TransitionProps } = {},
    ...other
  } = props;

  const TransitionComponent =
    typeof transition === 'string'
      ? Transitions[transition] || Transitions['Grow']
      : Transitions['Grow'];

  const QueueTransition = Transitions['Collapse'];

  const ownerState = {
    ...props,
    anchorOrigin: { vertical, horizontal },
    autoHideDuration,
    disableWindowBlurListener,
    id,
    queue,
    TransitionComponent,
    transitionDuration
  };

  const { getRootProps, onClickAway } = useSnackbar({ ...ownerState });

  const timeout = React.useRef();
  const [exited, setExited] = React.useState(true);
  const [collapsed, setCollapsed] = React.useState(true);

  const rootProps = useSlotProps({
    as: Component || 'div',
    elementType: SnackbarRoot,
    getSlotProps: getRootProps,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref
    },
    className: ['Snackbar-Root', className]
  });

  const handleExited = (node) => {
    setCollapsed((col) => !col);

    timeout.current = setTimeout(() => {
      setExited(true);
      if (onExited) {
        onExited(node);
      }
    }, 150);
  };

  const handleEnter = (node, isAppearing) => {
    setExited(false);

    if (onEnter) {
      onEnter(node, isAppearing, id);
    }
  };

  React.useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  }, []);

  if (!open && exited) {
    return null;
  }

  return queue ? (
    <QueueTransition in={collapsed} onExited={handleExited}>
      <ClickAwayListener
        onClickAway={onClickAway}
        eventTypes={['onTouchEnd']}
        {...ClickAwayListenerProps}
      >
        <SnackbarRoot {...rootProps}>
          <TransitionComponent
            appear
            in={open}
            timeout={transitionDuration}
            direction={getDirection(vertical, horizontal)}
            onEnter={handleEnter}
            onExited={handleExited}
            {...TransitionProps}
          >
            {children || <SnackbarContent message={message} action={action} {...ContentProps} />}
          </TransitionComponent>
        </SnackbarRoot>
      </ClickAwayListener>
    </QueueTransition>
  ) : (
    <ClickAwayListener
      onClickAway={onClickAway}
      eventTypes={['onTouchEnd']}
      {...ClickAwayListenerProps}
    >
      <SnackbarRoot {...rootProps}>
        <TransitionComponent
          appear
          in={open}
          timeout={transitionDuration}
          direction={getDirection(vertical, horizontal)}
          onEnter={handleEnter}
          onExited={handleExited}
          {...TransitionProps}
        >
          {children || <SnackbarContent message={message} action={action} {...ContentProps} />}
        </TransitionComponent>
      </SnackbarRoot>
    </ClickAwayListener>
  );
});

Snackbar.displayName = 'Snackbar';

export default Snackbar;
