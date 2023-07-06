import React from 'react';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';
import ButtonGroupContext from './ButtonGroupContext';

export const buttonGroupClasses = {
  root: 'ButtonGroup-Root',
  grouped: 'ButtonGroup-Grouped',
  disableElevation: 'DisableElevation',
  disabled: 'Disabled',
  fullWidth: 'FullWidth'
};

const ButtonGroupRoot = styled('div')(({ theme, ownerState }) => ({
  display: 'inline-flex',
  height: 'fit-content',
  width: 'fit-content',
  borderRadius: theme.rounded.base,
  flexDirection: ownerState.orientation === 'vertical' ? 'column' : 'row',
  boxShadow: ownerState.variant !== 'text' && theme.boxShadow[3],
  filter: ownerState.variant === 'filled' && theme.dropShadow[3],
  ...(ownerState.disabled && {
    borderStyle: 'none',
    backgroundColor: theme.color.disabled.body,
    boxShadow: 'none'
  }),
  ...(ownerState.disableElevation && {
    boxShadow: 'none'
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
          borderColor: theme.alpha.add(theme.color[ownerState.color].body, 0.5)
        }),
      ...(ownerState.variant === 'text' &&
        ownerState.color !== 'default' && {
          borderColor:
            ownerState.color === 'monochrome'
              ? theme.alpha.add(theme.color[ownerState.color].body, 0.5)
              : theme.color.divider
        }),
      ...(ownerState.variant === 'filled' &&
        ownerState.color !== 'default' && {
          borderColor: theme.color[ownerState.color]?.[600],
          ...(ownerState.color === 'monochrome' && { borderColor: theme.color.black })
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
  },
  ...ownerState.cssStyles
}));

const ButtonGroup = React.forwardRef((props, ref) => {
  const {
    children,
    color = 'primary',
    component: componentProp = 'div',
    disabled = false,
    disableElevation = false,
    disableFocusRipple = false,
    fullWidth = false,
    orientation = 'horizontal',
    size = 'medium',
    slots = {},
    slotProps = {},
    variant = 'outlined',
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = {
    ...props,
    color,
    cssStyles,
    disabled,
    disableElevation,
    disableFocusRipple,
    fullWidth,
    orientation,
    size,
    variant
  };

  const classes = React.useMemo(
    () => ({
      root: [
        buttonGroupClasses.root,
        ownerState.fullWidth && buttonGroupClasses.fullWidth,
        ownerState.disableElevation && buttonGroupClasses.disableElevation
      ],
      grouped: [buttonGroupClasses.grouped, ownerState.disabled && buttonGroupClasses.disabled]
    }),
    [ownerState.fullWidth, ownerState.disableElevation, ownerState.disabled]
  );

  const context = React.useMemo(
    () => ({
      className: classes.grouped,
      color,
      disabled,
      disableElevation,
      disableFocusRipple,
      fullWidth,
      size,
      variant
    }),
    [
      classes.grouped,
      color,
      disabled,
      disableElevation,
      disableFocusRipple,
      fullWidth,
      size,
      variant
    ]
  );

  const component = componentProp || 'div';
  const ButtonGroupComponent = slots.root || ButtonGroupRoot;

  const buttonGroupRootProps = useSlotProps({
    elementType: ButtonGroupComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      role: 'group',
      ref: ref
    },
    ownerState,
    className: classes.root
  });

  return (
    <ButtonGroupComponent as={component} {...buttonGroupRootProps}>
      <ButtonGroupContext.Provider value={context}>{children}</ButtonGroupContext.Provider>
    </ButtonGroupComponent>
  );
});
ButtonGroup.displayName = 'ButtonGroup';

export default ButtonGroup;
