import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling } from '@styles';
import { capitalize } from '@components/lib';
import ButtonBase from '@components/Inputs/Button/ButtonBase';
import ArrowDownwardIcon from '@icons/ArrowDownward';

export const tableSortLabelClasses = {
  root: 'TableSortLabel-Root',
  active: 'Active'
};

const TableSortLabelRoot = styled(ButtonBase, {
  name: 'TableSortLabel',
  slot: 'Root'
})(({ theme, ownerState }) => ({
  cursor: 'pointer',
  display: 'inline-flex',
  justifyContent: 'flex-start',
  flexDirection: 'inherit',
  alignItems: 'center',
  '&:focus': {
    color: theme.color.text.secondary
  },
  '&:hover': {
    color: theme.color.text.secondary,
    [`& .${tableSortLabelClasses.icon}`]: {
      opacity: 0.5
    }
  },
  [`&.${tableSortLabelClasses.active}`]: {
    color: theme.color.text.primary,
    [`& .${tableSortLabelClasses.icon}`]: {
      opacity: 1,
      color: theme.color.text.secondary
    }
  },
  ...ownerState.cssStyles
}));

const TableSortLabelIcon = styled('span', {
  name: 'TableSortLabel',
  slot: 'Icon'
})(({ theme, ownerState }) => ({
  fontSize: 18,
  marginRight: 4,
  marginLeft: 4,
  opacity: 0,
  transition: theme.transition.create(['opacity', 'transform'], {
    duration: theme.transition.duration.shorter
  }),
  userSelect: 'none',
  ...(ownerState.direction === 'desc' && {
    transform: 'rotate(0deg)'
  }),
  ...(ownerState.direction === 'asc' && {
    transform: 'rotate(180deg)'
  })
}));

/**
 * A button based label for placing inside `TableCell` for column sorting.
 */
const TableSortLabel = React.forwardRef((props, ref) => {
  const {
    active = false,
    children,
    className,
    direction = 'asc',
    hideSortIcon = false,
    IconComponent = ArrowDownwardIcon,
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = {
    ...props,
    active,
    cssStyles,
    direction,
    hideSortIcon,
    IconComponent
  };

  const classes = {
    root: [tableSortLabelClasses.root, ownerState.active && tableSortLabelClasses.active],
    icon: [tableSortLabelClasses.icon, `IconDirection${capitalize(direction)}`]
  };

  return (
    <TableSortLabelRoot
      className={clsx(classes.root, className)}
      component='span'
      disableRipple
      ownerState={ownerState}
      ref={ref}
      {...other}
    >
      {children}
      {hideSortIcon && !active ? null : (
        <TableSortLabelIcon
          as={IconComponent}
          className={clsx(classes.icon)}
          ownerState={ownerState}
        />
      )}
    </TableSortLabelRoot>
  );
});

TableSortLabel.displayName = 'TableSortLabel';

export default TableSortLabel;
