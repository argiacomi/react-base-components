import React from 'react';
import { styled } from '@styles';
import { deepmerge } from '@components/lib';
import InputBase, {
  InputBaseRoot,
  InputBaseComponent,
  inputBaseClasses
} from '../InputBase/InputBase';

const inputFilledClasses = {
  root: 'InputFilled-Root',
  input: 'InputFilled-Input',
  focused: inputBaseClasses.focused,
  disabled: inputBaseClasses.disabled,
  error: inputBaseClasses.error
};

const InputFilledRoot = styled(InputBaseRoot)(({ theme, ownerState }) => {
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
    [`&.${inputFilledClasses.focused}`]: {
      backgroundColor: backgroundColor
    },
    [`&.${inputFilledClasses.disabled}`]: {
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
      [`&.${inputFilledClasses.focused}:after`]: {
        transform: 'scaleX(1) translateX(0)'
      },
      [`&.${inputFilledClasses.error}`]: {
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
      [`&:hover:not(.${inputFilledClasses.disabled}, .${inputFilledClasses.error}):before`]: {
        borderBottom: `1px solid ${theme.color.text.primary}`
      },
      [`&.${inputFilledClasses.disabled}:before`]: {
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

const InputinputFilled = styled(InputBaseComponent)(({ theme, ownerState }) => ({
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

const InputFilled = React.forwardRef((props, ref) => {
  const {
    components = {},
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
    fullWidth,
    inputComponent,
    multiline,
    type
  };

  const inputFilledComponentsProps = { root: { ownerState }, input: { ownerState } };

  const componentsProps = slotProps
    ? deepmerge(slotProps, inputFilledComponentsProps)
    : inputFilledComponentsProps;

  const RootSlot = slots.root ?? components.Root ?? InputFilledRoot;
  const InputSlot = slots.input ?? components.Input ?? InputinputFilled;

  const classes = {
    root: [
      inputFilledClasses.root,
      ownerState.focused && inputFilledClasses.focused,
      ownerState.disabled && inputFilledClasses.disabled,
      ownerState.error && inputFilledClasses.error
    ],
    input: inputFilledClasses.input
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

InputFilled.displayName = 'Input';

export default InputFilled;
