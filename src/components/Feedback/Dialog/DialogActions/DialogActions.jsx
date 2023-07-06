import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling } from '@styles';

export const dialogActionsClasses = {
  root: 'DialogActions-Root',
  spacing: 'Spacing'
};

const DialogActionsRoot = styled('div', {
  name: 'DialogActions',
  slot: 'Root'
})(({ ownerState }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: 8,
  justifyContent: 'flex-end',
  flex: '0 0 auto',
  ...(!ownerState.disableSpacing && {
    '& > :not(:first-of-type)': {
      marginLeft: 8
    }
  }),
  ...ownerState.cssStyles
}));

const DialogActions = React.forwardRef((props, ref) => {
  const { className, disableSpacing = false, ...otherProps } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = { ...props, cssStyles, disableSpacing };
  const classes = {
    root: [dialogActionsClasses.root, !ownerState.disableSpacing && dialogActionsClasses.spacing]
  };

  return (
    <DialogActionsRoot
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      ref={ref}
      {...other}
    />
  );
});

DialogActions.displayName = 'DialogActions';

export default DialogActions;
