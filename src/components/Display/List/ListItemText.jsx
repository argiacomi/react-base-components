import React from 'react';
import clsx from 'clsx';
import { Text } from '@components/layout';
import { useListContext } from '../List/ListContext';
import { styled } from '@styles';

export const listItemTextClasses = {
  root: 'ListItemText-Root',
  primary: 'ListItemText-Primary',
  secondary: 'ListItemText-Secondary',
  inset: 'ListItemText-Inset'
};

const ListItemTextRoot = styled('div')(({ theme, ownerState }) => ({
  flex: '1 1 auto',
  minWidth: 0,
  marginTop: theme.spacing(0.5),
  marginBottom: theme.spacing(0.5),
  ...(ownerState.primary &&
    ownerState.secondary && {
      marginTop: theme.spacing(0.75),
      marginBottom: theme.spacing(0.75)
    }),
  ...(ownerState.inset && {
    paddingLeft: theme.spacing(7)
  })
}));

const ListItemText = React.forwardRef((props, ref) => {
  const {
    children,
    className,
    disableText = false,
    inset = false,
    primary: primaryProp,
    primaryTextProps,
    secondary: secondaryProp,
    secondaryTextProps,
    ...other
  } = props;

  const { dense } = useListContext();

  let primary = primaryProp != null ? primaryProp : children;
  let secondary = secondaryProp;

  const ownerState = {
    ...props,
    disableText,
    inset,
    primary: !!primary,
    secondary: !!secondary,
    dense
  };

  if (primary != null && primary.type !== Text && !disableText) {
    primary = (
      <Text
        variant={dense ? 'body2' : 'body1'}
        className={listItemTextClasses.primary}
        color='text.primary'
        component={primaryTextProps?.variant ? undefined : 'span'}
        display='block'
        {...primaryTextProps}
      >
        {primary}
      </Text>
    );
  }

  if (secondary != null && secondary.type !== Text && !disableText) {
    secondary = (
      <Text
        variant='body2'
        className={listItemTextClasses.secondary}
        color='text.secondary'
        display='block'
        {...secondaryTextProps}
      >
        {secondary}
      </Text>
    );
  }

  const classes = {
    root: [listItemTextClasses.root, ownerState.inset && listItemTextClasses.inset]
  };

  return (
    <ListItemTextRoot
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      ref={ref}
      {...other}
    >
      {primary}
      {secondary}
    </ListItemTextRoot>
  );
});

ListItemText.displayName = 'ListItemText';

export default ListItemText;
