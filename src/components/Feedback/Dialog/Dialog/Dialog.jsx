import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling, useTheme } from '@styles';
import { capitalize, useId } from '@components/lib';
import Backdrop from '@components/Feedback/Backdrop';
import Paper from '@components/Surfaces/Paper';
import { Fade, Modal } from '@components/utils';
import DialogContext from './DialogContext';

export const dialogClasses = {
  root: 'Dialog-Root',
  container: 'Dialog-Container',
  paper: 'Dialog-Paper',
  fullWidth: 'PaperFullWidth',
  fullScreen: 'PaperFullScreen',
  paperScrollBody: 'PaperScrollBody'
};

const DialogBackdrop = styled(Backdrop, {
  name: 'Dialog',
  slot: 'Backdrop'
})({
  zIndex: -1
});

const DialogRoot = styled(Modal, {
  name: 'Dialog',
  slot: 'Root'
})(({ ownerState }) => ({
  '@media print': {
    position: 'absolute !important'
  },
  ...ownerState.cssStyles
}));

const DialogContainer = styled('div', {
  name: 'Dialog',
  slot: 'Container'
})(({ ownerState }) => ({
  height: '100%',
  '@media print': {
    height: 'auto'
  },
  // We disable the focus ring for mouse, touch and keyboard users.
  outline: 0,
  ...(ownerState.scroll === 'paper' && {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }),
  ...(ownerState.scroll === 'body' && {
    overflowY: 'auto',
    overflowX: 'hidden',
    textAlign: 'center',
    '&:after': {
      content: '""',
      display: 'inline-block',
      verticalAlign: 'middle',
      height: '100%',
      width: '0'
    }
  })
}));

const DialogPaper = styled(Paper, {
  name: 'Dialog',
  slot: 'Paper'
})(({ theme, ownerState }) => ({
  margin: 32,
  position: 'relative',
  overflowY: 'auto', // Fix IE11 issue, to remove at some point.
  '@media print': {
    overflowY: 'visible',
    boxShadow: 'none'
  },
  ...(ownerState.scroll === 'paper' && {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 'calc(100% - 64px)'
  }),
  ...(ownerState.scroll === 'body' && {
    display: 'inline-block',
    verticalAlign: 'middle',
    textAlign: 'left' // 'initial' doesn't work on IE11
  }),
  ...(!ownerState.maxWidth && {
    maxWidth: 'calc(100% - 64px)'
  }),
  ...(ownerState.maxWidth === 'xs' && {
    maxWidth:
      theme.breakpoints.unit === 'px'
        ? Math.max(theme.breakpoints.values.xs, 444)
        : `max(${theme.breakpoints.values.xs}${theme.breakpoints.unit}, 444px)`,
    [`&.${dialogClasses.paperScrollBody}`]: {
      [theme.breakpoints.down(Math.max(theme.breakpoints.values.xs, 444) + 32 * 2)]: {
        maxWidth: 'calc(100% - 64px)'
      }
    }
  }),
  ...(ownerState.maxWidth &&
    ownerState.maxWidth !== 'xs' && {
      maxWidth: `${theme.breakpoints.values[ownerState.maxWidth]}${theme.breakpoints.unit}`,
      [`&.${dialogClasses.paperScrollBody}`]: {
        [theme.breakpoints.down(theme.breakpoints.values[ownerState.maxWidth] + 32 * 2)]: {
          maxWidth: 'calc(100% - 64px)'
        }
      }
    }),
  ...(ownerState.fullWidth && {
    width: 'calc(100% - 64px)'
  }),
  ...(ownerState.fullScreen && {
    margin: 0,
    width: '100%',
    maxWidth: '100%',
    height: '100%',
    maxHeight: 'none',
    borderRadius: 0,
    [`&.${dialogClasses.paperScrollBody}`]: {
      margin: 0,
      maxWidth: '100%'
    }
  })
}));

const Dialog = React.forwardRef((props, ref) => {
  const theme = useTheme();
  const defaultTransitionDuration = {
    enter: theme.transition.duration.enteringScreen,
    exit: theme.transition.duration.leavingScreen
  };

  const {
    'aria-describedby': ariaDescribedby,
    'aria-labelledby': ariaLabelledbyProp,
    BackdropComponent,
    children,
    className,
    disableEscapeKeyDown = false,
    fullScreen = false,
    fullWidth = false,
    maxWidth = 'sm',
    onBackdropClick,
    onClose,
    open,
    PaperComponent = Paper,
    scroll = 'paper',
    slotProps = {},
    TransitionComponent = Fade,
    transitionDuration = defaultTransitionDuration,
    TransitionProps,
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = {
    ...props,
    cssStyles,
    disableEscapeKeyDown,
    fullScreen,
    fullWidth,
    maxWidth,
    scroll
  };

  const classes = {
    root: [dialogClasses.root],
    container: [dialogClasses.container, `scroll${capitalize(scroll)}`],
    paper: [
      dialogClasses.paper,
      `paperScroll${capitalize(scroll)}`,
      `paperWidth${capitalize(String(maxWidth))}`,
      ownerState.fullWidth && dialogClasses.fullWidth,
      ownerState.fullScreen && dialogClasses.fullScreen
    ]
  };

  const backdropClick = React.useRef();
  const handleMouseDown = (event) => {
    backdropClick.current = event.target === event.currentTarget;
  };
  const handleBackdropClick = (event) => {
    if (!backdropClick.current) {
      return;
    }

    backdropClick.current = null;

    if (onBackdropClick) {
      onBackdropClick(event);
    }

    if (onClose) {
      onClose(event, 'backdropClick');
    }
  };

  const ariaLabelledby = useId(ariaLabelledbyProp);
  const dialogContextValue = React.useMemo(() => {
    return { titleId: ariaLabelledby };
  }, [ariaLabelledby]);

  return (
    <DialogRoot
      className={clsx(classes.root, className)}
      closeAfterTransition
      slots={{ backdrop: DialogBackdrop }}
      slotProps={{
        backdrop: {
          transitionDuration,
          as: BackdropComponent,
          ...slotProps.backdrop
        }
      }}
      disableEscapeKeyDown={disableEscapeKeyDown}
      onClose={onClose}
      open={open}
      ref={ref}
      onClick={handleBackdropClick}
      ownerState={ownerState}
      {...other}
    >
      <TransitionComponent
        appear
        in={open}
        timeout={transitionDuration}
        role='presentation'
        {...TransitionProps}
      >
        <DialogContainer
          className={clsx(classes.container)}
          onMouseDown={handleMouseDown}
          ownerState={ownerState}
        >
          <DialogPaper
            as={PaperComponent}
            elevation={24}
            role='dialog'
            aria-describedby={ariaDescribedby}
            aria-labelledby={ariaLabelledby}
            {...slotProps.paper}
            className={clsx(classes.paper, slotProps.paper?.className)}
            ownerState={ownerState}
          >
            <DialogContext.Provider value={dialogContextValue}>{children}</DialogContext.Provider>
          </DialogPaper>
        </DialogContainer>
      </TransitionComponent>
    </DialogRoot>
  );
});

Dialog.displayName = 'Dialog';

export default Dialog;
