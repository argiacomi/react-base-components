import React from 'react';
import styled, { shouldForwardProp } from '@styles';
import { deepmerge } from '@components/lib';
import InputBase, {
  inputBaseClasses,
  InputBaseComponent,
  InputBaseRoot
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
})(({ theme, ownerState }) => ({
  position: 'relative',
  backgroundColor: 'rgba(0, 0, 0, 0.06)',
  borderTopLeftRadius: theme.rounded.md,
  borderTopRightRadius: theme.rounded.md,
  transition: theme.transition.create('background-color', {
    duration: theme.transition.duration.shorter,
    easing: theme.transition.easing.easeOut
  }),
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.09)',
    '@media (hover: none)': {
      backgroundColor: 'rgba(0, 0, 0, 0.06)'
    }
  },
  [`&.${filledInputClasses.focused}`]: {
    backgroundColor: 'rgba(0, 0, 0, 0.06)'
  },
  [`&.${filledInputClasses.disabled}`]: {
    backgroundColor: 'rgba(0, 0, 0, 0.12)'
  },
  '@media (prefers-color-scheme: dark)': {
    backgroundColor: 'rgba(255, 255, 255, 0.09)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.13)'
    },
    [`&.${filledInputClasses.focused}`]: {
      backgroundColor: 'rgba(255, 255, 255, 0.09)'
    },
    [`&.${filledInputClasses.disabled}`]: {
      backgroundColor: 'rgba(255, 255, 255, 0.12)'
    }
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
      borderBottom: '1px solid rgba(0 0 0 0.42)',
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
    '@media (prefers-color-scheme: dark)': {
      '&:before': {
        borderBottom: '1px solid rgba(255 255 255 0.7)'
      }
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
}));

const InputFilledInput = styled(InputBaseComponent)(({ theme, ownerState }) => ({
  paddingTop: 25,
  paddingRight: 12,
  paddingBottom: 8,
  paddingLeft: 12,
  '&:-webkit-autofill': {
    borderTopLeftRadius: 'inherit',
    borderTopRightRadius: 'inherit'
  },
  '@media (prefers-color-scheme: dark)': {
    '&:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 100px rgb(38 103 152) inset',
      WebkitTextFillColor: theme.color.white,
      caretColor: theme.color.white
    }
  },
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
