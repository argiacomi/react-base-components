import React from 'react';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';

export const stackClasses = {
  root: 'Stack-Root'
};

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

const getSideFromDirection = (direction) =>
  ({
    row: 'Left',
    'row-reverse': 'Right',
    column: 'Top',
    'column-reverse': 'Bottom'
  }[direction]);

const StackRoot = styled('div')(
  {
    display: 'flex',
    flexDirection: 'column'
  },
  ({ ownerState, theme }) => {
    const styles = {};

    const overlappingBreakpoints = theme.breakpoints.overlap({
      breakpoints: theme.breakpoints.values,
      direction: ownerState.direction,
      spacing: ownerState.spacing,
      useFlexGap: ownerState.useFlexGap ? 1 : 0
    });

    theme.breakpoints.traverse(theme.breakpoints, overlappingBreakpoints, (appendStyle, value) => {
      appendStyle(styles, {
        flexDirection: value.direction,
        gap: value.useFlexGap ? theme.spacing(value.spacing) : undefined,
        [`& > :not(style) + :not(style)`]: {
          margin: value.useFlexGap ? undefined : '0px',
          [`margin${getSideFromDirection(value.direction)}`]: value.useFlexGap
            ? undefined
            : theme.spacing(value.spacing)
        }
      });
    });
    return { ...styles };
  },
  ({ ownerState }) => ownerState.cssStyles
);

const Stack = React.forwardRef((props, ref) => {
  const {
    component = 'div',
    direction = 'column',
    spacing = 0,
    divider,
    children,
    slots = {},
    slotProps = {},
    useFlexGap = false,
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = {
    ...props,
    cssStyles,
    direction,
    spacing,
    useFlexGap
  };

  const StackComponent = slots.root || StackRoot;

  const stackRootProps = useSlotProps({
    elementType: StackComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: ref
    },
    ownerState,
    className: stackClasses.root
  });

  return (
    <StackComponent as={component} {...stackRootProps}>
      {divider ? joinChildren(children, divider) : children}
    </StackComponent>
  );
});
Stack.displayName = 'Stack';

export default Stack;
