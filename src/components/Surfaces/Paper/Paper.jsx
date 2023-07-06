import React from 'react';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';

export const paperClasses = {
  root: 'Paper-Root',
  rounded: 'Rounded'
};

const PaperRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: theme.color.background,
  '&:before': { backgroundColor: theme.color.background },
  color: theme.color.text.primary,
  transition: theme.transition.create('filter'),
  ...(!ownerState.square && {
    borderRadius: theme.rounded.md
  }),
  ...(ownerState.outlined && {
    border: `1px solid ${theme.color.divider}`,
    filter: 'none',
    boxShadow: 'none'
  }),
  ...(!ownerState.outlined && {
    boxShadow: ownerState.elevation > 3 ? theme.boxShadow[ownerState.elevation] : null,
    filter: ownerState.elevation <= 3 ? theme.dropShadow[ownerState.elevation] : null,
    ...(theme.color.mode === 'dark' && {
      backgroundImage: `linear-gradient(${theme.alpha.add(
        theme.color.white,
        theme.alpha.overlay([ownerState.elevation])
      )},${theme.alpha.add(theme.color.white, theme.alpha.overlay(ownerState.elevation))})`
    })
  }),
  ...ownerState.cssStyles
}));

const Paper = React.forwardRef((props, ref) => {
  const {
    children,
    component = 'div',
    elevation = 3,
    slots = {},
    slotProps = {},
    square = false,
    outlined = false,
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = { ...props, cssStyles, elevation, square, outlined };

  const classes = {
    root: [paperClasses.root, !ownerState.square && paperClasses.rounded]
  };

  const PaperComponent = slots.root || PaperRoot;
  const paperRootProps = useSlotProps({
    elementType: PaperComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: ref
    },
    ownerState,
    className: classes.root
  });

  return (
    <PaperComponent as={component} {...paperRootProps}>
      {children}
    </PaperComponent>
  );
});

Paper.displayName = 'Paper';

export default Paper;
