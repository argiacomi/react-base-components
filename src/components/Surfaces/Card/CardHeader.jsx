import React from 'react';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';
import { Text } from '@components/display';

export const cardHeaderClasses = {
  root: 'CardHeader-Root',
  action: 'CardHeader-Action',
  avatar: 'CardHeader-Avatar',
  content: 'CardHeader-Content',
  subheader: 'CardHeader-Subheader',
  title: 'CardHeader-Title'
};

const CardHeaderRoot = styled('div')(({ theme, ownerState }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  ...ownerState.cssStyles
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
    component = 'div',
    disableText = false,
    slots = {},
    slotProps = {},
    subheader: subheaderProp,
    subheaderTextProps,
    title: titleProp,
    titleTextProps,
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = {
    ...props,
    cssStyles,
    disableText
  };

  const cardHeaderTitleProps = useSlotProps({
    externalSlotProps: { ...slotProps.title, ...titleTextProps },
    additionalProps: {
      variant: avatar ? 'body2' : 'h5',
      color: 'title.primary',
      component: 'span',
      display: 'block'
    },
    className: cardHeaderClasses.title
  });

  let title = slots.title || titleProp;
  if (title != null && title.type !== Text && !disableText) {
    title = <Text {...cardHeaderTitleProps}>{title}</Text>;
  }

  const cardHeaderSubheaderProps = useSlotProps({
    externalSlotProps: { ...slotProps.subheader, ...subheaderTextProps },
    additionalProps: {
      variant: avatar ? 'body2' : 'body1',
      color: 'text.secondary',
      component: 'span',
      display: 'block'
    },
    className: cardHeaderClasses.subheader
  });

  let subheader = slots.subheaderProp || subheaderProp;
  if (subheader != null && subheader.type !== Text && !disableText) {
    subheader = <Text {...cardHeaderSubheaderProps}>{subheader}</Text>;
  }

  const CardHeaderComponent = slots.root || CardHeaderRoot;
  const cardHeaderRootProps = useSlotProps({
    elementType: CardHeaderComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: ref
    },
    ownerState,
    className: cardHeaderClasses.root
  });

  return (
    <CardHeaderComponent as={component} {...cardHeaderRootProps}>
      {avatar && (
        <CardHeaderAvatar className={cardHeaderClasses.avatar} ownerState={ownerState}>
          {avatar}
        </CardHeaderAvatar>
      )}

      <CardHeaderContent className={cardHeaderClasses.content} ownerState={ownerState}>
        {title}
        {subheader}
      </CardHeaderContent>
      {action && (
        <CardHeaderAction className={cardHeaderClasses.action} ownerState={ownerState}>
          {action}
        </CardHeaderAction>
      )}
    </CardHeaderComponent>
  );
});

CardHeader.displayName = 'CardHeader';

export default CardHeader;
