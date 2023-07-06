import React from 'react';
import styled, { extractStyling } from '@styles';
import { useLoaded, useSlotProps } from '@components/lib';
import Person from '@icons/Person';

export const avatarClasses = {
  root: 'Avatar-Root',
  fallback: 'Avatar-Fallback',
  img: 'Avatar-Img',
  colorDefault: 'ColorDefault'
};

const AvatarRoot = styled('div', {
  name: 'Avatar',
  slot: 'Root'
})(({ theme, ownerState }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: 40,
  height: 40,
  fontFamily: 'inherit',
  fontSize: theme.spacing(2.5),
  lineHeight: 1,
  borderRadius: theme.rounded.full,
  overflow: 'hidden',
  userSelect: 'none',
  ...(ownerState.variant === 'rounded' && {
    borderRadius: theme.rounded.md
  }),
  ...(ownerState.variant === 'square' && {
    borderRadius: 0
  }),
  ...(ownerState.colorDefault && {
    color: theme.color.background,
    backgroundColor: theme.color.monochrome[200]
  }),
  ...ownerState.cssStyles
}));

const AvatarImg = styled('img', {
  name: 'Avatar',
  slot: 'Img'
})({
  width: '100%',
  height: '100%',
  textAlign: 'center',
  objectFit: 'cover',
  color: 'transparent',
  textIndent: 10000
});

const AvatarFallback = styled(Person, {
  name: 'Avatar',
  slot: 'Fallback'
})({
  width: '75%',
  height: '75%'
});

const Avatar = React.forwardRef((props, ref) => {
  const {
    alt,
    children: childrenProp,
    component: componentProp = 'div',
    imgProps,
    sizes,
    slots = {},
    slotProps = {},
    src,
    srcSet,
    variant = 'circular',
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  let children = null;

  const loaded = useLoaded({ ...imgProps, src, srcSet });
  const hasImg = src || srcSet;
  const hasImgNotFailing = hasImg && loaded !== 'error';

  const ownerState = {
    ...props,
    cssStyles,
    colorDefault: !hasImgNotFailing,
    variant
  };

  const classes = {
    root: [avatarClasses.root, variant, ownerState.colorDefault && avatarClasses.colorDefault],
    img: avatarClasses.img,
    fallback: avatarClasses.fallback
  };

  const AvatarComponent = slots.root || AvatarRoot;
  const component = componentProp || 'div';

  const avatarRootProps = useSlotProps({
    elementType: AvatarComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: ref
    },
    ownerState,
    className: classes.root
  });

  const AvatarImgComponent = slots.img || AvatarImg;
  const avatarImgProps = useSlotProps({
    elementType: AvatarImgComponent,
    externalSlotProps: slotProps.img,
    externalForwardedProps: other,
    additionalProps: {
      alt,
      src,
      srcSet,
      sizes,
      ...imgProps
    },
    ownerState,
    className: classes.img
  });

  if (hasImgNotFailing) {
    children = <AvatarImg {...avatarImgProps} />;
  } else if (childrenProp != null) {
    children = childrenProp;
  } else if (hasImg && alt) {
    children = alt[0];
  } else {
    children = (
      <AvatarFallback icon='MdPerson' ownerState={ownerState} className={classes.fallback} />
    );
  }

  return (
    <AvatarComponent as={component} {...avatarRootProps}>
      {children}
    </AvatarComponent>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar;
