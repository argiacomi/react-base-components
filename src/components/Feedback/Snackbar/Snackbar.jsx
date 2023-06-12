import * as React from 'react';
import { styled, useTheme } from '@styles';
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
    ContentProps,
    disableWindowBlurListener = false,
    key,
    message,
    onBlur,
    onClose,
    onFocus,
    onMouseEnter,
    onMouseLeave,
    open,
    queue = false,
    resumeHideDuration,
    transition = 'Slide',
    transitionDuration = defaultTransitionDuration,
    TransitionProps: { onEnter, onExited, ...TransitionProps } = {},
    ...other
  } = props;

  console.log('Snackbar', props);

  const TransitionComponent =
    typeof transition === 'string'
      ? Transitions[transition] || Transitions['Grow']
      : Transitions['Grow'];

  const ownerState = {
    ...props,
    anchorOrigin: { vertical, horizontal },
    autoHideDuration,
    disableWindowBlurListener,
    queue,
    TransitionComponent,
    transitionDuration
  };

  const { getRootProps, onClickAway } = useSnackbar({ ...ownerState });

  const [exited, setExited] = React.useState(true);

  const rootProps = useSlotProps({
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
    setExited(true);

    if (onExited) {
      onExited(node);
    }
  };

  const handleEnter = (node, isAppearing) => {
    setExited(false);

    if (onEnter) {
      onEnter(node, isAppearing, key);
    }
  };

  if (!open && exited) {
    return null;
  }

  return (
    <ClickAwayListener onClickAway={onClickAway} {...ClickAwayListenerProps}>
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
