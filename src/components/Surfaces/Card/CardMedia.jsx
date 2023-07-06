import React from 'react';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';

export const cardMediaClasses = {
  root: 'CardMedia-Root',
  media: 'Media',
  img: 'Img'
};

const CardMediaRoot = styled('div')(({ ownerState }) => ({
  display: 'block',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  ...(ownerState.isMediaComponent && {
    width: '100%'
  }),
  ...(ownerState.isImageComponent && {
    objectFit: 'cover'
  }),
  ...ownerState.cssStyles
}));

const MEDIA_COMPONENTS = ['video', 'audio', 'picture', 'iframe', 'img'];
const IMAGE_COMPONENTS = ['picture', 'img'];

const CardMedia = React.forwardRef((props, ref) => {
  const {
    children,
    component = 'div',
    image,
    slots = {},
    slotProps = {},
    src,
    style,
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const isMediaComponent = MEDIA_COMPONENTS.indexOf(component) !== -1;
  const composedStyle =
    !isMediaComponent && image ? { backgroundImage: `url("${image}")`, ...style } : style;

  const ownerState = {
    ...props,
    cssStyles,
    isMediaComponent,
    isImageComponent: IMAGE_COMPONENTS.indexOf(component) !== -1
  };

  const classes = {
    root: [
      cardMediaClasses.root,
      ownerState.isMediaComponent && cardMediaClasses.media,
      ownerState.isImageComponent && cardMediaClasses.img
    ]
  };

  const CardMediaComponent = slots.root || CardMediaRoot;
  const cardMediaRootProps = useSlotProps({
    elementType: CardMediaComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: ref,
      role: !isMediaComponent && image ? 'img' : undefined,
      src: isMediaComponent ? image || src : undefined,
      style: composedStyle
    },
    ownerState,
    className: classes.root
  });

  return (
    <CardMediaComponent as={component} {...cardMediaRootProps}>
      {children}
    </CardMediaComponent>
  );
});

CardMedia.displayName = 'CardMedia';

export default CardMedia;
