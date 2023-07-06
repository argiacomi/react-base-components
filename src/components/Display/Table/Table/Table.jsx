import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling } from '@styles';
import TableContext from './TableContext';

export const tableClasses = {
  root: 'Table-Root',
  stickyHeader: 'StickyHeader'
};

const TableRoot = styled('table', {
  name: 'Table',
  slot: 'Root'
})(({ theme, ownerState }) => ({
  display: 'table',
  width: '100%',
  borderCollapse: 'collapse',
  borderSpacing: 0,
  '& caption': {
    ...theme.text.typography.body2,
    padding: theme.spacing(2),
    color: theme.color.text.secondary,
    textAlign: 'left',
    captionSide: 'bottom'
  },
  ...(ownerState.stickyHeader && {
    borderCollapse: 'separate'
  }),
  ...ownerState.cssStyles
}));

const defaultComponent = 'table';

const Table = React.forwardRef((props, ref) => {
  const {
    className,
    component = defaultComponent,
    padding = 'normal',
    size = 'medium',
    stickyHeader = false,
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = {
    ...props,
    cssStyles,
    component,
    padding,
    size,
    stickyHeader
  };

  const classes = {
    root: [tableClasses.root, ownerState.stickyHeader && tableClasses.stickyHeader]
  };

  const table = React.useMemo(
    () => ({ padding, size, stickyHeader }),
    [padding, size, stickyHeader]
  );

  return (
    <TableContext.Provider value={table}>
      <TableRoot
        as={component}
        role={component === defaultComponent ? null : 'table'}
        ref={ref}
        className={clsx(classes.root, className)}
        ownerState={ownerState}
        {...other}
      />
    </TableContext.Provider>
  );
});

Table.displayName = 'Table';

export default Table;
