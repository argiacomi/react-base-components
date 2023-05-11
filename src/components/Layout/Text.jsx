import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@utils';

const textVariants = cva('m-0 font-normal tracking-normal', {
  variants: {
    variant: {
      h1: 'font-light text-8xl leading-5 tracking-tight',
      h2: 'font-light text-6xl leading-5',
      h3: 'text-5xl leading-5',
      h4: 'text-4xl leading-5',
      h5: 'text-2xl leading-5',
      h6: 'font-medium text-xl leading-6',
      subtitle1: 'text-base leading-7',
      subtitle2: 'font-medium text-sm leading-6',
      body1: 'text-base',
      body2: 'text-sm leading-6',
      inherit:
        'font-[inherit] text-[inherit] leading-[inherit] tracking-[inherit]'
    },
    align: {
      center: 'text-center',
      end: 'text-end',
      inherit: 'text-[inherit]',
      jusitify: 'text-justify',
      left: 'text-left',
      right: 'text-right',
      start: 'text-start'
    }
  }
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

const Text = React.forwardRef(
  (
    {
      align = 'inherit',
      className,
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

    const mergedClasses = cn(
      textVariants({ variant, align }),
      gutterBottom && 'mb-1.5',
      noWrap && 'overflow-hidden text-ellipsis whitespace-nowrap',
      paragraph && 'mb-4'
    );

    return (
      <Component
        ref={ref}
        className={cn(mergedClasses, className)}
        {...other}
      />
    );
  }
);
Text.displayName = 'Text';

export default Text;
