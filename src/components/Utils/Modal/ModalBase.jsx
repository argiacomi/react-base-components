import React from 'react';
import {
  createChainedFunction,
  ownerDocument,
  useEventCallback,
  useForkRef,
  useSlotProps
} from '@components/lib';
import FocusTrap from '../FocusTrap';
import Portal from '../Portal';
import ModalManager, { ariaHidden } from './ModalManager';

export const modalBaseClasses = {
  root: 'Modal-Root',
  hidden: 'Hidden',
  backdrop: 'Modal-Backdrop'
};

function getContainer(container) {
  return typeof container === 'function' ? container() : container;
}

function getHasTransition(children) {
  return children ? Object.prototype.hasOwnProperty.call(children, 'in') : false;
}

const defaultManager = new ModalManager();

const Modal = React.forwardRef((props, ref) => {
  const {
    children,
    closeAfterTransition = false,
    container,
    disableAutoFocus = false,
    disableEnforceFocus = false,
    disableEscapeKeyDown = false,
    disablePortal = false,
    disableRestoreFocus = false,
    disableScrollLock = false,
    hideBackdrop = false,
    keepMounted = false,
    manager: managerProp = defaultManager,
    onBackdropClick,
    onClose,
    onKeyDown,
    open,
    onTransitionEnter,
    onTransitionExited,
    slotProps = {},
    slots = {},
    ...other
  } = props;

  const manager = managerProp;
  const [exited, setExited] = React.useState(!open);
  const modal = React.useRef({});
  const mountNodeRef = React.useRef(null);
  const modalRef = React.useRef(null);
  const handleRef = useForkRef(modalRef, ref);
  const hasTransition = getHasTransition(children);

  const ariaHiddenProp = props['aria-hidden'] ?? true;

  const getDoc = () => ownerDocument(mountNodeRef.current);
  const getModal = () => {
    modal.current.modalRef = modalRef.current;
    modal.current.mountNode = mountNodeRef.current;
    return modal.current;
  };

  const handleMounted = () => {
    manager.mount(getModal(), { disableScrollLock });

    if (modalRef.current) {
      modalRef.current.scrollTop = 0;
    }
  };

  const handleOpen = useEventCallback(() => {
    const resolvedContainer = getContainer(container) || getDoc().body;

    manager.add(getModal(), resolvedContainer);

    if (modalRef.current) {
      handleMounted();
    }
  });

  const isTopModal = React.useCallback(() => manager.isTopModal(getModal()), [manager]);

  const handlePortalRef = useEventCallback((node) => {
    mountNodeRef.current = node;

    if (!node || !modalRef.current) {
      return;
    }

    if (open && isTopModal()) {
      handleMounted();
    } else {
      ariaHidden(modalRef.current, ariaHiddenProp);
    }
  });

  const handleClose = React.useCallback(() => {
    manager.remove(getModal(), ariaHiddenProp);
  }, [manager, ariaHiddenProp]);

  React.useEffect(() => {
    return () => {
      handleClose();
    };
  }, [handleClose]);

  React.useEffect(() => {
    if (open) {
      handleOpen();
    } else if (!hasTransition || !closeAfterTransition) {
      handleClose();
    }
  }, [open, handleClose, hasTransition, closeAfterTransition, handleOpen]);

  const ownerState = {
    ...props,
    closeAfterTransition,
    disableAutoFocus,
    disableEnforceFocus,
    disableEscapeKeyDown,
    disablePortal,
    disableRestoreFocus,
    disableScrollLock,
    exited,
    hideBackdrop,
    keepMounted
  };

  const classes = {
    root: [modalBaseClasses.root, !open && exited && modalBaseClasses.hidden],
    backdrop: modalBaseClasses.backdrop
  };

  const handleEnter = () => {
    setExited(false);

    if (onTransitionEnter) {
      onTransitionEnter();
    }
  };

  const handleExited = () => {
    setExited(true);

    if (onTransitionExited) {
      onTransitionExited();
    }

    if (closeAfterTransition) {
      handleClose();
    }
  };

  const handleBackdropClick = (event) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (onBackdropClick) {
      onBackdropClick(event);
    }

    if (onClose) {
      onClose(event, 'backdropClick');
    }
  };

  const handleKeyDown = (event) => {
    if (onKeyDown) {
      onKeyDown(event);
    }

    if (event.key !== 'Escape' || !isTopModal()) {
      return;
    }

    if (!disableEscapeKeyDown) {
      event.stopPropagation();

      if (onClose) {
        onClose(event, 'escapeKeyDown');
      }
    }
  };

  const childProps = {};
  if (children.props.tabIndex === undefined) {
    childProps.tabIndex = '-1';
  }

  if (hasTransition) {
    childProps.onEnter = createChainedFunction([handleEnter, children.props.onEnter]);
    childProps.onExited = createChainedFunction([handleExited, children.props.onExited]);
  }

  const Root = slots.root ?? 'div';
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: handleRef,
      role: 'presentation',
      onKeyDown: handleKeyDown
    },
    className: classes.root,
    ownerState
  });

  const BackdropComponent = slots.backdrop;
  const backdropProps = useSlotProps({
    elementType: BackdropComponent,
    externalSlotProps: slotProps.backdrop,
    additionalProps: {
      'aria-hidden': true,
      onClick: handleBackdropClick,
      open
    },
    className: classes.backdrop,
    ownerState
  });

  if (!keepMounted && !open && (!hasTransition || exited)) {
    return null;
  }

  return (
    <Portal ref={handlePortalRef} container={container} disablePortal={disablePortal}>
      <Root {...rootProps}>
        {!hideBackdrop && BackdropComponent ? <BackdropComponent {...backdropProps} /> : null}
        <FocusTrap
          disableEnforceFocus={disableEnforceFocus}
          disableAutoFocus={disableAutoFocus}
          disableRestoreFocus={disableRestoreFocus}
          isEnabled={isTopModal}
          open={open}
        >
          {React.cloneElement(children, childProps)}
        </FocusTrap>
      </Root>
    </Portal>
  );
});

Modal.displayName = 'Modal';

export default Modal;
