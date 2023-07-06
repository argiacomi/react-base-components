import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling } from '@styles';

export const tableContainerClasses = {
  root: 'TableContainer-Root'
};

const TableContainerRoot = styled('div', {
  name: 'TableContainer',
  slot: 'Root'
})(({ theme, ownerState }) => ({
  width: '100%',
  overflowX: 'auto',
  backgroundImage: 'none',
  backgroundColor: theme.color.mode === 'light' ? theme.color.gray[100] : theme.color.gray[1000],
  ...ownerState.cssStyles
}));

const TableContainer = React.forwardRef((props, ref) => {
  const { className, component = 'div', ...otherProps } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = {
    ...props,
    component,
    cssStyles
  };

  const classes = {
    root: [tableContainerClasses.root]
  };

  return (
    <TableContainerRoot
      ref={ref}
      as={component}
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      {...other}
    />
  );
});

TableContainer.displayName = 'TableContainer';

export default TableContainer;
