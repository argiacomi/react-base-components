import React from 'react';
import clsx from 'clsx';
import styled from '@styles';

const ListSubheaderRoot = styled('li')(({ theme, ownerState }) => ({
  boxSizing: 'border-box',
  lineHeight: theme.spacing(6),
  listStyle: 'none',
  color: theme.color.text.secondary,
  fontFamily: 'inherit',
  fontWeight: theme.text.weight.medium,
  fontSize: theme.spacing(14 / 8),
  ...(ownerState.color === 'primary' && {
    color: theme.color.primary.body
  }),
  ...(ownerState.color === 'inherit' && {
    color: 'inherit'
  }),
  ...(!ownerState.disableGutters && {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  }),
  ...(ownerState.inset && {
    paddingLeft: theme.spacing(9)
  }),
  ...(!ownerState.disableSticky && {
    position: 'sticky',
    top: 0,
    zIndex: 1,
    backgroundColor: theme.color.background
  })
}));

const ListSubheader = React.forwardRef((props, ref) => {
  const {
    className,
    color = 'default',
    component = 'li',
    disableGutters = false,
    disableSticky = false,
    inset = false,
    ...other
  } = props;

  const ownerState = {
    ...props,
    color,
    component,
    disableGutters,
    disableSticky,
    inset
  };

  return (
    <ListSubheaderRoot
      as={component}
      className={clsx('ListSubheader-Root', className)}
      ref={ref}
      ownerState={ownerState}
      {...other}
    />
  );
});

ListSubheader.displayName = 'ListSubheader';

export default ListSubheader;
