import React from 'react';
import { isFragment } from 'react-is';
import clsx from 'clsx';
import { styled } from '@styles';
import Avatar, { avatarClasses } from './Avatar';

const SPACINGS = {
  small: '-1rem',
  medium: null
};

const AvatarGroupRoot = styled('div')(({ theme }) => ({
  [`& .${avatarClasses.root}`]: {
    border: `2px solid ${theme.color.background}`,
    boxSizing: 'content-box',
    marginLeft: -8,
    '&:last-child': {
      marginLeft: 0
    }
  },
  display: 'flex',
  flexDirection: 'row-reverse'
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
    className,
    component = 'div',
    max = 5,
    slotProps = {},
    spacing = 'medium',
    total,
    variant = 'circular',
    ...other
  } = props;

  let clampedMax = max < 2 ? 2 : max;

  const ownerState = {
    ...props,
    max,
    spacing,
    component,
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

  return (
    <AvatarGroupRoot
      as={component}
      ownerState={ownerState}
      className={clsx('AvatarGroup-Root', className)}
      ref={ref}
      {...other}
    >
      {extraAvatars ? (
        <AvatarGroupAvatar
          ownerState={ownerState}
          variant={variant}
          {...additionalAvatarSlotProps}
          className={clsx('AvatarGroup-Avatar', additionalAvatarSlotProps?.className)}
          style={{ marginLeft, ...additionalAvatarSlotProps?.style }}
        >
          +{extraAvatars}
        </AvatarGroupAvatar>
      ) : null}
      {children
        .slice(0, maxAvatars)
        .reverse()
        .map((child, index) => {
          return React.cloneElement(child, {
            className: clsx(child.props.className, 'AvatarGroup-Avatar'),
            style: {
              marginLeft: index === maxAvatars - 1 ? undefined : marginLeft,
              ...child.props.style
            },
            variant: child.props.variant || variant
          });
        })}
    </AvatarGroupRoot>
  );
});

AvatarGroup.displayName = 'AvatarGroup';

export default AvatarGroup;
