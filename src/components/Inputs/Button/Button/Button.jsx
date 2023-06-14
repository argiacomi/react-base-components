import React from 'react';
import { styled } from '@styles';
import clsx from 'clsx';
import { mergeProps } from '@component/utils';
import ButtonBase from '../ButtonBase/ButtonBase';
import { Icon } from '@components/display';
import ButtonGroupContext from './ButtonGroupContext';

const baseStyles = (theme) => ({
  fontFamily: 'inherit',
  borderRadius: theme.rounded.md,
  transition: theme.transition.create(
    ['color', 'background-color', 'border-color', 'text-decoration-color', 'fill', 'stroke'],
    { duration: theme.transition.duration.shortest }
  ),
  fontWeight: theme.text.weight.bold,
  width: 'auto',
  overflow: 'hidden',
  '&:active': { transform: 'scale(0.95)' }
});

const sizeStyles = (theme, ownerState) =>
  ({
    mini: {
      minWidth: `${theme.spacing(8)}`,
      padding: `${theme.spacing(0.25)} ${theme.spacing(1)}`,
      ...theme.text.size.sm
    },
    small: {
      minWidth: `${theme.spacing(8)}`,
      padding: `${theme.spacing(0.5)} ${theme.spacing(2)}`,
      ...theme.text.size.sm
    },
    medium: {
      minWidth: `${theme.spacing(10)}`,
      padding: `${theme.spacing(0.5)} ${theme.spacing(2)}`,
      ...theme.text.size.base
    },
    large: {
      minWidth: `${theme.spacing(12)}`,
      padding: `${theme.spacing(0.5)} ${theme.spacing(2.5)}`,
      ...theme.text.size.lg
    },
    jumbo: {
      minWidth: `${theme.spacing(16)}`,
      padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
      ...theme.text.size.xl
    },
    auto: {
      minWidth: 'auto',
      padding: `${theme.spacing(0.5)} ${theme.spacing(2)}`,
      ...theme.text.size.base
    }
  }[ownerState.size]);

const variantStyles = (theme, ownerState) =>
  ({
    text: {
      color: theme.color.mode === 'dark' ? theme.color.white : theme.color.black,
      backgroundColor: 'transparent',
      filter: theme.dropShadow[4],
      '&:hover': {
        color: theme.color[ownerState.color].body,
        backgroundColor: theme.alpha.add(theme.color[ownerState.color].body, 0.2)
      }
    },
    outlined: {
      color: theme.color[ownerState.color].body,
      backgroundColor: 'transparent',
      boxShadow: theme.boxShadow[4],
      borderColor: theme.color[ownerState.color].body,
      '&:hover': {
        backgroundColor: theme.alpha.add(theme.color[ownerState.color].body, 0.2)
      }
    },
    filled: {
      color: theme.color[ownerState.color].text,
      backgroundColor: theme.color[ownerState.color].body,
      boxShadow: theme.boxShadow[4],
      '&:hover': {
        backgroundColor: theme.alpha.add(theme.color[ownerState.color][600], 1)
      }
    },
    colorText: {
      color: theme.color[ownerState.color].body,
      backgroundColor: 'transparent',
      filter: theme.dropShadow[4],

      '&:hover': {
        backgroundColor: theme.alpha.add(theme.color[ownerState.color].body, 0.2)
      }
    }
  }[ownerState.variant]);

const disabledStyles = (theme, ownerState) =>
  ({
    text: {
      color: theme.alpha.add(theme.color.disabled.text, 0.6),
      boxShadow: 'none'
    },
    outlined: {
      color: theme.alpha.add(theme.color.disabled.text, 0.6),
      borderColor: theme.color.disabled.body,
      boxShadow: 'none'
    },
    filled: {
      color: theme.color.disabled.text,
      backgroundColor: theme.color.disabled.body
    },
    colorText: {
      color: theme.alpha.add(theme.color.disabled.text, 0.6)
    }
  }[ownerState.variant]);

