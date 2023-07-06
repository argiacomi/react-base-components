import React from 'react';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';
import { Paper } from '@components/surfaces';
import PopperArrow from './PopperArrow';

const PopperContentRoot = styled(Paper)(({ theme, ownerState }) => ({
  position: ownerState.position,
  display: 'inline-block',
  backgroundColor: theme.color.background,
  ['--popper-arrow-bg']: theme.color.background,
  ['--popper-arrow-border-color']: ownerState.outlined ? `${theme.color.divider}` : 'transparent',
  backgroundClip: 'padding-box',
  ...ownerState.cssStyles
}));

const PopperContent = React.forwardRef((props, ref) => {
  const {
    children,
    disableArrow = false,
    elevation = 3,
    slots = {},
    slotProps = {},
    outlined = false,
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = { ...props, cssStyles, elevation, outlined };

  const PopperContentComponent = slots.root || PopperContentRoot;
  const popperContentProps = useSlotProps({
    elementType: PopperContentComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      elevation,
      outlined: outlined,
      ref: ref
    },
    ownerState,
    className: 'PopperContent-Root'
  });

  return (
    <PopperContentComponent {...popperContentProps}>
      {!disableArrow && (
        <PopperArrow
          disableArrow={disableArrow}
          elevation={elevation}
          outlined={outlined}
          {...slotProps.arrow}
        />
      )}
      {children}
    </PopperContentComponent>
  );
});

PopperContent.displayName = 'PopperContent';

export default PopperContent;
