import React from 'react';
import clsx from 'clsx';
import { styled } from '@styles';

export const TextRoot = styled('span')(({ theme, ownerState }) => {
  const colorStyles = {
    inherit: 'inherit',
    'text.primary': theme.color.text.primary,
    'text.secondary': theme.color.text.secondary
  };

  let color =
    colorStyles[ownerState.color] ||
    (theme.color[ownerState.color] ? theme.color[ownerState.color][500] : undefined);

  return {
    margin: 0,
    fontWeight: 400,
    letterSpacing: '0em',
    ...(ownerState.variant && theme.text.typography[ownerState.variant]),
    ...(ownerState.align !== 'inherit' && {
      textAlign: ownerState.align
    }),
    ...(ownerState.noWrap && {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }),
    ...(ownerState.gutterBottom && {
      marginBottom: '0.375em'
    }),
    ...(ownerState.paragraph && {
      marginBottom: '1rem'
    }),
    color: (ownerState.color && color) || ownerState.color
  };
});

const defaultVariantMapping = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'h6',
  subtitle2: 'h6',
  body1: 'p',
  body2: 'p',
  inherit: 'p'
};

const Text = React.forwardRef((props, ref) => {
  const {
    align = 'inherit',
    className,
    color = 'inherit',
    component: componentProp,
    gutterBottom = false,
    noWrap = false,
    paragraph = false,
    variant = 'body1',
    variantMapping = defaultVariantMapping,
    ...other
  } = props;

  const component =
    componentProp ||
    (paragraph ? 'p' : variantMapping[variant] || defaultVariantMapping[variant]) ||
    'span';

  const ownerState = {
    ...props,
    align,
    color,
    className,
    component,
    gutterBottom,
    noWrap,
    paragraph,
    variant,
    variantMapping
  };

  return (
    <TextRoot
      as={component}
      ref={ref}
      className={clsx('Text-Root', className)}
      ownerState={ownerState}
      {...other}
    />
  );
});
Text.displayName = 'Text';

export default Text;