const ButtonRoot = styled(ButtonBase)(({ theme, ownerState }) => {
  return {
    ...baseStyles(theme, ownerState),
    ...sizeStyles(theme, ownerState),
    ...(ownerState.color !== 'inherit'
      ? variantStyles(theme, ownerState)
      : {
          color: 'inherit',
          backgroundColor: 'transparent'
        }),
    ...(ownerState.variant === 'outlined' && {
      border: '1px solid'
    }),
    ...(ownerState.disabled && {
      boxShadow: 'none',
      filter: 'none',
      pointerEvents: 'none',
      ...disabledStyles(theme, ownerState)
    }),
    ...(ownerState.disableElevation && {
      boxShadow: 'none',
      filter: 'none'
    }),
    ...(ownerState.fullWidth && {
      width: '100%'
    })
  };
});

const ButtonIcon = styled('span')(({ ownerState }) => ({
  display: 'inherit',
  alignItems: 'inherit',
  justifyContent: 'inherit',
  fontSize: 'inherit',
  marginTop: 4,
  marginBottom: 4,
  marginLeft: ownerState.position === 'start' ? 0 : 10,
  marginRight: ownerState.position === 'start' ? 10 : 0,
  lineHeight: 'inherit',
  height: {
    mini: '0.75rem',
    small: '0.875rem',
    medium: '1rem',
    large: '1.125rem',
    jumbo: '1.25rem',
    auto: '1rem'
  }[ownerState.size],
  width: {
    mini: '0.75rem',
    small: '0.875rem',
    medium: '1rem',
    large: '1.125rem',
    jumbo: '1.25rem',
    auto: '1rem'
  }[ownerState.size]
}));

const Button = React.forwardRef((inProps, ref) => {
  const contextProps = React.useContext(ButtonGroupContext);
  const props = mergeProps(contextProps, inProps);

  const {
    children,
    className,
    classes,
    color = 'default',
    component = 'button',
    disabled = false,
    disableElevation = false,
    disableFocusRipple = false,
    endIcon: endIconProp,
    focusVisibleClassName,
    fullWidth = false,
    size = 'medium',
    startIcon: startIconProp,
    type,
    variant = 'text',
    ...other
  } = props;

  const ownerState = {
    ...props,
    color,
    component,
    disabled,
    disableElevation,
    disableFocusRipple,
    fullWidth,
    size,
    variant
  };

  const startIcon = startIconProp && (
    <ButtonIcon
      className={clsx('Button-StartIcon', classes?.startIcon)}
      ownerState={{ ...ownerState, position: 'start' }}
    >
      <Icon
        icon={startIconProp}
        size={
          {
            mini: '1.125rem',
            small: '1.25rem',
            medium: '1.375rem',
            large: '1.5rem',
            jumbo: '1.675rem',
            auto: 'auto'
          }[ownerState.size]
        }
        css={{ transition: 'none' }}
      />
    </ButtonIcon>
  );

  const endIcon = endIconProp && (
    <ButtonIcon
      className={clsx('Button-EndIcon', classes?.endIcon)}
      ownerState={{ ...ownerState, position: 'end' }}
    >
      <Icon
        icon={endIconProp}
        size={
          {
            mini: '1.125rem',
            small: '1.25rem',
            medium: '1.375rem',
            large: '1.5rem',
            jumbo: '1.675rem',
            auto: 'auto'
          }[ownerState.size]
        }
        css={{ transition: 'none' }}
      />
    </ButtonIcon>
  );

  return (
    <ButtonRoot
      className={clsx('Button-Root', className)}
      ownerState={ownerState}
      component={component}
      disabled={disabled}
      disableRipple={disableFocusRipple}
      focusVisibleClassName={clsx(classes?.focusVisible, focusVisibleClassName)}
      ref={ref}
      type={type}
      {...other}
      classes={classes}
    >
      {startIcon}
      {children}
      {endIcon}
    </ButtonRoot>
  );
});
Button.displayName = 'Button';

export default Button;
