import React from 'react';
import { isFragment } from 'react-is';
import clsx from 'clsx';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';
import Avatar, { avatarClasses } from './Avatar';

export const avatarGroupClasses = {
  root: 'AvatarGroup-Root',
  avatar: 'AvatarGroup-Avatar'
};

const SPACINGS = {
  small: '-1rem',
  medium: null
};

const AvatarGroupRoot = styled('div')(({ theme, ownerState }) => ({
  [`& .${avatarClasses.root}`]: {
    border: `2px solid ${theme.color.background}`,
    boxSizing: 'content-box',
    marginLeft: -8,
    '&:last-child': {
      marginLeft: 0
    }
  },
  display: 'flex',
  flexDirection: 'row-reverse',
  ...ownerState.cssStyles
}));

const AvatarGroupAvatar = styled(Avatar)(({ theme }) => ({
  border: `2px solid ${theme.color.background}`,
  boxSizing: 'content-box',
  marginLeft: -8,
  '&:last-child': {
    marginLeft: 0
  }
}));

const AvatarGroup = React.forwardRef(function AvatarGroup(props, ref) {
  const {
    children: childrenProp,
    component: componentProp = 'div',
    max = 5,
    slots = {},
    slotProps = {},
    spacing = 'medium',
    total,
    variant = 'circular',
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  let clampedMax = max < 2 ? 2 : max;

  const ownerState = {
    ...props,
    cssStyles,
    max,
    spacing,
    variant
  };

  const children = React.Children.toArray(childrenProp).filter((child) => {
    if (!import.meta.env.PROD) {
      if (isFragment(child)) {
        console.error(
          [
            "The AvatarGroup component doesn't accept a Fragment as a child.",
            'Consider providing an array instead.'
          ].join('\n')
        );
      }
    }

    return React.isValidElement(child);
  });

  const totalAvatars = total || children.length;

  if (totalAvatars === clampedMax) {
    clampedMax += 1;
  }

  clampedMax = Math.min(totalAvatars + 1, clampedMax);

  const maxAvatars = Math.min(children.length, clampedMax - 1);
  const extraAvatars = Math.max(totalAvatars - clampedMax, totalAvatars - maxAvatars, 0);

  const marginLeft = spacing && SPACINGS[spacing] !== undefined ? SPACINGS[spacing] : -spacing;

  const additionalAvatarSlotProps = slotProps?.additionalAvatar;

  const AvatarGroupComponent = slots.root || AvatarGroupRoot;
  const component = componentProp || 'div';

  const avatarGroupRootProps = useSlotProps({
    elementType: AvatarGroupComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: ref
    },
    ownerState,
    className: avatarGroupClasses.root
  });

  const AvatarComponent = slots.avatar || AvatarGroupAvatar;

  const avatarProps = useSlotProps({
    elementType: AvatarComponent,
    externalSlotProps: slotProps.avatar,
    additionalProps: {
      ...additionalAvatarSlotProps,
      style: marginLeft,
      variant
    },
    ownerState,
    className: avatarGroupClasses.avatar
  });

  return (
    <AvatarGroupComponent as={component} {...avatarGroupRootProps}>
      {extraAvatars ? (
        <AvatarGroupAvatar {...avatarProps}>+{extraAvatars}</AvatarGroupAvatar>
      ) : null}
      {children
        .slice(0, maxAvatars)
        .reverse()
        .map((child, index) => {
          return React.cloneElement(child, {
            className: clsx(child.props.className, avatarGroupClasses.avatar),
            style: {
              marginLeft: index === maxAvatars - 1 ? undefined : marginLeft,
              ...child.props.style
            },
            variant: child.props.variant || variant
          });
        })}
    </AvatarGroupComponent>
  );
});

AvatarGroup.displayName = 'AvatarGroup';

export default AvatarGroup;
