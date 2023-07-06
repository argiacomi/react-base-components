import React from 'react';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';

export const textClasses = { root: 'Text-Root' };

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
      marginBottom: '0.35em'
    }),
    ...(ownerState.paragraph && {
      marginBottom: theme.pxToRem(16)
    }),
    color: (ownerState.color && color) || ownerState.color,
    ...ownerState.cssStyles
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
    color = 'inherit',
    component: componentProp,
    gutterBottom = false,
    noWrap = false,
    paragraph = false,
    slots = {},
    slotProps = {},
    variant = 'body1',
    variantMapping = defaultVariantMapping,
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = {
    ...props,
    align,
    cssStyles,
    color,
    gutterBottom,
    noWrap,
    paragraph,
    variant,
    variantMapping
  };

  const component =
    componentProp ||
    (paragraph ? 'p' : variantMapping[variant] || defaultVariantMapping[variant]) ||
    'span';

  const TextComponent = slots.root || TextRoot;
  const textRootProps = useSlotProps({
    elementType: TextComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: ref
    },
    ownerState,
    className: textClasses.root
  });

  return <TextComponent as={component} {...textRootProps} />;
});
Text.displayName = 'Text';

export default Text;
