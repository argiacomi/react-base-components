import React from 'react';
import styled, { shouldForwardProp } from '@styles';
import { deepmerge } from '@components/lib';
import InputBase, {
  InputBaseRoot,
  InputBaseComponent,
  inputBaseClasses
} from '../InputBase/InputBase';

export const filledInputClasses = {
  root: 'FilledInput-Root',
  input: 'FilledInput-Input',
  focused: inputBaseClasses.focused,
  disabled: inputBaseClasses.disabled,
  error: inputBaseClasses.error
};

const FilledInputRoot = styled(InputBaseRoot, {
  shouldForwardProp: (prop) => shouldForwardProp(prop) || prop === 'classes',
  name: 'FilledInput',
  slot: 'Root'
})(({ theme, ownerState }) => {
  const light = theme.color.mode === 'light';
  const bottomLineColor = light ? 'rgba(0, 0, 0, 0.42)' : 'rgba(255, 255, 255, 0.7)';
  const backgroundColor = light ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.09)';
  const hoverBackground = light ? 'rgba(0, 0, 0, 0.09)' : 'rgba(255, 255, 255, 0.13)';
  const disabledBackground = light ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)';
  return {
    position: 'relative',
    backgroundColor: backgroundColor,
    borderTopLeftRadius: theme.rounded.md,
    borderTopRightRadius: theme.rounded.md,
    transition: theme.transition.create('background-color', {
      duration: theme.transition.duration.shorter,
      easing: theme.transition.easing.easeOut
    }),
    '&:hover': {
      backgroundColor: hoverBackground,
      '@media (hover: none)': {
        backgroundColor: backgroundColor
      }
    },
    [`&.${filledInputClasses.focused}`]: {
      backgroundColor: backgroundColor
    },
    [`&.${filledInputClasses.disabled}`]: {
      backgroundColor: disabledBackground
    },
    ...(!ownerState.disableUnderline && {
      '&:after': {
        borderBottom: `2px solid ${theme.color[ownerState.color || 'primary']?.body}`,
        left: 0,
        bottom: 0,
        content: '""',
        position: 'absolute',
        right: 0,
        transform: 'scaleX(0)',
        transition: theme.transition.create('transform', {
          duration: theme.transition.duration.shorter,
          easing: theme.transition.easing.easeOut
        }),
        pointerEvents: 'none'
      },
      [`&.${filledInputClasses.focused}:after`]: {
        transform: 'scaleX(1) translateX(0)'
      },
      [`&.${filledInputClasses.error}`]: {
        '&:before, &:after': {
          borderBottomColor: theme.color.danger.body
        }
      },
      '&:before': {
        borderBottom: `1px solid ${bottomLineColor}`,
        left: 0,
        bottom: 0,
        content: '"\\00a0"',
        position: 'absolute',
        right: 0,
        transition: theme.transition.create('border-bottom-color', {
          duration: theme.transition.duration.shorter
        }),
        pointerEvents: 'none' // Transparent to the hover style.
      },
      [`&:hover:not(.${filledInputClasses.disabled}, .${filledInputClasses.error}):before`]: {
        borderBottom: `1px solid ${theme.color.text.primary}`
      },
      [`&.${filledInputClasses.disabled}:before`]: {
        borderBottomStyle: 'dotted'
      }
    }),
    ...(ownerState.startAdornment && {
      paddingLeft: 12
    }),
    ...(ownerState.endAdornment && {
      paddingRight: 12
    }),
    ...(ownerState.multiline && {
      padding: '25px 12px 8px',
      ...(ownerState.size === 'small' && {
        paddingTop: 21,
        paddingBottom: 4
      }),
      ...(ownerState.hiddenLabel && {
        paddingTop: 16,
        paddingBottom: 17
      })
    })
  };
});

const InputFilledInput = styled(InputBaseComponent)(({ theme, ownerState }) => ({
  paddingTop: 25,
  paddingRight: 12,
  paddingBottom: 8,
  paddingLeft: 12,
  ...(!theme.vars && {
    '&:-webkit-autofill': {
      WebkitBoxShadow: theme.color.mode === 'light' ? null : '0 0 0 100px #266798 inset',
      WebkitTextFillColor: theme.color.mode === 'light' ? null : '#fff',
      caretColor: theme.color.mode === 'light' ? null : '#fff',
      borderTopLeftRadius: 'inherit',
      borderTopRightRadius: 'inherit'
    }
  }),
  ...(theme.vars && {
    '&:-webkit-autofill': {
      borderTopLeftRadius: 'inherit',
      borderTopRightRadius: 'inherit'
    },
    [theme.getColorSchemeSelector('dark')]: {
      '&:-webkit-autofill': {
        WebkitBoxShadow: '0 0 0 100px #266798 inset',
        WebkitTextFillColor: '#fff',
        caretColor: '#fff'
      }
    }
  }),
  ...(ownerState.size === 'small' && {
    paddingTop: 21,
    paddingBottom: 4
  }),
  ...(ownerState.hiddenLabel && {
    paddingTop: 16,
    paddingBottom: 17
  }),
  ...(ownerState.multiline && {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0
  }),
  ...(ownerState.startAdornment && {
    paddingLeft: 0
  }),
  ...(ownerState.endAdornment && {
    paddingRight: 0
  }),
  ...(ownerState.hiddenLabel &&
    ownerState.size === 'small' && {
      paddingTop: 8,
      paddingBottom: 9
    })
}));

const FilledInput = React.forwardRef((props, ref) => {
  const {
    components = {},
    disableUnderline,
    fullWidth = false,
    inputComponent = 'input',
    multiline = false,
    slotProps,
    slots = {},
    type = 'text',
    ...other
  } = props;

  const ownerState = {
    ...props,
    disableUnderline,
    fullWidth,
    inputComponent,
    multiline,
    type
  };

  const FilledInputComponentsProps = { root: { ownerState }, input: { ownerState } };

  const componentsProps = slotProps
    ? deepmerge(slotProps, FilledInputComponentsProps)
    : FilledInputComponentsProps;

  const RootSlot = slots.root ?? components.Root ?? FilledInputRoot;
  const InputSlot = slots.input ?? components.Input ?? InputFilledInput;

  const classes = {
    root: [
      filledInputClasses.root,
      ownerState.focused && filledInputClasses.focused,
      ownerState.disabled && filledInputClasses.disabled,
      ownerState.error && filledInputClasses.error
    ],
    input: filledInputClasses.input
  };

  return (
    <InputBase
      slots={{ root: RootSlot, input: InputSlot }}
      slotProps={componentsProps}
      fullWidth={fullWidth}
      inputComponent={inputComponent}
      multiline={multiline}
      ref={ref}
      type={type}
      {...other}
      classes={classes}
    />
  );
});

FilledInput.displayName = 'Input';

export default FilledInput;
