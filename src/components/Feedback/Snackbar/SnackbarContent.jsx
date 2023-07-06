import React from 'react';
import clsx from 'clsx';
import styled from '@styles';
import { Paper } from '@components/surfaces';

export const snackbarContentClasses = {
  root: 'SnackbarContent-Root',
  action: 'SnackbarContent-Action',
  message: 'SnackbarContent-Message'
};

const SnackbarContentRoot = styled(Paper)(({ theme }) => {
  const emphasis = theme.color.mode === 'light' ? 0.8 : 0.25;
  const backgroundColor = theme.alpha.emphasize(theme.color.background, emphasis);

  return {
    ...theme.text.typography.body2,
    color: theme.alpha.contrastText(backgroundColor),
    backgroundColor: backgroundColor,
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: '6px 16px',
    borderRadius: theme.rounded.md,
    flexGrow: 1,
    [theme.breakpoints.up('sm')]: {
      flexGrow: 'initial',
      minWidth: theme.spacing(288 / 8)
    }
  };
});

const SnackbarContentMessage = styled('div')(({ theme }) => ({
  padding: `${theme.spacing(1)} 0`
}));

const SnackbarContentAction = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginLeft: 'auto',
  paddingLeft: theme.spacing(2),
  marginRight: theme.spacing(-1)
}));

const SnackbarContent = React.forwardRef((props, ref) => {
  const { action, className, message, role = 'alert', ...other } = props;
  const ownerState = props;

  return (
    <SnackbarContentRoot
      role={role}
      square
      elevation={6}
      className={clsx(snackbarContentClasses.root, className)}
      ownerState={ownerState}
      ref={ref}
      {...other}
    >
      <SnackbarContentMessage className={snackbarContentClasses.message} ownerState={ownerState}>
        {message}
      </SnackbarContentMessage>
      {action ? (
        <SnackbarContentAction className={snackbarContentClasses.action} ownerState={ownerState}>
          {action}
        </SnackbarContentAction>
      ) : null}
    </SnackbarContentRoot>
  );
});

SnackbarContent.displayName = 'SnackbarContent';

export default SnackbarContent;
