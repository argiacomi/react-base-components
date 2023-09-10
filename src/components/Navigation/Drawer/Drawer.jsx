import React from 'react';
import clsx from 'clsx';
import styled, { useTheme } from '@styles';
import Paper from '@components/surfaces/paper';
import Modal from '@components/utils/modal';
import Slide from '@components/utils/transitions/Slide';

export const drawerClasses = {
  root: 'Drawer-Root',
  docked: 'Drawer-Docked',
  paper: 'Drawer-Paper',
  modal: 'Drawer-Modal'
};

const DrawerRoot = styled(Modal)(({ theme }) => ({
  zIndex: theme.zIndex.drawer
}));

const DrawerDockedRoot = styled('div')({
  flex: '0 0 auto'
});

const DrawerPaper = styled(Paper)(({ theme, ownerState }) => ({
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  flex: '1 0 auto',
  zIndex: theme.zIndex.drawer,
  WebkitOverflowScrolling: 'touch',
  position: 'fixed',
  top: 0,
  outline: 0,
  ...{
    top: { top: 0, left: 0, right: 0, bottom: 'auto', height: 'auto', maxHeight: '100%' },
    left: { left: 0 },
    bottom: {
      top: 'auto',
      left: 0,
      right: 0,
      bottom: 0,
      height: 'auto',
      maxHeight: '100%'
    },
    right: { right: 0 }
  }[ownerState.anchor],
  borderRight: ownerState.variant !== 'temporary' && `1px solid ${theme.color.divider}`,
  ...(ownerState.variant !== 'temporary' &&
    {
      top: { borderBottom: `1px solid ${theme.color.divider}` },
      left: { borderRight: `1px solid ${theme.color.divider}` },
      bottom: { borderTop: `1px solid ${theme.color.divider}` },
      right: { borderLeft: `1px solid ${theme.color.divider}` }
    }[ownerState.anchor])
}));

const oppositeDirection = {
  left: 'right',
  right: 'left',
  top: 'down',
  bottom: 'up'
};

export function isHorizontal(anchor) {
  return ['left', 'right'].indexOf(anchor) !== -1;
}

export function getAnchor(theme, anchor) {
  return theme.direction === 'rtl' && isHorizontal(anchor) ? oppositeDirection[anchor] : anchor;
}

const Drawer = React.forwardRef((props, ref) => {
  const theme = useTheme();
  const defaultTransitionDuration = {
    enter: theme.transition.duration.enteringScreen,
    exit: theme.transition.duration.leavingScreen
  };

  const {
    anchor: anchorProp = 'left',
    BackdropProps,
    children,
    className,
    elevation = 16,
    hideBackdrop = false,
    ModalProps: { BackdropProps: BackdropPropsProp, ...ModalProps } = {},
    onClose,
    open = false,
    slotProps = {},
    SlideProps,
    TransitionComponent = Slide,
    transitionDuration = defaultTransitionDuration,
    variant = 'temporary',
    ...other
  } = props;

  const mounted = React.useRef(false);
  React.useEffect(() => {
    mounted.current = true;
  }, []);

  const anchorInvariant = getAnchor(theme, anchorProp);
  const anchor = anchorProp;

  const ownerState = {
    ...props,
    anchor,
    elevation,
    open,
    variant,
    ...other
  };

  const drawer = (
    <DrawerPaper
      elevation={variant === 'temporary' ? elevation : 0}
      square
      {...slotProps.paper}
      className={clsx(drawerClasses.paper, slotProps.paper?.className)}
      ownerState={ownerState}
    >
      {children}
    </DrawerPaper>
  );

  if (variant === 'permanent') {
    return (
      <DrawerDockedRoot
        className={clsx(drawerClasses.root, drawerClasses.docked, className)}
        ownerState={ownerState}
        ref={ref}
        {...other}
      >
        {drawer}
      </DrawerDockedRoot>
    );
  }

  const slidingDrawer = (
    <TransitionComponent
      in={open}
      direction={oppositeDirection[anchorInvariant]}
      timeout={transitionDuration}
      appear={mounted.current}
      {...SlideProps}
    >
      {drawer}
    </TransitionComponent>
  );

  if (variant === 'persistent') {
    return (
      <DrawerDockedRoot
        className={clsx(drawerClasses.root, drawerClasses.docked, className)}
        ownerState={ownerState}
        ref={ref}
        {...other}
      >
        {slidingDrawer}
      </DrawerDockedRoot>
    );
  }

  return (
    <DrawerRoot
      BackdropProps={{
        ...BackdropProps,
        ...BackdropPropsProp,
        transitionDuration
      }}
      className={clsx(drawerClasses.root, drawerClasses.modal, className)}
      open={open}
      ownerState={ownerState}
      onClose={onClose}
      hideBackdrop={hideBackdrop}
      ref={ref}
      {...other}
      {...ModalProps}
    >
      {slidingDrawer}
    </DrawerRoot>
  );
});

Drawer.displayName = 'Drawer';

export default Drawer;
