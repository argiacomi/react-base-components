import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling } from '@styles';
import { useForkRef, useSlotProps } from '@components/lib';
import useTab from './useTab';
import { ButtonBase } from '@components/inputs/button';

export const tabClasses = {
  root: 'Tab-Root',
  iconWrapper: 'Tab-IconWrapper',
  labelIcon: 'Tab-LabelIcon',
  selected: 'Selected',
  disabled: 'Disabled',
  fullWidth: 'FullWidth',
  wrapped: 'Wrapped'
};

const TabRoot = styled(ButtonBase)(({ theme, ownerState }) => ({
  ...theme.text.typography.button,
  maxWidth: 360,
  minWidth: 90,
  position: 'relative',
  minHeight: 48,
  flexShrink: 0,
  padding: '12px 16px',
  overflow: 'hidden',
  whiteSpace: 'normal',
  textAlign: 'center',
  ...(ownerState.label && {
    flexDirection:
      ownerState.iconPosition === 'top' || ownerState.iconPosition === 'bottom' ? 'column' : 'row'
  }),
  lineHeight: 1.25,
  ...(ownerState.icon &&
    ownerState.label && {
      minHeight: 72,
      paddingTop: 9,
      paddingBottom: 9,
      [`& > .${tabClasses.iconWrapper}`]: {
        ...(ownerState.iconPosition === 'top' && {
          marginBottom: 6
        }),
        ...(ownerState.iconPosition === 'bottom' && {
          marginTop: 6
        }),
        ...(ownerState.iconPosition === 'start' && {
          marginRight: theme.spacing(1)
        }),
        ...(ownerState.iconPosition === 'end' && {
          marginLeft: theme.spacing(1)
        })
      }
    }),
  ...(ownerState.textColor === 'inherit' && {
    color: 'inherit',
    opacity: 0.6,
    [`&.${tabClasses.selected}`]: {
      opacity: 1
    },
    [`&.${tabClasses.disabled}`]: {
      opacity: 0.38
    }
  }),
  ...(ownerState.textColor === 'primary' && {
    color: theme.color.text.secondary,
    [`&.${tabClasses.selected}`]: {
      color: theme.color.primary.body
    },
    [`&.${tabClasses.disabled}`]: {
      color: theme.color.disabled.text
    }
  }),
  ...(ownerState.textColor === 'secondary' && {
    color: theme.color.text.secondary,
    [`&.${tabClasses.selected}`]: {
      color: theme.color.secondary.body
    },
    [`&.${tabClasses.disabled}`]: {
      color: theme.color.disabled.text
    }
  }),
  ...(ownerState.fullWidth && {
    flexShrink: 1,
    flexGrow: 1,
    flexBasis: 0,
    maxWidth: 'none'
  }),
  ...(ownerState.wrapped && {
    fontSize: theme.spacing(3 / 2)
  }),
  ...ownerState.cssStyles
}));

const Tab = React.forwardRef((props, ref) => {
  const {
    component = 'button',
    disableRipple = false,
    fullWidth,
    icon: iconProp,
    iconPosition = 'top',
    indicator,
    label,
    slotProps = {},
    slots = {},
    textColor = 'inherit',
    wrapped = false,
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const tabRef = React.useRef();
  const handleRef = useForkRef(tabRef, ref);

  const { active, disabled, highlighted, selected, getRootProps } = useTab({
    ...props,
    rootRef: handleRef
  });

  const ownerState = {
    ...props,
    active,
    cssStyles,
    disabled,
    disableRipple,
    fullWidth,
    highlighted,
    icon: !!iconProp,
    iconPosition,
    label: !!label,
    selected,
    textColor,
    wrapped
  };

  const classes = {
    root: [
      tabClasses.root,
      ownerState.selected && tabClasses.selected,
      ownerState.disabled && tabClasses.disabled,
      ownerState.icon && ownerState.label && tabClasses.labelIcon,
      ownerState.fullWidth && tabClasses.fullWidth,
      ownerState.wrapped && tabClasses.wrapped
    ],
    iconWrapper: tabClasses.iconWrapper
  };

  const icon =
    iconProp && label && React.isValidElement(iconProp)
      ? React.cloneElement(iconProp, {
          className: clsx(classes.iconWrapper, iconProp.props.className)
        })
      : iconProp;

  const TabComponent = slots.root ?? TabRoot;
  const tabProps = useSlotProps({
    elementType: TabComponent,
    getSlotProps: getRootProps,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      disabled: disabled,
      disableRipple: disableRipple,
      ref: ref
    },
    ownerState,
    className: classes.root
  });

  return (
    <TabComponent component={component} {...tabProps}>
      {iconPosition === 'top' || iconPosition === 'start' ? (
        <React.Fragment>
          {icon}
          {label}
        </React.Fragment>
      ) : (
        <React.Fragment>
          {label}
          {icon}
        </React.Fragment>
      )}

      {indicator}
    </TabComponent>
  );
});

Tab.displayName = 'Tab';

export default Tab;
