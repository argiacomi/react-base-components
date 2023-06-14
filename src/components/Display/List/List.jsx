import React from 'react';
import clsx from 'clsx';
import { styled } from '@styles';
import ListContext from './ListContext';

const ListRoot = styled('ul')(({ ownerState }) => ({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  position: 'relative',
  ...(!ownerState.disablePadding && {
    paddingTop: 8,
    paddingBottom: 8
  }),
  ...(ownerState.subheader && {
    paddingTop: 0
  })
}));

const List = React.forwardRef((props, ref) => {
  const {
    children,
    className,
    component = 'ul',
    dense = false,
    disablePadding = false,
    subheader,
    ...other
  } = props;

  const context = React.useMemo(() => ({ dense }), [dense]);

  const ownerState = {
    ...props,
    component,
    dense,
    disablePadding
  };

  return (
    <ListContext.Provider value={context}>
      <ListRoot
        as={component}
        className={clsx('List-Root', className)}
        ref={ref}
        ownerState={ownerState}
        {...other}
      >
        {subheader}
        {children}
      </ListRoot>
    </ListContext.Provider>
  );
});

List.displayName = 'List';

export default List;
