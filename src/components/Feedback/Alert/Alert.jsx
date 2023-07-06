import React from 'react';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';
import { default as BaseIcon } from '@components/display/Icon';
import { IconButton } from '@components/inputs/Button';
import Paper from '@components/surfaces/Paper';
import CloseIcon from '@icons/Close';
import DangerOutlineIcon from '@icons/DangerOutline';
import InfoOutlinedIcon from '@icons/InfoOutlined';
import ReportProblemOutlinedIcon from '@icons/ReportProblemOutlined';
import SuccessOutlinedIcon from '@icons/SuccessOutlined';

export const alertClasses = {
  root: 'Alert-Root',
  action: 'Alert-Action',
  icon: 'Alert-Icon',
  message: 'Alert-Message'
};

const variantStyles = (theme, ownerState, colorProp) => {
  const colorVariants =
    theme.color.mode === 'light'
      ? {
          getColor: 600,
          getBackgroundColor: 300,
          opacity: 0.35
        }
      : {
          getColor: 600,
          getBackgroundColor: 500,
          opacity: 0.2
        };

  const color = colorProp === 'info' ? 'primary' : colorProp;

  return {
    standard: {
      color: theme.color[color][colorVariants.getColor],
      backgroundColor: theme.alpha.add(
        theme.color[color][colorVariants.getBackgroundColor],
        colorVariants.opacity
      ),
      [`& .${alertClasses.icon}`]: {
        color: theme.color[color].body
      }
    },
    outlined: {
      color: theme.color[color][colorVariants.getColor],
      border: `1px solid ${theme.color[color][colorVariants.getColor]}`,
      [`& .${alertClasses.icon}`]: { color: theme.color[color].body }
    },
    filled: {
      fontWeight: theme.text.weight.medium,
      backgroundColor:
        theme.color.mode === 'dark' ? theme.color[color][600] : theme.color[color].body,
      color: theme.color[color].text
    }
  }[ownerState.variant];
};

const AlertRoot = styled(Paper)(({ theme, ownerState }) => {
  const color = ownerState.color || ownerState.severity;

  return {
    ...theme.text.typography.body2,
    backgroundColor: 'transparent',
    display: 'flex',
    padding: `${theme.spacing(0.75)} ${theme.spacing(2)}`,
    ...(color && variantStyles(theme, ownerState, color)),
    ...ownerState.cssStyles
  };
});

const AlertIcon = styled('div')(({ theme }) => ({
  marginRight: theme.spacing(1.5),
  padding: `${theme.spacing(1)} ${theme.spacing(0)}`,
  display: 'flex',
  fontSize: theme.spacing(3),
  opacity: 0.9
}));

const AlertMessage = styled('div')(({ theme }) => ({
  padding: `${theme.spacing(1)} ${theme.spacing(0)}`,
  minWidth: theme.spacing(0),
  overflow: 'auto'
}));

const AlertAction = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  padding: `${theme.spacing(0.5)} ${theme.spacing(0)} ${theme.spacing(0)} ${theme.spacing(2)}`,
  marginLeft: 'auto',
  marginRight: `-${theme.spacing(1)}`
}));

const Icon = styled(BaseIcon)({
  stroke: 'currentcolor',
  fill: 'none'
});

const defaultIconMapping = {
  success: <SuccessOutlinedIcon size='inherit' />,
  warning: <ReportProblemOutlinedIcon size='inherit' />,
  danger: <DangerOutlineIcon size='inherit' />,
  info: <InfoOutlinedIcon size='inherit' />
};

const Alert = React.forwardRef((props, ref) => {
  const {
    action,
    children,
    closeText = 'Close',
    color,
    icon,
    iconMapping = defaultIconMapping,
    onClose,
    role = 'alert',
    severity = 'success',
    slots = {},
    slotProps = {},
    variant = 'standard',
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = {
    ...props,
    cssStyles,
    color,
    severity,
    variant
  };

  const AlertRootComponent = slots.root ?? AlertRoot;
  const AlertCloseButton = slots.closeButton ?? IconButton;
  const AlertCloseIcon = slots.closeIcon ?? CloseIcon;

  const closeButtonProps = slotProps.closeButton;
  const closeIconProps = slotProps.closeIcon;

  const alertRootProps = useSlotProps({
    elementType: AlertRootComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: ref
    },
    ownerState,
    className: alertClasses.root
  });

  return (
    <AlertRootComponent role={role} elevation={0} {...alertRootProps}>
      {icon !== false ? (
        <AlertIcon ownerState={ownerState} className={alertClasses.icon}>
          {icon || iconMapping[severity] || defaultIconMapping[severity]}
        </AlertIcon>
      ) : null}
      <AlertMessage ownerState={ownerState} className={alertClasses.message}>
        {children}
      </AlertMessage>
      {action != null ? (
        <AlertAction ownerState={ownerState} className={alertClasses.action}>
          {action}
        </AlertAction>
      ) : null}
      {action == null && onClose ? (
        <AlertAction ownerState={ownerState} className={alertClasses.action}>
          <AlertCloseButton
            size='small'
            aria-label={closeText}
            title={closeText}
            color='inherit'
            onClick={onClose}
            {...closeButtonProps}
          >
            <AlertCloseIcon size='small' {...closeIconProps} />
          </AlertCloseButton>
        </AlertAction>
      ) : null}
    </AlertRootComponent>
  );
});

Alert.displayName = 'Alert';

export default Alert;
