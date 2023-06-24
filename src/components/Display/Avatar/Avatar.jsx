import React from 'react';
import clsx from 'clsx';
import styled from '@styles';
import { useLoaded } from '@component/hooks';
import Icon from '@components/Display/Icon';

export const avatarClasses = {
  root: 'Avatar-Root',
  fallback: 'Avatar-Fallback',
  img: 'Avatar-Img'
};

const AvatarRoot = styled('div')(({ theme, ownerState }) => ({
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
  })
}));

const AvatarImg = styled('img')({
  width: '100%',
  height: '100%',
  textAlign: 'center',
  objectFit: 'cover',
  color: 'transparent',
  textIndent: 10000
});

const AvatarFallback = styled(Icon)({
  width: '75%',
  height: '75%'
});

const Avatar = React.forwardRef((props, ref) => {
  const {
    alt,
    children: childrenProp,
    className,
    component = 'div',
    imgProps,
    sizes,
    src,
    srcSet,
    variant = 'circular',
    ...other
  } = props;

  let children = null;

  const loaded = useLoaded({ ...imgProps, src, srcSet });
  const hasImg = src || srcSet;
  const hasImgNotFailing = hasImg && loaded !== 'error';

  const ownerState = {
    ...props,
    colorDefault: !hasImgNotFailing,
    component,
    variant
  };

  if (hasImgNotFailing) {
    children = (
      <AvatarImg
        alt={alt}
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        ownerState={ownerState}
        className={avatarClasses.img}
        {...imgProps}
      />
    );
  } else if (childrenProp != null) {
    children = childrenProp;
  } else if (hasImg && alt) {
    children = alt[0];
  } else {
    children = (
      <AvatarFallback icon='MdPerson' ownerState={ownerState} className={avatarClasses.fallback} />
    );
  }

  return (
    <AvatarRoot
      as={component}
      ownerState={ownerState}
      className={clsx(avatarClasses.root, className)}
      ref={ref}
      {...other}
    >
      {children}
    </AvatarRoot>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar;
