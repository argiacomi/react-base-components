import * as React from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '@components/../../tailwind.config.js';
import tw from 'twin.macro';

const DEFAULT_BREAKPOINTS = resolveConfig(tailwindConfig).theme.screens;
const DEFAULT_BREAKPOINT = Object.keys(DEFAULT_BREAKPOINTS)[0];
const SPACING_CONSTANT = 8;

function joinChildren(children, divider) {
  const childrenArray = React.Children.toArray(children).filter(Boolean);

  return childrenArray.reduce((output, child, index) => {
    output.push(child);

    if (index < childrenArray.length - 1) {
      output.push(React.cloneElement(divider, { key: `divider-${index}` }));
    }

    return output;
  }, []);
}

const getSideFromDirection = (direction) => {
  return {
    row: 'Left',
    'row-reverse': 'Right',
    column: 'Top',
    'column-reverse': 'Bottom'
  }[direction];
};

const computeStyles = (direction, spacing, useFlexGap) => {
  let styleConfig = {};

  // Ensure direction and spacing are both objects or strings for consistency
  if (typeof direction !== 'object')
    direction = { [DEFAULT_BREAKPOINT]: direction };
  if (typeof spacing !== 'object') spacing = { [DEFAULT_BREAKPOINT]: spacing };

  const breakpoints = new Set([
    ...Object.keys(direction),
    ...Object.keys(spacing)
  ]);

  let lastDirection = 'column';
  let lastSpacing = '0px';

  for (const breakpoint of breakpoints) {
    const mediaQuery = `@media (min-width: ${DEFAULT_BREAKPOINTS[breakpoint]})`;

    if (!styleConfig[mediaQuery]) {
      styleConfig[mediaQuery] = {};
    }

    if (direction[breakpoint]) {
      if (lastDirection !== direction[breakpoint]) {
        styleConfig[mediaQuery][`& > :not(style) + :not(style)`] = {
          [`margin${getSideFromDirection(lastDirection)}`]: '0px'
        };
        lastDirection = direction[breakpoint];
      }
    }

    if (spacing[breakpoint]) {
      lastSpacing = spacing[breakpoint] * SPACING_CONSTANT;
    }

    styleConfig[mediaQuery] = {
      ...styleConfig[mediaQuery],
      flexDirection: lastDirection,
      gap: useFlexGap ? `${lastSpacing}px` : undefined,
      margin: useFlexGap ? undefined : '0px',
      [`& > :not(style) + :not(style)`]: {
        ...styleConfig[mediaQuery][`& > :not(style) + :not(style)`],
        [`margin${getSideFromDirection(lastDirection)}`]: useFlexGap
          ? undefined
          : `${lastSpacing}px`
      }
    };
  }

  return styleConfig;
};

const Stack = React.forwardRef(
  (
    {
      component,
      direction = 'column',
      spacing = 0,
      divider,
      children,
      className,
      useFlexGap = false,
      ...other
    },
    ref
  ) => {
    const baseStyles = tw`flex flex-col`;

    const styleConfig = React.useMemo(
      () => computeStyles(direction, spacing, useFlexGap),
      [direction, spacing, useFlexGap]
    );

    const StackRoot = component ?? 'div';

    return (
      <StackRoot
        css={[baseStyles, styleConfig].filter(Boolean)}
        ref={ref}
        className={className}
        {...other}
      >
        {divider ? joinChildren(children, divider) : children}
      </StackRoot>
    );
  }
);

Stack.displayName = 'Stack';

export default Stack;
