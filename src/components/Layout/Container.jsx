import * as React from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '@components/../../tailwind.config.js';
import tw from 'twin.macro';

const DEFAULT_BREAKPOINTS = resolveConfig(tailwindConfig).theme.screens;

const getMediaQueries = (breakpoints) => {
  return Object.keys(breakpoints).reduce((acc, breakpoint) => {
    const value = breakpoints[breakpoint];
    if (value !== 0) {
      acc[`@media (min-width:${value})`] = {
        maxWidth: `${value}`
      };
    }
    return acc;
  }, {});
};

const Container = React.forwardRef(
  (
    {
      className = '',
      component: Component = 'div',
      disableGutters = false,
      fixed = false,
      maxWidth = 'lg',
      ...otherProps
    },
    ref
  ) => {
    const mediaQueries = React.useMemo(
      () => getMediaQueries(DEFAULT_BREAKPOINTS),
      []
    );

    const containerStyles = [
      tw`w-full mx-auto box-border block`,
      !disableGutters && tw`px-4 sm:px-6`,
      fixed && mediaQueries,
      maxWidth &&
        DEFAULT_BREAKPOINTS[maxWidth] !== 0 && {
          [`@media (min-width:${DEFAULT_BREAKPOINTS[maxWidth]})`]: {
            maxWidth: `${DEFAULT_BREAKPOINTS[maxWidth]}`
          }
        }
    ].filter(Boolean);

    return (
      <Component
        className={className}
        css={containerStyles}
        ref={ref}
        {...otherProps}
      />
    );
  }
);

Container.displayName = 'Container';

export default Container;
