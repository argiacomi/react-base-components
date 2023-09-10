import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling } from '@styles';
import Tablelvl2Context from '../table/Tablelvl2Context';

export const tableFooterClasses = {
  root: 'TableFooter-Root'
};

const TableFooterRoot = styled('tfoot', {
  name: 'TableFooter',
  slot: 'Root'
})(({ ownerState }) => ({
  display: 'table-footer-group',
  ...ownerState.cssStyles
}));

const tablelvl2 = {
  variant: 'footer'
};

const defaultComponent = 'tfoot';

const TableFooter = React.forwardRef((props, ref) => {
  const { className, component = defaultComponent, ...otherProps } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = {
    ...props,
    component,
    cssStyles
  };

  const classes = {
    root: [tableFooterClasses.root]
  };

  return (
    <Tablelvl2Context.Provider value={tablelvl2}>
      <TableFooterRoot
        as={component}
        className={clsx(classes.root, className)}
        ref={ref}
        role={component === defaultComponent ? null : 'rowgroup'}
        ownerState={ownerState}
        {...other}
      />
    </Tablelvl2Context.Provider>
  );
});

TableFooter.displayName = 'TableFooter';

export default TableFooter;
