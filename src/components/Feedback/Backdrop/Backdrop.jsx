import React from 'react';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';
import Fade from '@components/utils/transitions/Fade';

export const backdropClasses = { root: 'Backdrop-Root', invisible: 'Invisible' };

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
  }),
  ...ownerState.cssStyles
}));

const Backdrop = React.forwardRef((props, ref) => {
  const {
    children,
    component: componentProp = 'div',
    invisible = false,
    open,
    slots = {},
    slotProps = {},
    TransitionComponent = Fade,
    transitionDuration,
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = {
    ...props,
    cssStyles,
    invisible
  };

  const classes = {
    root: [backdropClasses.root, ownerState.invisible && backdropClasses.invisible]
  };

  const component = componentProp || 'div';
  const BackdropComponent = slots.root || BackdropRoot;

  const backdropRootProps = useSlotProps({
    elementType: BackdropComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: ref
    },
    ownerState,
    className: classes.root
  });

  return (
    <TransitionComponent in={open} timeout={transitionDuration} {...other}>
      <BackdropRoot aria-hidden as={component} {...backdropRootProps}>
        {children}
      </BackdropRoot>
    </TransitionComponent>
  );
});

Backdrop.displayName = 'Backdrop';

export default Backdrop;
