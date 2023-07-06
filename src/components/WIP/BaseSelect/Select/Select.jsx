import React from 'react';
import { useForkRef, useSlotProps } from '@components/lib';
import Popper from '@components/utils/popper';
import useSelect from './useSelect';
import SelectProvider from './useSelect/SelectProvider';
import defaultOptionStringifier from './useSelect/defaultOptionStringifier';

export const selectClasses = {
  root: 'Select-Root',
  list: 'Select-List',
  popper: 'Select-Popper',
  active: 'Active',
  disabled: 'Disabled',
  focusVisible: 'FocusVisible',
  expanded: 'Expanded'
};

function defaultRenderValue(selectedOptions) {
  if (Array.isArray(selectedOptions)) {
    return <React.Fragment>{selectedOptions.map((o) => o.label).join(', ')}</React.Fragment>;
  }

  return selectedOptions?.label ?? '';
}

function defaultFormValueProvider(selectedOption) {
  if (Array.isArray(selectedOption)) {
    if (selectedOption.length === 0) {
      return '';
    }

    if (
      selectedOption.every(
        (o) =>
          typeof o.value === 'string' || typeof o.value === 'number' || typeof o.value === 'boolean'
      )
    ) {
      return selectedOption.map((o) => String(o.value));
    }

    return JSON.stringify(selectedOption.map((o) => o.value));
  }

  if (selectedOption?.value == null) {
    return '';
  }

  if (typeof selectedOption.value === 'string' || typeof selectedOption.value === 'number') {
    return selectedOption.value;
  }

  return JSON.stringify(selectedOption.value);
}

const Select = React.forwardRef((props, ref) => {
  const {
    areOptionsEqual,
    autoFocus,
    children,
    defaultValue,
    defaultListboxOpen = false,
    disabled: disabledProp,
    getSerializedValue = defaultFormValueProvider,
    listboxId,
    listboxOpen: listboxOpenProp,
    multiple = false,
    name,
    onChange,
    onListboxOpenChange,
    getOptionAsString = defaultOptionStringifier,
    renderValue: renderValueProp,
    slotProps = {},
    slots = {},
    value: valueProp,
    ...other
  } = props;

  const renderValue = (option) => {
    return renderValueProp ? renderValueProp(option) : defaultRenderValue(option);
  };

  const [buttonDefined, setButtonDefined] = React.useState(false);
  const buttonRef = React.useRef(null);
  const listboxRef = React.useRef(null);

  const Button = slots.root ?? 'button';
  const ListboxRoot = slots.listbox ?? 'ul';
  const PopperComponent = slots.popper ?? Popper;

  const handleButtonRefChange = React.useCallback((element) => {
    setButtonDefined(element != null);
  }, []);

  const handleButtonRef = useForkRef(ref, buttonRef, handleButtonRefChange);

  React.useEffect(() => {
    if (autoFocus) {
      buttonRef.current.focus();
    }
  }, [autoFocus]);

  const {
    buttonActive,
    buttonFocusVisible,
    contextValue,
    disabled,
    getButtonProps,
    getListboxProps,
    getOptionMetadata,
    value,
    open
  } = useSelect({
    areOptionsEqual,
    buttonRef: handleButtonRef,
    defaultOpen: defaultListboxOpen,
    defaultValue,
    disabled: disabledProp,
    listboxId,
    multiple,
    open: listboxOpenProp,
    onChange,
    onOpenChange: onListboxOpenChange,
    getOptionAsString,
    value: valueProp
  });

  const ownerState = {
    ...props,
    active: buttonActive,
    defaultListboxOpen,
    disabled,
    focusVisible: buttonFocusVisible,
    open,
    multiple,
    renderValue,
    value
  };

  const classes = {
    root: [
      selectClasses.root,
      ownerState.disabled && selectClasses.disabled,
      ownerState.focusVisible && selectClasses.focusVisible,
      ownerState.active && selectClasses.active,
      ownerState.open && selectClasses.expanded
    ],
    listbox: [selectClasses.list, ownerState.disabled && selectClasses.disabled],
    popper: [selectClasses.popper]
  };

  const buttonProps = useSlotProps({
    elementType: Button,
    getSlotProps: getButtonProps,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    ownerState,
    className: classes.root
  });

  const listboxProps = useSlotProps({
    elementType: ListboxRoot,
    getSlotProps: getListboxProps,
    externalSlotProps: slotProps.listbox,
    additionalProps: {
      ref: listboxRef
    },
    ownerState,
    className: classes.listbox
  });

  const popperProps = useSlotProps({
    elementType: PopperComponent,
    externalSlotProps: slotProps.popper,
    additionalProps: {
      anchorEl: buttonRef.current,
      keepMounted: true,
      open,
      placement: 'bottom-start',
      role: undefined
    },
    ownerState,
    className: classes.popper
  });

  let selectedOptionsMetadata;
  if (multiple) {
    selectedOptionsMetadata = value.map((v) => getOptionMetadata(v)).filter((o) => o !== undefined);
  } else {
    selectedOptionsMetadata = getOptionMetadata(value) ?? null;
  }

  return (
    <React.Fragment>
      <Button {...buttonProps}>{renderValue(selectedOptionsMetadata)}</Button>
      {buttonDefined && (
        <PopperComponent {...popperProps}>
          <ListboxRoot {...listboxProps}>
            <SelectProvider value={contextValue}>{children}</SelectProvider>
          </ListboxRoot>
        </PopperComponent>
      )}

      {name && (
        <input type='hidden' name={name} value={getSerializedValue(selectedOptionsMetadata)} />
      )}
    </React.Fragment>
  );
});

Select.displayName = 'Select';

export default Select;
