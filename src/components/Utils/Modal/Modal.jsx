import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling } from '@styles';
import { isHostComponent, resolveComponentProps } from '@components/lib';
import Backdrop from '@components/feedback/backdrop';
import ModalBase, { modalBaseClasses } from './ModalBase';

export const modalClasses = modalBaseClasses;

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
    }),
  ...ownerState.cssStyles
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
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

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
    cssStyles,
    exited
  };

  const RootSlot = slots?.root ?? ModalRoot;
  const BackdropSlot = slots?.backdrop ?? BackdropComponent;

  const rootSlotProps = slotProps?.root;
  const backdropSlotProps = slotProps?.backdrop;

  return (
    <ModalBase
      slots={{
        root: RootSlot,
        backdrop: BackdropSlot
      }}
      slotProps={{
        root: () => ({
          ...resolveComponentProps(rootSlotProps, ownerState),
          ...(!isHostComponent(RootSlot) && { as: component, theme }),
          className: clsx(
            className,
            rootSlotProps?.className,
            classes?.root,
            !ownerState.open && ownerState.exited && classes?.hidden
          )
        }),
        backdrop: () => ({
          ...BackdropProps,
          ...resolveComponentProps(backdropSlotProps, ownerState),
          className: clsx(backdropSlotProps?.className, BackdropProps?.className, classes?.backdrop)
        })
      }}
      onTransitionEnter={() => setExited(false)}
      onTransitionExited={() => setExited(true)}
      ref={ref}
      {...other}
      {...commonProps}
      css={cssStyles}
    >
      {children}
    </ModalBase>
  );
});

Modal.displayName = 'Modal';

export default Modal;
