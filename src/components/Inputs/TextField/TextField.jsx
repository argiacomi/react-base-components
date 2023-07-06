import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling } from '@styles';
import { useId } from '@components/lib';
import { FormControl, FormHelperText } from '../Form';
import Input, { FilledInput, InputLabel, OutlinedInput } from '../Input';
import Select from '../Select';

const variantComponent = {
  standard: Input,
  filled: FilledInput,
  outlined: OutlinedInput
};

const TextFieldRoot = styled(FormControl)(({ ownerState }) => ownerState.cssStyles);

const TextField = React.forwardRef((props, ref) => {
  const {
    autoComplete,
    autoFocus = false,
    children,
    className,
    color = 'primary',
    defaultValue,
    disabled = false,
    error = false,
    fullWidth = false,
    helperText,
    id: idOverride,
    inputProps,
    inputRef,
    label,
    maxRows,
    minRows,
    multiline = false,
    name,
    onBlur,
    onChange,
    onClick,
    onFocus,
    placeholder,
    required = false,
    rows,
    select = false,
    slotProps = {},
    type,
    value,
    variant = 'outlined',
    ...otherProps
  } = props;

  const { cssStyles } = extractStyling(otherProps);

  const ownerState = {
    ...props,
    autoFocus,
    cssStyles,
    color,
    disabled,
    error,
    fullWidth,
    multiline,
    required,
    select,
    variant
  };

  if (!import.meta.env.PROD) {
    if (select && !children) {
      console.error(`'children' must be passed when using the 'TextField' component with 'select'`);
    }
  }

  const InputMore = {};

  if (variant === 'outlined') {
    if (slotProps.inputLabel && typeof slotProps.inputLabel?.shrink !== 'undefined') {
      InputMore.notched = slotProps.inputLabel?.shrink;
    }
    InputMore.label = label;
  }

  if (select) {
    if (!slotProps.select || !slotProps.select?.native) {
      InputMore.id = undefined;
    }
    InputMore['aria-describedby'] = undefined;
  }

  const id = useId(idOverride);
  const helperTextId = helperText && id ? `${id}-helper-text` : undefined;
  const inputLabelId = label && id ? `${id}-label` : undefined;
  const InputComponent = variantComponent[variant];

  const InputElement = (
    <InputComponent
      aria-describedby={helperTextId}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      defaultValue={defaultValue}
      fullWidth={fullWidth}
      multiline={multiline}
      name={name}
      rows={rows}
      maxRows={maxRows}
      minRows={minRows}
      type={type}
      value={value}
      id={id}
      inputRef={inputRef}
      onBlur={onBlur}
      onChange={onChange}
      onFocus={onFocus}
      onClick={onClick}
      placeholder={placeholder}
      inputProps={inputProps}
      {...InputMore}
      {...slotProps.input}
    />
  );

  return (
    <TextFieldRoot
      className={clsx('TextField-Root', className)}
      disabled={disabled}
      error={error}
      fullWidth={fullWidth}
      ref={ref}
      required={required}
      color={color}
      variant={variant}
      ownerState={ownerState}
      {...otherProps}
    >
      {label != null && label !== '' && (
        <InputLabel htmlFor={id} id={inputLabelId} {...slotProps.inputLabel}>
          {label}
        </InputLabel>
      )}

      {select ? (
        <Select
          aria-describedby={helperTextId}
          id={id}
          labelId={inputLabelId}
          value={value}
          input={InputElement}
          {...slotProps.select}
        >
          {children}
        </Select>
      ) : (
        InputElement
      )}

      {helperText && (
        <FormHelperText id={helperTextId} {...slotProps.formHelperText}>
          {helperText}
        </FormHelperText>
      )}
    </TextFieldRoot>
  );
});

TextField.displayName = 'TextField';

export default TextField;
