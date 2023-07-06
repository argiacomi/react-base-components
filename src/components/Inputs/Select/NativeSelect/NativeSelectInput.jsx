import * as React from 'react';
import clsx from 'clsx';
import { capitalize } from '@components/lib';
import styled from '@styles';

export const nativeSelectClasses = {
  root: 'NativeSelect-Root',
  select: 'NativeSelect-Select',
  icon: 'NativeSelect-Icon',
  disabled: 'Disabled',
  error: 'Error',
  iconOpen: 'IconOpen',
  multiple: 'Multiple'
};

export const nativeSelectSelectStyles = ({ ownerState, theme }) => ({
  MozAppearance: 'none',
  WebkitAppearance: 'none',
  userSelect: 'none',
  borderRadius: 0,
  cursor: 'pointer',
  '&:focus': {
    backgroundColor: theme.color.hover, //mode === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)'
    borderRadius: 0
  },
  '&::-ms-expand': {
    display: 'none'
  },
  [`&.${nativeSelectClasses.disabled}`]: {
    cursor: 'default'
  },
  '&[multiple]': {
    height: 'auto'
  },
  '&:not([multiple]) option, &:not([multiple]) optgroup': {
    backgroundColor: theme.color.background
  },
  '&&&': {
    paddingRight: 24,
    minWidth: 16
  },
  ...(ownerState.variant === 'filled' && {
    '&&&': {
      paddingRight: 32
    }
  }),
  ...(ownerState.variant === 'outlined' && {
    borderRadius: theme.rounded.md,
    '&:focus': {
      borderRadius: theme.rounded.md
    },
    '&&&': {
      paddingRight: 32
    }
  })
});

const NativeSelectSelect = styled('select', {
  name: 'NativeSelect',
  slot: 'Select'
})(nativeSelectSelectStyles);

export const nativeSelectIconStyles = ({ ownerState, theme }) => ({
  position: 'absolute',
  right: 0,
  top: 'calc(50% - .5em)',
  pointerEvents: 'none',
  color: theme.color.active,
  [`&.${nativeSelectClasses.disabled}`]: {
    color: theme.color.disabled
  },
  ...(ownerState.open && {
    transform: 'rotate(180deg)'
  }),
  ...(ownerState.variant === 'filled' && {
    right: 7
  }),
  ...(ownerState.variant === 'outlined' && {
    right: 7
  })
});

const NativeSelectIcon = styled('svg', {
  name: 'NativeSelect',
  slot: 'Icon'
})(nativeSelectIconStyles);

const NativeSelectInput = React.forwardRef((props, ref) => {
  const {
    className,
    disabled,
    error,
    IconComponent,
    inputRef,
    variant = 'standard',
    ...other
  } = props;

  const ownerState = {
    ...props,
    disabled,
    variant,
    error
  };

  const classes = {
    select: [
      nativeSelectClasses.select,
      capitalize(variant),
      ownerState.disabled && nativeSelectClasses.disabled,
      nativeSelectClasses.multiple && nativeSelectClasses.multiple,
      error && nativeSelectClasses.error
    ],
    icon: [
      nativeSelectClasses.icon,
      `icon${capitalize(variant)}`,
      ownerState.open && nativeSelectClasses.iconOpen,
      ownerState.disabled && nativeSelectClasses.disabled
    ]
  };

  return (
    <React.Fragment>
      <NativeSelectSelect
        ownerState={ownerState}
        className={clsx(classes.select, className)}
        disabled={disabled}
        ref={inputRef || ref}
        {...other}
      />
      {props.multiple ? null : (
        <NativeSelectIcon as={IconComponent} ownerState={ownerState} className={classes.icon} />
      )}
    </React.Fragment>
  );
});

NativeSelectInput.displayName = 'NativeSelectInput';

export default NativeSelectInput;
