import * as React from 'react';
import clsx from 'clsx';
import Text from '@components/Display/Text';
import styled, { extractStyling } from '@styles';
import { useDialogContext } from '../Dialog/DialogContext';

export const dialogTitleClasses = {
  root: 'DialogTitle-Root'
};

const DialogTitleRoot = styled(Text, {
  name: 'DialogTitle',
  slot: 'Root'
})(({ ownerState }) => ({
  padding: '16px 24px',
  flex: '0 0 auto',
  ...ownerState.cssStyles
}));

const DialogTitle = React.forwardRef((props, ref) => {
  const { className, id: idProp, ...otherProps } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = { ...props, cssStyles };

  const { titleId = idProp } = useDialogContext();

  return (
    <DialogTitleRoot
      component='h2'
      className={clsx(dialogTitleClasses.root, className)}
      ownerState={ownerState}
      ref={ref}
      variant='h6'
      id={idProp ?? titleId}
      {...other}
    />
  );
});

DialogTitle.displayName = 'DialogTitle';

export default DialogTitle;
