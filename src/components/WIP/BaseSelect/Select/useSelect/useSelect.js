import useList from '@BaseList';
import React from 'react';
import {
  combineHooksSlotProps,
  useCompoundParent,
  useEnhancedEffect,
  useForkRef,
  useId
} from '@components/lib';
import { useButton } from '@components/Inputs/Button/ButtonBase';
import defaultOptionStringifier from './defaultOptionStringifier';
import selectReducer, { SelectActionTypes } from './selectReducer';

function preventDefault(event) {
  event.preventDefault();
}

function useSelect(props) {
  const {
    areOptionsEqual,
    buttonRef: buttonRefProp,
    defaultOpen = false,
    defaultValue: defaultValueProp,
    disabled = false,
    listboxId: listboxIdProp,
    listboxRef: listboxRefProp,
    multiple = false,
    onChange,
    onHighlightChange,
    onOpenChange,
    open: openProp,
    options: optionsParam,
    getOptionAsString = defaultOptionStringifier,
    value: valueProp
  } = props;

  const buttonRef = React.useRef(null);
  const handleButtonRef = useForkRef(buttonRefProp, buttonRef);

  const listboxRef = React.useRef(null);
  const listboxId = useId(listboxIdProp);

  let defaultValue;
  if (valueProp === undefined && defaultValueProp === undefined) {
    defaultValue = [];
  } else if (defaultValueProp !== undefined) {
    if (multiple) {
      defaultValue = defaultValueProp;
    } else {
      defaultValue = defaultValueProp == null ? [] : [defaultValueProp];
    }
  }

  const value = React.useMemo(() => {
    if (valueProp !== undefined) {
      if (multiple) {
        return valueProp;
      }

      return valueProp == null ? [] : [valueProp];
    }

    return undefined;
  }, [valueProp, multiple]);

  const { subitems, contextValue: compoundComponentContextValue } = useCompoundParent();

  const options = React.useMemo(() => {
    if (optionsParam != null) {
      return new Map(
        optionsParam.map((option, index) => [
          option.value,
          {
            value: option.value,
            label: option.label,
            disabled: option.disabled,
            ref: React.createRef(),
            id: `${listboxId}_${index}`
          }
        ])
      );
    }

    return subitems;
  }, [optionsParam, subitems, listboxId]);

  const handleListboxRef = useForkRef(listboxRefProp, listboxRef);

  const {
    getRootProps: getButtonRootProps,
    active: buttonActive,
    focusVisible: buttonFocusVisible,
    rootRef: mergedButtonRef
  } = useButton({
    disabled,
    rootRef: handleButtonRef
  });

  const optionValues = React.useMemo(() => Array.from(options.keys()), [options]);

  const getOptionByValue = React.useCallback(
    (valueToGet) => {
      if (areOptionsEqual !== undefined) {
        const similarValue = optionValues.find((optionValue) =>
          areOptionsEqual(optionValue, valueToGet)
        );
        return options.get(similarValue);
      }

      return options.get(valueToGet);
    },
    [options, areOptionsEqual, optionValues]
  );

  const isItemDisabled = React.useCallback(
    (valueToCheck) => {
      const option = getOptionByValue(valueToCheck);
      return option?.disabled ?? false;
    },
    [getOptionByValue]
  );

  const stringifyOption = React.useCallback(
    (valueToCheck) => {
      const option = getOptionByValue(valueToCheck);
      if (!option) {
        return '';
      }

      return getOptionAsString(option);
    },
    [getOptionByValue, getOptionAsString]
  );

  const controlledState = React.useMemo(
    () => ({
      selectedValues: value,
      open: openProp
    }),
    [value, openProp]
  );

  const getItemId = React.useCallback((itemValue) => options.get(itemValue)?.id, [options]);

  const handleSelectionChange = React.useCallback(
    (event, newValues) => {
      if (multiple) {
        onChange?.(event, newValues);
      } else {
        onChange?.(event, newValues[0] ?? null);
      }
    },
    [multiple, onChange]
  );

  const handleHighlightChange = React.useCallback(
    (event, newValue) => {
      onHighlightChange?.(event, newValue ?? null);
    },
    [onHighlightChange]
  );

  const handleStateChange = React.useCallback(
    (event, field, fieldValue) => {
      if (field === 'open') {
        onOpenChange?.(fieldValue);
        if (fieldValue === false && event?.type !== 'blur') {
          buttonRef.current?.focus();
        }
      }
    },
    [onOpenChange]
  );

  const useListParameters = {
    getInitialState: () => ({
      highlightedValue: null,
      selectedValues: defaultValue ?? [],
      open: defaultOpen
    }),
    getItemId,
    controlledProps: controlledState,
    itemComparer: areOptionsEqual,
    isItemDisabled,
    rootRef: mergedButtonRef,
    onChange: handleSelectionChange,
    onHighlightChange: handleHighlightChange,
    onStateChange: handleStateChange,
    reducerActionContext: React.useMemo(() => ({ multiple }), [multiple]),
    items: optionValues,
    getItemAsString: stringifyOption,
    selectionMode: multiple ? 'multiple' : 'single',
    stateReducer: selectReducer
  };

  const {
    dispatch,
    getRootProps: getListboxRootProps,
    contextValue: listContextValue,
    state: { open, highlightedValue: highlightedOption, selectedValues: selectedOptions },
    rootRef: mergedListRootRef
  } = useList(useListParameters);

  const createHandleButtonClick = (otherHandlers) => (event) => {
    otherHandlers?.onClick?.(event);
    if (!event.manualPrevented) {
      const action = {
        type: SelectActionTypes.buttonClick,
        event
      };

      dispatch(action);
    }
  };

  useEnhancedEffect(() => {
    if (highlightedOption != null) {
      const optionRef = getOptionByValue(highlightedOption)?.ref;
      if (!listboxRef.current || !optionRef?.current) {
        return;
      }

      const listboxClientRect = listboxRef.current.getBoundingClientRect();
      const optionClientRect = optionRef.current.getBoundingClientRect();

      if (optionClientRect.top < listboxClientRect.top) {
        listboxRef.current.scrollTop -= listboxClientRect.top - optionClientRect.top;
      } else if (optionClientRect.bottom > listboxClientRect.bottom) {
        listboxRef.current.scrollTop += optionClientRect.bottom - listboxClientRect.bottom;
      }
    }
  }, [highlightedOption, getOptionByValue]);

  const getOptionMetadata = React.useCallback(
    (optionValue) => getOptionByValue(optionValue),
    [getOptionByValue]
  );

  const getSelectTriggerProps = (otherHandlers) => {
    return {
      ...otherHandlers,
      onClick: createHandleButtonClick(otherHandlers),
      ref: mergedListRootRef,
      role: 'combobox',
      'aria-expanded': open,
      'aria-controls': listboxId
    };
  };

  const getButtonProps = (otherHandlers) => {
    const listboxAndButtonProps = combineHooksSlotProps(getButtonRootProps, getListboxRootProps);
    const combinedProps = combineHooksSlotProps(listboxAndButtonProps, getSelectTriggerProps);
    return combinedProps(otherHandlers);
  };

  const getListboxProps = (otherHandlers) => {
    return {
      ...otherHandlers,
      id: listboxId,
      role: 'listbox',
      'aria-multiselectable': multiple ? 'true' : undefined,
      ref: handleListboxRef,
      onMouseDown: preventDefault
    };
  };

  React.useDebugValue({
    selectedOptions,
    highlightedOption,
    open
  });

  const contextValue = React.useMemo(
    () => ({
      ...listContextValue,
      ...compoundComponentContextValue
    }),
    [listContextValue, compoundComponentContextValue]
  );

  let selectValue;
  if (props.multiple) {
    selectValue = selectedOptions;
  } else {
    selectValue = selectedOptions.length > 0 ? selectedOptions[0] : null;
  }

  return {
    buttonActive,
    buttonFocusVisible,
    buttonRef: mergedButtonRef,
    contextValue,
    disabled,
    dispatch,
    getButtonProps,
    getListboxProps,
    getOptionMetadata,
    listboxRef: mergedListRootRef,
    open,
    options: optionValues,
    value: selectValue,
    highlightedOption
  };
}

export default useSelect;
