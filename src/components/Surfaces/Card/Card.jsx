import React from 'react';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';
import Paper from '../paper';

export const cardClasses = { root: 'Card-Root' };

const CardRoot = styled(Paper)(({ ownerState }) => ({
  overflow: 'hidden',
  ...ownerState.cssStyles
}));

const Card = React.forwardRef((props, ref) => {
  const { component, raised = false, slots = {}, slotProps = {}, ...otherProps } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = { ...props, cssStyles, raised };

  const CardComponent = slots.root || CardRoot;
  const cardRootProps = useSlotProps({
    elementType: CardComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      component,
      elevation: raised ? 8 : undefined,
      ref: ref
    },
    ownerState,
    className: cardClasses.root
  });

  return <CardComponent {...cardRootProps} />;
});

Card.displayName = 'Card';

export default Card;
