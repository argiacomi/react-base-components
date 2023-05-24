import * as React from 'react';
import tw, { css } from 'twin.macro';

const textVariants = {
  root: tw`m-0 font-normal tracking-normal`,
  variant: {
    h1: tw`font-light text-8xl leading-5 tracking-tight`,
    h2: tw`font-light text-6xl leading-5`,
    h3: tw`text-5xl leading-5`,
    h4: tw`text-4xl leading-5`,
    h5: tw`text-2xl leading-5`,
    h6: tw`font-medium text-xl leading-6`,
    subtitle1: tw`text-base leading-7`,
    subtitle2: tw`font-medium text-sm leading-6`,
    body1: tw`text-base`,
    body2: tw`text-sm leading-6`,
    inherit: tw`font-[inherit] text-[inherit] leading-[inherit] tracking-[inherit]`
  },
  align: {
    center: tw`text-center`,
    end: tw`text-end`,
    inherit: '',
    jusitify: tw`text-justify`,
    left: tw`text-left`,
    right: tw`text-right`,
    start: tw`text-start`
  },
  color: {
    inherit: tw`text-inherit`,
    text: tw`text-primary-light dark:text-primary-dark`,
    primary: tw`text-primary-500`,
    secondary: tw`text-secondary-500`,
    success: tw`text-success-500`,
    warning: tw`text-warning-500`,
    danger: tw`text-danger-500`
  }
};

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

const Text = React.forwardRef(
  (
    {
      align = 'inherit',
      className,
      color = 'text',
      component,
      gutterBottom = false,
      noWrap = false,
      paragraph = false,
      variant = 'body1',
      ...other
    },
    ref
  ) => {
    const Component =
      component || (paragraph ? 'p' : defaultVariantMapping[variant]) || 'span';

    const textStyles = [
      textVariants.root,
      textVariants.variant[variant],
      textVariants.align[align],
      textVariants.color[color],
      gutterBottom && tw`mb-1.5`,
      noWrap && tw`overflow-hidden text-ellipsis whitespace-nowrap`,
      paragraph && tw`mb-4`
    ].filter(Boolean);

    return (
      <Component ref={ref} className={className} css={textStyles} {...other} />
    );
  }
);
Text.displayName = 'Text';

export default Text;
