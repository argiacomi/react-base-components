import React from 'react';
import clsx from 'clsx';
import { styled } from '@styles';
import { useControlled } from '@component/hooks';
import { ButtonBase, useFormControl } from '@components/inputs';

const switchBaseClasses = {
  root: 'SwitchBase-Root',
  checked: 'SwitchBase-Checked',
  disabled: 'SwitchBase-Disabled',
  input: 'SwitchBase-Input'
};

const SwitchBaseRoot = styled(ButtonBase)(({ theme, ownerState }) => ({
  padding: '.5rem',
  borderRadius: theme.rounded.full,
  ...(ownerState.disabled && {
    pointerEvents: 'none',
    cursor: 'default'
  }),
  ...(ownerState.edge === 'start' && {
    marginLeft: ownerState.size === 'small' ? '-.25rem' : '-.75rem'
  }),
  ...(ownerState.edge === 'end' && {
    marginRight: ownerState.size === 'small' ? '-.25rem' : '-.75rem'
  })
}));

const SwitchBaseInput = styled('input')({
  cursor: 'inherit',
  position: 'absolute',
  opacity: 0,
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  margin: 0,
  padding: 0,
  zIndex: 1
});

const SwitchBase = React.forwardRef((props, ref) => {
  const {
    autoFocus,
    checked: checkedProp,
    checkedIcon,
    className,
    defaultChecked,
    disabled: disabledProp,
    disableFocusRipple = false,
    edge = false,
    icon,
    id,
    inputProps,
    inputRef,
    name,
    onBlur,
    onChange,
    onFocus,
    readOnly,
    required = false,
    tabIndex,
    type,
    value,
    ...other
  } = props;

  const [checked, setCheckedState] = useControlled({
    controlled: checkedProp,
    default: Boolean(defaultChecked),
    name: 'SwitchBase',
    state: 'checked'
  });

  const formControl = useFormControl();

  const handleFocus = (event) => {
    if (onFocus) {
      onFocus(event);
    }

    if (formControl && formControl.onFocus) {
      formControl.onFocus(event);
    }
  };

  const handleBlur = (event) => {
    if (onBlur) {
      onBlur(event);
    }

    if (formControl && formControl.onBlur) {
      formControl.onBlur(event);
    }
  };

  const handleInputChange = (event) => {
    if (event.nativeEvent.defaultPrevented) {
      return;
    }

    const newChecked = event.target.checked;
    setCheckedState(newChecked);

    if (onChange) {
      onChange(event);
    }
  };

  let disabled = disabledProp;

  if (formControl) {
    if (typeof disabled === 'undefined') {
      disabled = formControl.disabled;
    }
  }

  const hasLabelFor = type === 'checkbox' || type === 'radio';

  const ownerState = {
    ...props,
    checked,
    disabled,
    disableFocusRipple,
    edge
  };

  const classes = {
    root: [
      switchBaseClasses.root,
      ownerState.checked && switchBaseClasses.checked,
      ownerState.sisabled && switchBaseClasses.disabled
    ],
    input: switchBaseClasses.input
  };

  return (
    <SwitchBaseRoot
      component='span'
      className={clsx(classes.root, props.classes.root, className)}
      centerRipple
      disableRipple={disableFocusRipple}
      disabled={disabled}
      tabIndex={null}
      role={undefined}
      onFocus={handleFocus}
      onBlur={handleBlur}
      ownerState={ownerState}
      ref={ref}
      {...other}
    >
      <SwitchBaseInput
        autoFocus={autoFocus}
        checked={checkedProp}
        defaultChecked={defaultChecked}
        className={clsx(classes.root, props.classes.input)}
        disabled={disabled}
        id={hasLabelFor ? id : undefined}
        name={name}
        onChange={handleInputChange}
        readOnly={readOnly}
        ref={inputRef}
        required={required}
        ownerState={ownerState}
        tabIndex={tabIndex}
        type={type}
        {...(type === 'checkbox' && value === undefined ? {} : { value })}
        {...inputProps}
      />
      {checked ? checkedIcon : icon}
    </SwitchBaseRoot>
  );
});
SwitchBase.displayName = 'SwitchBase';

export default SwitchBase;
