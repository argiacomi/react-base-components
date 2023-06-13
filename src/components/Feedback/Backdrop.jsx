import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@styles';
import { Fade } from '@components/utils';

const BackdropRoot = styled('div')(({ ownerState }) => ({
  position: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  right: 0,
  bottom: 0,
  top: 0,
  left: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  WebkitTapHighlightColor: 'transparent',
  ...(ownerState.invisible && {
    backgroundColor: 'transparent'
  })
}));

const Backdrop = React.forwardRef((props, ref) => {
  const {
    children,
    className,
    component = 'div',
    invisible = false,
    open,
    slotProps = {},
    slots = {},
    TransitionComponent = Fade,
    transitionDuration,
    ...other
  } = props;

  const ownerState = {
    ...props,
    component,
    invisible
  };

  return (
    <TransitionComponent in={open} timeout={transitionDuration} {...other}>
      <BackdropRoot
        aria-hidden
        {...slotProps.root}
        as={slots.root ?? component}
        className={clsx('Backdrop-Root', className, slotProps.root?.className)}
        ownerState={{ ...ownerState, ...slotProps?.ownerState }}
        ref={ref}
      >
        {children}
      </BackdropRoot>
    </TransitionComponent>
  );
});

Backdrop.displayName = 'Backdrop';

export default Backdrop;
