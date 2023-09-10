import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling } from '@styles';
import { dialogTitleClasses } from '../dialogTitle';

export const dialogContentClasses = {
  root: 'DialogContent-Root',
  dividers: 'Dividers'
};

const DialogContentRoot = styled('div', {
  name: 'DialogContent',
  slot: 'Root'
})(({ theme, ownerState }) => ({
  flex: '1 1 auto',
  WebkitOverflowScrolling: 'touch',
  overflowY: 'auto',
  padding: '20px 24px',
  ...(ownerState.dividers
    ? {
        padding: '16px 24px',
        borderTop: `1px solid ${theme.color.divider}`,
        borderBottom: `1px solid ${theme.color.divider}`
      }
    : {
        [`.${dialogTitleClasses.root} + &`]: {
          paddingTop: 0
        }
      })
}));

const DialogContent = React.forwardRef((props, ref) => {
  const { className, dividers = false, ...otherProps } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = { ...props, cssStyles, dividers };
  const classes = {
    root: [dialogContentClasses.root, ownerState.dividers && dialogContentClasses.dividers]
  };

  return (
    <DialogContentRoot
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      ref={ref}
      {...other}
    />
  );
});

DialogContent.displayName = 'DialogContent';

export default DialogContent;
