import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling, shouldForwardProp } from '@styles';
import Text from '@components/display/text';

export const dialogContentTextClasses = {
  root: 'DialogContentText-Root'
};

const DialogContentTextRoot = styled(Text, {
  shouldForwardProp: (prop) => shouldForwardProp(prop) || prop === 'classes',
  name: 'DialogContentText',
  slot: 'Root'
})(({ ownerState }) => ownerState.cssStyles);

const DialogContentText = React.forwardRef((props, ref) => {
  const { className, ...otherProps } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = { ...props, cssStyles };

  return (
    <DialogContentTextRoot
      component='p'
      variant='body1'
      color='text.secondary'
      ref={ref}
      ownerState={ownerState}
      className={clsx(dialogContentTextClasses.root, className)}
      {...other}
      classes={dialogContentTextClasses}
    />
  );
});

DialogContentText.displayName = 'DialogContentText';

export default DialogContentText;
