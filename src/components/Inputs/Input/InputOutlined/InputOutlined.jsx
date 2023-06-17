import * as React from 'react';
import { styled } from '@styles';
import { formControlState, useFormControl } from '@components/Inputs/Form';
import NotchedOutline from './NotchedOutline';
import InputBase, {
  InputBaseRoot,
  InputBaseComponent,
  inputBaseClasses
} from '../InputBase/InputBase';

const outlinedInputClasses = {
  root: 'OutlinedInput-Root',
  notchedOutline: 'OutlinedInput-NotchedOutline',
  input: 'OutlinedInput-Input',
  focused: inputBaseClasses.focused,
  disabled: inputBaseClasses.disabled,
  error: inputBaseClasses.error
};

const OutlinedInputRoot = styled(InputBaseRoot)(({ theme, ownerState }) => {
  const borderColor =
    theme.color.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)';

  return {
    position: 'relative',
    borderRadius: theme.rounded.md,
    [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: theme.color.text.primary
    },
    // Reset on touch devices, it doesn't add specificity
    '@media (hover: none)': {
      [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
        borderColor: borderColor
      }
    },
    [`&.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: theme.color[ownerState.color].body,
      borderWidth: 2
    },
    [`&.${outlinedInputClasses.error} .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: theme.color.danger.body
    },
    [`&.${outlinedInputClasses.disabled} .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: theme.color.disabled.body
    },
    ...(ownerState.startAdornment && {
      paddingLeft: 14
    }),
    ...(ownerState.endAdornment && {
      paddingRight: 14
    }),
    ...(ownerState.multiline && {
      padding: '16.5px 14px',
      ...(ownerState.size === 'small' && {
        padding: '8.5px 14px'
      })
    })
  };
});

const NotchedOutlineRoot = styled(NotchedOutline)(({ theme }) => {
  const borderColor =
    theme.color.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)';
  return {
    borderColor: borderColor
  };
});

const OutlinedInputInput = styled(InputBaseComponent)(({ ownerState }) => ({
  padding: '16.5px 14px',
  ...(ownerState.size === 'small' && {
    padding: '8.5px 14px'
  }),
  ...(ownerState.multiline && {
    padding: 0
  }),
  ...(ownerState.startAdornment && {
    paddingLeft: 0
  }),
  ...(ownerState.endAdornment && {
    paddingRight: 0
  })
}));

const OutlinedInput = React.forwardRef((props, ref) => {
  const {
    fullWidth = false,
    inputComponent = 'input',
    label,
    multiline = false,
    notched,
    slots = {},
    type = 'text',
    ...other
  } = props;

  const formControl = useFormControl();
  const fcs = formControlState({
    props,
    formControl,
    states: ['required']
  });

  const ownerState = {
    ...props,
    color: fcs.color || 'primary',
    disabled: fcs.disabled,
    error: fcs.error,
    focused: fcs.focused,
    formControl: formControl,
    fullWidth,
    hiddenLabel: fcs.hiddenLabel,
    multiline,
    size: fcs.size,
    type
  };

  const classes = {
    root: [
      outlinedInputClasses.root,
      ownerState.focused && outlinedInputClasses.focused,
      ownerState.disabled && outlinedInputClasses.disabled,
      ownerState.error && outlinedInputClasses.error
    ],
    notchedOutline: outlinedInputClasses.notchedOutline,
    input: outlinedInputClasses.input
  };

  const RootSlot = slots.root ?? OutlinedInputRoot;
  const InputSlot = slots.input ?? OutlinedInputInput;

  return (
    <InputBase
      slots={{ root: RootSlot, input: InputSlot }}
      renderSuffix={(state) => (
        <NotchedOutlineRoot
          ownerState={ownerState}
          className={classes.notchedOutline}
          label={
            label != null && label !== '' && fcs.required ? (
              <React.Fragment>
                {label}
                &thinsp;{'*'}
              </React.Fragment>
            ) : (
              label
            )
          }
          notched={
            typeof notched !== 'undefined'
              ? notched
              : Boolean(state.startAdornment || state.filled || state.focused)
          }
        />
      )}
      fullWidth={fullWidth}
      inputComponent={inputComponent}
      multiline={multiline}
      ref={ref}
      type={type}
      {...other}
      classes={{
        ...classes,
        notchedOutline: null
      }}
    />
  );
});

OutlinedInput.displayName = 'OutlinedInput';

export default OutlinedInput;
