import React from 'react';
import clsx from 'clsx';
import styled from 'styled-components/macro';
import ButtonGroupContext, { buttonGroupClasses } from './ButtonGroupContext';

const ButtonGroupRoot = styled('div')(({ theme, ownerState }) => ({
  display: 'inline-flex',
  borderRadius: theme.rounded.base,
  flexDirection: ownerState.orientation === 'vertical' ? 'column' : 'row',
  ...(ownerState.variant === 'outlined'
    ? { boxShadow: theme.boxShadow[4] }
    : { filter: theme.dropShadow[4] }),
  ...(ownerState.disabled && {
    borderStyle: 'none',
    backgroundColor: theme.color.disabled.body,
    boxShadow: 'none',
    filter: 'none'
  }),
  ...(ownerState.disableElevation && {
    boxShadow: 'none',
    filter: 'none'
  }),
  ...(ownerState.fullWidth && {
    width: '100%'
  }),
  [`& .${buttonGroupClasses.grouped}`]: {
    minWidth: 0,
    borderRadius: theme.rounded.base,
    '&:active': { transform: 'scale(1)' },
    boxShadow: 'none',
    filter: ['text', 'colorText'].includes(ownerState.variant) ? theme.dropShadow[4] : 'none',
    '&:not(:first-of-type)': {
      ...{
        horizontal: {
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0
        },
        vertical: {
          borderTopRightRadius: 0,
          borderTopLeftRadius: 0
        }
      }[ownerState.orientation],
      ...{
        horizontal: {
          outlined: { marginLeft: -1 }
        },
        vertical: {
          outlined: { marginTop: -1 }
        }
      }[ownerState.orientation][ownerState.variant]
    },
    '&:not(:last-of-type)': {
      ...{
        horizontal: {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0
        },
        vertical: {
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 0
        }
      }[ownerState.orientation],
      ...{
        horizontal: {
          outlined: { borderRightColor: 'transparent' },
          text: {
            borderRight: `1px solid ${theme.alpha.add(theme.color.gray[500], 0.5)}`,
            [`&.${buttonGroupClasses.disabled}`]: {
              borderRight: `1px solid ${theme.color.divider}`
            }
          },
          colorText: {
            borderRight: `1px solid ${theme.alpha.add(theme.color.gray[500], 0.5)}`,
            [`&.${buttonGroupClasses.disabled}`]: {
              borderRight: `1px solid ${theme.color.divider}`
            }
          },
          filled: {
            borderRight: `1px solid ${theme.alpha.add(theme.color.gray[500], 0.5)}`,
            [`&.${buttonGroupClasses.disabled}`]: {
              borderRight: `1px solid ${theme.color.divider}`
            }
          }
        },
        vertical: {
          outlined: { borderBottomColor: 'transparent' },
          text: {
            borderBottom: `1px solid ${theme.alpha.add(theme.color.gray[500], 0.5)}`,
            [`&.${buttonGroupClasses.disabled}`]: {
              borderBottom: `1px solid ${theme.color.divider}`
            }
          },
          colorText: {
            borderBottom: `1px solid ${theme.alpha.add(theme.color.gray[500], 0.5)}`,
            [`&.${buttonGroupClasses.disabled}`]: {
              borderBottom: `1px solid ${theme.color.divider}`
            }
          },
          filled: {
            borderBottom: `1px solid ${theme.alpha.add(theme.color.gray[500], 0.5)}`,
            [`&.${buttonGroupClasses.disabled}`]: {
              borderBottom: `1px solid ${theme.color.divider}`
            }
          }
        }
      }[ownerState.orientation][ownerState.variant],
      ...(ownerState.variant === 'colorText' &&
        ownerState.color !== 'default' && {
          borderColor: theme.alpha.add(theme.color[ownerState.color][500], 0.5)
        }),
      ...(ownerState.variant === 'text' &&
        ownerState.color !== 'default' && {
          borderColor:
            ownerState.color === 'monochrome'
              ? theme.alpha.add(theme.color[ownerState.color][500], 0.5)
              : theme.color.divider
        }),
      ...(ownerState.variant === 'filled' &&
        ownerState.color !== 'default' && {
          borderColor: theme.color[ownerState.color][600]
        })
    },
    '&:hover': {
      ...{
        horizontal: {
          outlined: { borderRightColor: 'currentColor' }
        },
        vertical: {
          outlined: { borderBottomColor: 'currentColor' }
        }
      }[ownerState.orientation][ownerState.variant]
    }
  }
}));

const ButtonGroup = React.forwardRef((props, ref) => {
  const {
    children,
    className,
    color = 'primary',
    colorText = false,
    component = 'div',
    disabled = false,
    disableElevation = false,
    disableFocusRipple = false,
    disableRipple = false,
    fullWidth = false,
    orientation = 'horizontal',
    size = 'medium',
    variant = 'outlined',
    ...other
  } = props;

  const ownerState = {
    ...props,
    color,
    colorText,
    component,
    disabled,
    disableElevation,
    disableFocusRipple,
    disableRipple,
    fullWidth,
    orientation,
    size,
    variant
  };

  const classes = React.useMemo(
    () => ({
      grouped: buttonGroupClasses.grouped,
      disabled: disabled && buttonGroupClasses.disabled
    }),
    [disabled]
  );

  const context = React.useMemo(
    () => ({
      className: Object.values(classes),
      color,
      colorText,
      disabled,
      disableElevation,
      disableFocusRipple,
      disableRipple,
      fullWidth,
      size,
      variant
    }),
    [
      color,
      colorText,
      disabled,
      disableElevation,
      disableFocusRipple,
      disableRipple,
      fullWidth,
      size,
      variant,
      buttonGroupClasses
    ]
  );

  return (
    <ButtonGroupRoot
      as={component}
      role='group'
      className={clsx('ButtonGroup-Root', className)}
      ref={ref}
      ownerState={ownerState}
      {...other}
    >
      <ButtonGroupContext.Provider value={context}>{children}</ButtonGroupContext.Provider>
    </ButtonGroupRoot>
  );
});
ButtonGroup.displayName = 'ButtonGroup';

export default ButtonGroup;
