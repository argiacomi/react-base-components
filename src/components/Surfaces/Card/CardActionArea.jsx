import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';
import { ButtonBase } from '@components/inputs';

export const cardActionAreaClasses = {
  root: 'CardActionArea-Root',
  focusVisible: 'FocusVisible',
  focusHighlight: 'FocusHighlight'
};

const CardActionAreaRoot = styled(ButtonBase)(({ ownerState }) => ({
  display: 'block',
  textAlign: 'inherit',
  borderRadius: 'inherit',
  width: '100%',
  [`&:hover .${cardActionAreaClasses.focusHighlight}`]: {
    opacity: 0.04,
    '@media (hover: none)': {
      opacity: 0
    }
  },
  [`&.${cardActionAreaClasses.focusVisible} .${cardActionAreaClasses.focusHighlight}`]: {
    opacity: 0.12
  },
  ...ownerState.cssStyles
}));

const CardActionAreaFocusHighlight = styled('span')(({ theme, ownerState }) => ({
  overflow: 'hidden',
  pointerEvents: 'none',
  position: 'absolute',
  inset: 0,
  borderRadius: 'inherit',
  opacity: 0,
  backgroundColor: 'currentcolor',
  transition: theme.transition.create('opacity', {
    duration: theme.transition.duration.short
  })
}));

const CardActionArea = React.forwardRef((props, ref) => {
  const {
    children,
    component,
    focusVisibleClassName,
    slots = {},
    slotProps = {},
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = { ...props, cssStyles };

  const CardActionAreaComponent = slots.root || CardActionAreaRoot;
  const cardActionAreaRootProps = useSlotProps({
    elementType: CardActionAreaComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      component,
      focusVisibleClassName: clsx(focusVisibleClassName, cardActionAreaClasses.focusVisible),
      ref: ref
    },
    ownerState,
    className: cardActionAreaClasses.root
  });

  return (
    <CardActionAreaComponent {...cardActionAreaRootProps}>
      {children}
      <CardActionAreaFocusHighlight
        className={cardActionAreaClasses.focusHighlight}
        ownerState={ownerState}
      />
    </CardActionAreaComponent>
  );
});

CardActionArea.displayName = 'CardActionArea';

export default CardActionArea;
