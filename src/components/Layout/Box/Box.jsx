import React from 'react';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';

export const boxClasses = {
  root: 'Box-Root'
};

const BoxRoot = styled('div')(({ ownerState }) => ({ ...ownerState.cssStyles }));

const Box = React.forwardRef((props, ref) => {
  const { component: componentProp, slots = {}, slotProps = {}, ...otherProps } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = { ...props, cssStyles };

  const component = componentProp || 'div';
  const BoxComponent = slots.root || BoxRoot;

  const boxRootProps = useSlotProps({
    elementType: BoxComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: ref
    },
    ownerState,
    className: boxClasses.root
  });

  return <BoxComponent as={component} {...boxRootProps} />;
});

Box.displayName = 'Box';

export default Box;
