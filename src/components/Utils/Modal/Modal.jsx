import React from 'react';
import clsx from 'clsx';
import ModalBase from './ModalBase';
import { resolveComponentProps } from '@components/lib';
import styled from '@styles';
import { Backdrop } from '@components/feedback';

const ModalRoot = styled('div')(({ theme, ownerState }) => ({
  position: 'fixed',
  zIndex: theme.zIndex.modal,
  right: 0,
  bottom: 0,
  top: 0,
  left: 0,
  ...(!ownerState.open &&
    ownerState.exited && {
      visibility: 'hidden'
    })
}));

const ModalBackdrop = styled(Backdrop)({
  zIndex: -1
});

const Modal = React.forwardRef((props, ref) => {
  const {
    BackdropComponent = ModalBackdrop,
    BackdropProps,
    classes,
    className,
    closeAfterTransition = false,
    children,
    container,
    component,
    disableAutoFocus = false,
    disableEnforceFocus = false,
    disableEscapeKeyDown = false,
    disablePortal = false,
    disableRestoreFocus = false,
    disableScrollLock = false,
    hideBackdrop = false,
    keepMounted = false,
    onBackdropClick,
    onClose,
    open,
    slotProps,
    slots,
    theme,
    ...other
  } = props;

  const [exited, setExited] = React.useState(true);

  const commonProps = {
    container,
    closeAfterTransition,
    disableAutoFocus,
    disableEnforceFocus,
    disableEscapeKeyDown,
    disablePortal,
    disableRestoreFocus,
    disableScrollLock,
    hideBackdrop,
    keepMounted,
    onBackdropClick,
    onClose,
    open
  };

  const ownerState = {
    ...props,
    ...commonProps,
    exited
  };

  const RootSlot = slots?.root ?? ModalRoot;
  const BackdropSlot = slots?.backdrop ?? BackdropComponent;

  return (
    <ModalBase
      slots={{
        root: RootSlot,
        backdrop: BackdropSlot
      }}
      slotProps={{
        root: () => ({
          ...resolveComponentProps(slotProps?.root, ownerState),
          ...(!(typeof RootSlot === 'string') && { as: component, theme }),
          className: clsx(
            'Modal-Root',
            className,
            slotProps?.root?.className,
            classes?.root,
            !ownerState.open && ownerState.exited && classes?.hidden
          )
        }),
        backdrop: () => ({
          ...BackdropProps,
          ...resolveComponentProps(slotProps?.backdrop, ownerState),
          className: clsx(
            'Modal-Backdrop',
            slotProps?.backdrop?.className,
            BackdropProps?.className,
            classes?.backdrop
          )
        })
      }}
      onTransitionEnter={() => setExited(false)}
      onTransitionExited={() => setExited(true)}
      ref={ref}
      {...other}
      {...commonProps}
    >
      {children}
    </ModalBase>
  );
});

Modal.displayName = 'Modal';

export default Modal;
