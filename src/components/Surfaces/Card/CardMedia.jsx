import React from 'react';
import clsx from 'clsx';
import { styled } from '@styles';

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
  })
}));

const MEDIA_COMPONENTS = ['video', 'audio', 'picture', 'iframe', 'img'];
const IMAGE_COMPONENTS = ['picture', 'img'];

const CardMedia = React.forwardRef((props, ref) => {
  const { children, className, component = 'div', image, src, style, ...other } = props;

  const isMediaComponent = MEDIA_COMPONENTS.indexOf(component) !== -1;
  const composedStyle =
    !isMediaComponent && image ? { backgroundImage: `url("${image}")`, ...style } : style;

  const ownerState = {
    ...props,
    component,
    isMediaComponent,
    isImageComponent: IMAGE_COMPONENTS.indexOf(component) !== -1
  };

  return (
    <CardMediaRoot
      className={clsx('CardMedia-Root', className)}
      as={component}
      role={!isMediaComponent && image ? 'img' : undefined}
      ref={ref}
      style={composedStyle}
      ownerState={ownerState}
      src={isMediaComponent ? image || src : undefined}
      {...other}
    >
      {children}
    </CardMediaRoot>
  );
});

CardMedia.displayName = 'CardMedia';

export default CardMedia;
