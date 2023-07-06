import React from 'react';
import styled, { extractStyling } from '@styles';
import { usePreviousProps, useSlotProps } from '@components/lib';
import useBadge from './useBadge';

const RADIUS_STANDARD = 0.625;
const RADIUS_DOT = 0.375;

export const badgeClasses = {
  root: 'Badge-Root',
  badge: 'Badge-Badge',
  invisible: 'Invisible'
};

const BadgeRoot = styled('span')(({ ownerState }) => ({
  position: 'relative',
  display: 'inline-flex',
  verticalAlign: 'middle',
  flexShrink: 0,
  ...ownerState.cssStyles
}));

const baseStyles = (theme) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  boxSizing: 'border-box',
  fontWeight: theme.text.typography.fontWeightMedium,
  fontSize: theme.spacing(1.5),
  lineHeight: 1,
  zIndex: 1,
  transition: theme.transition.create('transform', {
    easing: theme.transition.easing.easeInOut,
    duration: theme.transition.duration.enteringScreen
  })
});

const colorStyles = (theme, ownerState) => ({
  backgroundColor: theme.color[ownerState.color].body || 'transparent',
  color: theme.color[ownerState.color].text
});

const variantStyles = (theme, ownerState) =>
  ({
    standard: {
      borderRadius: `${RADIUS_STANDARD}rem`,
      height: `${RADIUS_STANDARD * 2}rem`,
      minWidth: `${RADIUS_STANDARD * 2}rem`,
      padding: theme.spacing(0, 0.75)
    },
    dot: {
      borderRadius: `${RADIUS_DOT}rem`,
      height: `${RADIUS_DOT * 2}rem`,
      minWidth: `${RADIUS_DOT * 2}rem`,
      padding: 0
    }
  }[ownerState.variant]);

const positionStyles = (ownerState) => {
  const positionMap = {
    topRight: {
      vertical: 'top',
      horizontal: 'right',
      rectangular: 0,
      circular: '14%',
      transform: 'translate(50%, -50%)',
      origin: '100% 0%'
    },
    topLeft: {
      vertical: 'top',
      horizontal: 'left',
      rectangular: 0,
      circular: '14%',
      transform: 'translate(-50%, -50%)',
      origin: '0% 0%'
    },
    bottomRight: {
      vertical: 'bottom',
      horizontal: 'right',
      rectangular: 0,
      circular: '14%',
      transform: 'translate(50%, 50%)',
      origin: '100% 100%'
    },
    bottomLeft: {
      vertical: 'bottom',
      horizontal: 'left',
      rectangular: 0,
      circular: '14%',
      transform: 'translate(-50%, 50%)',
      origin: '0% 100%'
    }
  };

  return Object.values(positionMap)
    .filter(
      (value) =>
        ownerState.anchorOrigin.vertical === value.vertical &&
        ownerState.anchorOrigin.horizontal === value.horizontal
    )
    .reduce((styles, value) => {
      styles[value.vertical] =
        ownerState.overlap === 'rectangular' ? value.rectangular : value.circular;
      styles[value.horizontal] =
        ownerState.overlap === 'rectangular' ? value.rectangular : value.circular;
      styles.transform = `scale(1) ${value.transform}`;
      styles.transformOrigin = `${value.origin}`;
      styles[`&.${badgeClasses.invisible}`] = {
        transform: `scale(0) ${value.transform}`
      };
      return styles;
    }, {});
};

const invisibleStyles = (theme, ownerState) =>
  ownerState.invisible && {
    transition: theme.transition.create('transform', {
      easing: theme.transition.easing.easeInOut,
      duration: theme.transition.duration.leavingScreen
    })
  };

const BadgeBadge = styled('span')(({ theme, ownerState }) => ({
  ...baseStyles(theme),
  ...colorStyles(theme, ownerState),
  ...variantStyles(theme, ownerState),
  ...positionStyles(ownerState),
  ...invisibleStyles(theme, ownerState)
}));

const Badge = React.forwardRef((props, ref) => {
  const {
    anchorOrigin: anchorOriginProp = {
      vertical: 'top',
      horizontal: 'right'
    },
    component,
    children,
    overlap: overlapProp = 'rectangular',
    color: colorProp = 'default',
    invisible: invisibleProp = false,
    max: maxProp = 99,
    badgeContent: badgeContentProp,
    slots = {},
    slotProps = {},
    showZero = false,
    variant: variantProp = 'standard',
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const {
    badgeContent,
    invisible: invisibleFromHook,
    max,
    displayValue: displayValueFromHook
  } = useBadge({
    max: maxProp,
    invisible: invisibleProp,
    badgeContent: badgeContentProp,
    showZero
  });

  const prevProps = usePreviousProps({
    anchorOrigin: anchorOriginProp,
    color: colorProp,
    overlap: overlapProp,
    variant: variantProp,
    badgeContent: badgeContentProp
  });

  const invisible = invisibleFromHook || (badgeContent == null && variantProp !== 'dot');

  const {
    color = colorProp,
    overlap = overlapProp,
    anchorOrigin = anchorOriginProp,
    variant = variantProp
  } = invisible ? prevProps : props;

  const displayValue = variant !== 'dot' ? displayValueFromHook : undefined;

  const ownerState = {
    ...props,
    badgeContent,
    cssStyles,
    invisible,
    max,
    displayValue,
    showZero,
    anchorOrigin,
    color,
    overlap,
    variant
  };

  const classes = {
    root: badgeClasses.root,
    badge: [badgeClasses.badge, ownerState.invisible && badgeClasses.invisible]
  };

  // support both `slots`for backward compatibility
  const RootSlot = slots?.root ?? BadgeRoot;
  const BadgeSlot = slots?.badge ?? BadgeBadge;

  const rootProps = useSlotProps({
    elementType: RootSlot,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: ref
    },
    ownerState,
    className: classes.root
  });

  const badgeProps = useSlotProps({
    elementType: BadgeSlot,
    externalSlotProps: slotProps.badge,
    ownerState,
    className: classes.badge
  });

  return (
    <RootSlot as={component} {...rootProps}>
      {children}
      <BadgeSlot {...badgeProps}>{displayValue}</BadgeSlot>
    </RootSlot>
  );
});
Badge.displayName = 'Badge';

export default Badge;
