import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling } from '@styles';
import { capitalize } from '@components/lib';
import { useTableContext, useTablelvl2Context } from '../Table';

export const tableCellClasses = {
  root: 'TableCell-Root',
  stickyHeader: 'StickyHeader'
};

const TableCellRoot = styled('td', {
  name: 'TableCell',
  slot: 'Root'
})(({ theme, ownerState }) => ({
  ...theme.text.typography.body2,
  display: 'table-cell',
  verticalAlign: 'inherit',
  borderBottom: `1px solid ${theme.color.divider}`,
  textAlign: 'left',
  padding: 16,
  ...(ownerState.variant === 'head' && {
    color: theme.color.text.primary,
    lineHeight: theme.pxToRem(24),
    fontWeight: theme.text.weight.extrabold
  }),
  ...(ownerState.variant === 'body' && {
    color: theme.color.text.primary
  }),
  ...(ownerState.variant === 'footer' && {
    color: theme.color.text.secondary,
    lineHeight: theme.pxToRem(21),
    fontSize: theme.pxToRem(12)
  }),
  ...(ownerState.size === 'small' && {
    padding: '6px 16px',
    [`&.${tableCellClasses.paddingCheckbox}`]: {
      width: 24,
      padding: '0 12px 0 16px',
      '& > *': {
        padding: 0
      }
    }
  }),
  ...(ownerState.padding === 'checkbox' && {
    width: 48,
    padding: '0 0 0 4px'
  }),
  ...(ownerState.padding === 'none' && {
    padding: 0
  }),
  ...(ownerState.align === 'left' && {
    textAlign: 'left'
  }),
  ...(ownerState.align === 'center' && {
    textAlign: 'center'
  }),
  ...(ownerState.align === 'right' && {
    textAlign: 'right',
    flexDirection: 'row-reverse'
  }),
  ...(ownerState.align === 'justify' && {
    textAlign: 'justify'
  }),
  ...(ownerState.stickyHeader && {
    position: 'sticky',
    top: 0,
    zIndex: 2,
    backgroundColor: theme.color.gray[1000]
  }),
  ...ownerState.cssStyles
}));

const TableCell = React.forwardRef((props, ref) => {
  const {
    align = 'inherit',
    className,
    component: componentProp,
    padding: paddingProp,
    scope: scopeProp,
    size: sizeProp,
    sortDirection,
    variant: variantProp,
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const table = useTableContext();
  const tablelvl2 = useTablelvl2Context();

  const isHeadCell = tablelvl2 && tablelvl2.variant === 'head';

  let component;
  if (componentProp) {
    component = componentProp;
  } else {
    component = isHeadCell ? 'th' : 'td';
  }

  let scope = scopeProp;
  if (component === 'td') {
    scope = undefined;
  } else if (!scope && isHeadCell) {
    scope = 'col';
  }

  const variant = variantProp || (tablelvl2 && tablelvl2.variant);

  const ownerState = {
    ...props,
    align,
    component,
    cssStyles,
    padding: paddingProp || (table && table.padding ? table.padding : 'normal'),
    size: sizeProp || (table && table.size ? table.size : 'medium'),
    sortDirection,
    stickyHeader: variant === 'head' && table && table.stickyHeader,
    variant
  };

  const classes = {
    root: [
      tableCellClasses.root,
      capitalize(ownerState.variant),
      ownerState.stickyHeader && tableCellClasses.stickyHeader,
      ownerState.align !== 'inherit' && `Align${capitalize(ownerState.align)}`,
      ownerState.padding !== 'normal' && `Padding${capitalize(ownerState.padding)}`,
      `Size${capitalize(ownerState.size)}`
    ]
  };

  let ariaSort = null;
  if (sortDirection) {
    ariaSort = sortDirection === 'asc' ? 'ascending' : 'descending';
  }

  return (
    <TableCellRoot
      as={component}
      ref={ref}
      className={clsx(classes.root, className)}
      aria-sort={ariaSort}
      scope={scope}
      ownerState={ownerState}
      {...other}
    />
  );
});

TableCell.displayName = 'TableCell';

export default TableCell;
