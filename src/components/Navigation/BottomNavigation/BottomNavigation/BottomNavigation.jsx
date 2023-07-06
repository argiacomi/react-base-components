import React from 'react';
import { isFragment } from 'react-is';
import clsx from 'clsx';
import styled, { extractStyling } from '@styles';

export const bottomNavigationClasses = {
  root: 'BottomNavigation-Root'
};

const BottomNavigationRoot = styled('div', {
  name: 'BottomNavigation',
  slot: 'Root'
})(({ theme, ownerState }) => ({
  display: 'flex',
  justifyContent: 'center',
  height: 56,
  backgroundColor: theme.color.background,
  ...ownerState.cssStyles
}));

const BottomNavigation = React.forwardRef((props, ref) => {
  const {
    children,
    className,
    component = 'div',
    onChange,
    showLabels = false,
    value,
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = {
    ...props,
    component,
    cssStyles,
    showLabels
  };

  return (
    <BottomNavigationRoot
      as={component}
      className={clsx(bottomNavigationClasses.root, className)}
      ref={ref}
      ownerState={ownerState}
      {...other}
    >
      {React.Children.map(children, (child, childIndex) => {
        if (!React.isValidElement(child)) {
          return null;
        }

        if (!import.meta.env.PROD) {
          if (isFragment(child)) {
            console.error(
              [
                "The BottomNavigation component doesn't accept a Fragment as a child.",
                'Consider providing an array instead.'
              ].join('\n')
            );
          }
        }

        const childValue = child.props.value === undefined ? childIndex : child.props.value;

        return React.cloneElement(child, {
          selected: childValue === value,
          showLabel: child.props.showLabel !== undefined ? child.props.showLabel : showLabels,
          value: childValue,
          onChange
        });
      })}
    </BottomNavigationRoot>
  );
});

BottomNavigation.displayName = 'BottomNavigation';

export default BottomNavigation;
