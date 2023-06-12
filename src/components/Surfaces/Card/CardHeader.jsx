import * as React from 'react';
import clsx from 'clsx';
import { Text } from '@components/layout';
import { styled } from '@styles';

const CardHeaderRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2)
}));

const CardHeaderAvatar = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '0 0 auto',
  marginRight: theme.spacing(2)
}));

const CardHeaderAction = styled('div')(({ theme }) => ({
  flex: '0 0 auto',
  alignSelf: 'flex-start',
  marginTop: theme.spacing(-0.25),
  marginRight: theme.spacing(-0.5),
  marginBottom: theme.spacing(-0.25)
}));

const CardHeaderContent = styled('div')({
  flex: '1 1 auto'
});

const CardHeader = React.forwardRef((props, ref) => {
  const {
    action,
    avatar,
    className,
    component = 'div',
    disableText = false,
    subheader: subheaderProp,
    subheaderTextProps,
    title: titleProp,
    titleTextProps,
    ...other
  } = props;

  const ownerState = {
    ...props,
    component,
    disableText
  };

  let title = titleProp;
  if (title != null && title.type !== Text && !disableText) {
    title = (
      <Text
        variant={avatar ? 'body2' : 'h5'}
        className={'CardHeader-Title'}
        color='primary'
        component='span'
        display='block'
        {...titleTextProps}
      >
        {title}
      </Text>
    );
  }

  let subheader = subheaderProp;
  if (subheader != null && subheader.type !== Text && !disableText) {
    subheader = (
      <Text
        variant={avatar ? 'body2' : 'body1'}
        className={'CardHeader-Subheader'}
        color='secondary'
        component='span'
        display='block'
        {...subheaderTextProps}
      >
        {subheader}
      </Text>
    );
  }

  return (
    <CardHeaderRoot
      className={clsx('CardHeader-Root', className)}
      as={component}
      ref={ref}
      ownerState={ownerState}
      {...other}
    >
      {avatar && (
        <CardHeaderAvatar className={'CardHeader-Avatar'} ownerState={ownerState}>
          {avatar}
        </CardHeaderAvatar>
      )}

      <CardHeaderContent className={'CardHeader-Content'} ownerState={ownerState}>
        {title}
        {subheader}
      </CardHeaderContent>
      {action && (
        <CardHeaderAction className={'CardHeader-Action'} ownerState={ownerState}>
          {action}
        </CardHeaderAction>
      )}
    </CardHeaderRoot>
  );
});

CardHeader.displayName = 'CardHeader';

export default CardHeader;
