import * as React from 'react';
import { isFragment } from 'react-is';
import clsx from 'clsx';
import styled, { extractStyling, shouldForwardProp } from '@styles';
import {
  areEqualValues,
  capitalize,
  isFilled,
  ownerDocument,
  useControlled,
  useForkRef
} from '@components/lib';
import Menu from '@components/Navigation/Menu';
import {
  nativeSelectIconStyles,
  nativeSelectSelectStyles
} from '../NativeSelect/NativeSelectInput';
import selectClasses from './selectClasses';

const SelectSelect = styled('div', {
  name: 'Select',
  slot: 'Select'
})(
  nativeSelectSelectStyles,
  {
    [`&.${selectClasses.select}`]: {
      height: 'auto',
      minHeight: '1.4375em',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden'
    }
  },
  ({ ownerState }) => ({ ...ownerState.cssStyles })
);

const SelectIcon = styled('svg', {
  name: 'Select',
  slot: 'Icon'
})(nativeSelectIconStyles);

const SelectNativeInput = styled('input', {
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'classes',
  name: 'Select',
  slot: 'NativeInput'
})({
  bottom: 0,
  left: 0,
  position: 'absolute',
  opacity: 0,
  pointerEvents: 'none',
  width: '100%',
  boxSizing: 'border-box'
});

function isEmpty(display) {
  return display == null || (typeof display === 'string' && !display.trim());
}

const SelectInput = React.forwardRef((props, ref) => {
  const {
    'aria-describedby': ariaDescribedby,
    'aria-label': ariaLabel,
    autoFocus,
    autoWidth,
    children,
    className,
    defaultOpen,
    defaultValue,
    disabled,
    displayEmpty,
    error = false,
    IconComponent,
    inputRef: inputRefProp,
    labelId,
    slotProps = {},
    multiple,
    name,
    onBlur,
    onChange,
    onClose,
    onFocus,
    onOpen,
    open: openProp,
    readOnly,
    renderValue,
    SelectDisplayProps = {},
    tabIndex: tabIndexProp,
    type,
    value: valueProp,
    variant = 'standard',
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const [value, setValueState] = useControlled({
    controlled: valueProp,
    default: defaultValue,
    name: 'Select'
  });
  const [openState, setOpenState] = useControlled({
    controlled: openProp,
    default: defaultOpen,
    name: 'Select'
  });

  const inputRef = React.useRef(null);
  const displayRef = React.useRef(null);
  const [displayNode, setDisplayNode] = React.useState(null);
  const { current: isOpenControlled } = React.useRef(openProp != null);
  const [menuMinWidthState, setMenuMinWidthState] = React.useState();
  const handleRef = useForkRef(ref, inputRefProp);

  const handleDisplayRef = React.useCallback((node) => {
    displayRef.current = node;

    if (node) {
      setDisplayNode(node);
    }
  }, []);

  const anchorElement = displayNode?.parentNode;

  React.useImperativeHandle(
    handleRef,
    () => ({
      focus: () => {
        displayRef.current.focus();
      },
      node: inputRef.current,
      value
    }),
    [value]
  );

  React.useEffect(() => {
    if (defaultOpen && openState && displayNode && !isOpenControlled) {
      setMenuMinWidthState(autoWidth ? null : anchorElement.clientWidth);
      displayRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayNode, autoWidth]);
  React.useEffect(() => {
    if (autoFocus) {
      displayRef.current.focus();
    }
  }, [autoFocus]);

  React.useEffect(() => {
    if (!labelId) {
      return undefined;
    }
    const label = ownerDocument(displayRef.current).getElementById(labelId);
    if (label) {
      const handler = () => {
        if (getSelection().isCollapsed) {
          displayRef.current.focus();
        }
      };
      label.addEventListener('click', handler);
      return () => {
        label.removeEventListener('click', handler);
      };
    }
    return undefined;
  }, [labelId]);

  const update = (open, event) => {
    if (open) {
      if (onOpen) {
        onOpen(event);
      }
    } else if (onClose) {
      onClose(event);
    }

    if (!isOpenControlled) {
      setMenuMinWidthState(autoWidth ? null : anchorElement.clientWidth);
      setOpenState(open);
    }
  };

  const handleMouseDown = (event) => {
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();
    displayRef.current.focus();

    update(true, event);
  };

  const handleClose = (event) => {
    update(false, event);
  };

  const childrenArray = React.Children.toArray(children);

  const handleChange = (event) => {
    const child = childrenArray.find((childItem) => childItem.props.value === event.target.value);

    if (child === undefined) {
      return;
    }

    setValueState(child.props.value);

    if (onChange) {
      onChange(event, child);
    }
  };

  const handleItemClick = (child) => (event) => {
    let newValue;

    if (!event.currentTarget.hasAttribute('tabindex')) {
      return;
    }

    if (multiple) {
      newValue = Array.isArray(value) ? value.slice() : [];
      const itemIndex = value.indexOf(child.props.value);
      if (itemIndex === -1) {
        newValue.push(child.props.value);
      } else {
        newValue.splice(itemIndex, 1);
      }
    } else {
      newValue = child.props.value;
    }

    if (child.props.onClick) {
      child.props.onClick(event);
    }

    if (value !== newValue) {
      setValueState(newValue);

      if (onChange) {
        const nativeEvent = event.nativeEvent || event;
        const clonedEvent = new nativeEvent.constructor(nativeEvent.type, nativeEvent);

        Object.defineProperty(clonedEvent, 'target', {
          writable: true,
          value: { value: newValue, name }
        });
        onChange(clonedEvent, child);
      }
    }

    if (!multiple) {
      update(false, event);
    }
  };

  const handleKeyDown = (event) => {
    if (!readOnly) {
      const validKeys = [' ', 'ArrowUp', 'ArrowDown', 'Enter'];

      if (validKeys.indexOf(event.key) !== -1) {
        event.preventDefault();
        update(true, event);
      }
    }
  };

  const open = displayNode !== null && openState;

  const handleBlur = (event) => {
    if (!open && onBlur) {
      Object.defineProperty(event, 'target', { writable: true, value: { value, name } });
      onBlur(event);
    }
  };

  delete other['aria-invalid'];

  let display;
  let displaySingle;
  const displayMultiple = [];
  let computeDisplay = false;
  let foundMatch = false;

  if (isFilled({ value }) || displayEmpty) {
    if (renderValue) {
      display = renderValue(value);
    } else {
      computeDisplay = true;
    }
  }

  const items = childrenArray.map((child) => {
    if (!React.isValidElement(child)) {
      return null;
    }

    if (!import.meta.env.PROD) {
      if (isFragment(child)) {
        console.error(
          [
            "The Select component doesn't accept a Fragment as a child.",
            'Consider providing an array instead.'
          ].join('\n')
        );
      }
    }

    let selected;

    if (multiple) {
      if (!Array.isArray(value)) {
        throw new Error(
          'The `value` prop must be an array ' +
            'when using the `Select` component with `multiple`.'
        );
      }

      selected = value.some((v) => areEqualValues(v, child.props.value));
      if (selected && computeDisplay) {
        displayMultiple.push(child.props.children);
      }
    } else {
      selected = areEqualValues(value, child.props.value);
      if (selected && computeDisplay) {
        displaySingle = child.props.children;
      }
    }

    if (selected) {
      foundMatch = true;
    }

    return React.cloneElement(child, {
      'aria-selected': selected ? 'true' : 'false',
      onClick: handleItemClick(child),
      onKeyUp: (event) => {
        if (event.key === ' ') {
          event.preventDefault();
        }

        if (child.props.onKeyUp) {
          child.props.onKeyUp(event);
        }
      },
      role: 'option',
      selected,
      value: undefined,
      'data-value': child.props.value
    });
  });

  if (!import.meta.env.PROD) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      if (!foundMatch && !multiple && value !== '') {
        const values = childrenArray.map((child) => child.props.value);
        console.warn(
          [
            `You have provided an out-of-range value \`${value}\` for the select ${
              name ? `(name="${name}") ` : ''
            }component.`,
            "Consider providing a value that matches one of the available options or ''.",
            `The available values are ${
              values
                .filter((x) => x != null)
                .map((x) => `\`${x}\``)
                .join(', ') || '""'
            }.`
          ].join('\n')
        );
      }
    }, [foundMatch, childrenArray, multiple, name, value]);
  }

  if (computeDisplay) {
    if (multiple) {
      if (displayMultiple.length === 0) {
        display = null;
      } else {
        display = displayMultiple.reduce((output, child, index) => {
          output.push(child);
          if (index < displayMultiple.length - 1) {
            output.push(', ');
          }
          return output;
        }, []);
      }
    } else {
      display = displaySingle;
    }
  }

  let menuMinWidth = menuMinWidthState;

  if (!autoWidth && isOpenControlled && displayNode) {
    menuMinWidth = anchorElement.clientWidth;
  }

  let tabIndex;
  if (typeof tabIndexProp !== 'undefined') {
    tabIndex = tabIndexProp;
  } else {
    tabIndex = disabled ? null : 0;
  }

  const buttonId = SelectDisplayProps.id || (name ? `component-select-${name}` : undefined);

  const ownerState = {
    ...props,
    cssStyles,
    variant,
    value,
    open,
    error
  };

  const classes = {
    select: [
      selectClasses.select,
      capitalize(variant),
      ownerState.disabled && selectClasses.disabled,
      ownerState.multiple && selectClasses.multiple,
      ownerState.error && selectClasses.error
    ],
    icon: [
      selectClasses.icon,
      ownerState.open && selectClasses.iconOpen,
      ownerState.disabled && selectClasses.disabled
    ],
    nativeInput: [selectClasses.nativeInput]
  };

  return (
    <React.Fragment>
      <SelectSelect
        ref={handleDisplayRef}
        tabIndex={tabIndex}
        role='button'
        aria-disabled={disabled ? 'true' : undefined}
        aria-expanded={open ? 'true' : 'false'}
        aria-haspopup='listbox'
        aria-label={ariaLabel}
        aria-labelledby={[labelId, buttonId].filter(Boolean).join(' ') || undefined}
        aria-describedby={ariaDescribedby}
        onKeyDown={handleKeyDown}
        onMouseDown={disabled || readOnly ? null : handleMouseDown}
        onBlur={handleBlur}
        onFocus={onFocus}
        {...SelectDisplayProps}
        ownerState={ownerState}
        className={clsx(SelectDisplayProps.className, classes.select, className)}
        id={buttonId}
      >
        {isEmpty(display) ? <span className='notranslate'>&#8203;</span> : display}
      </SelectSelect>
      <SelectNativeInput
        aria-invalid={error}
        value={Array.isArray(value) ? value.join(',') : value}
        name={name}
        ref={inputRef}
        aria-hidden
        onChange={handleChange}
        tabIndex={-1}
        disabled={disabled}
        className={classes.nativeInput}
        autoFocus={autoFocus}
        ownerState={ownerState}
        {...other}
      />
      <SelectIcon as={IconComponent} className={classes.icon} ownerState={ownerState} />
      <Menu
        id={`menu-${name || ''}`}
        anchorEl={anchorElement}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        {...slotProps.menu}
        slotProps={{
          list: {
            'aria-labelledby': labelId,
            role: 'listbox',
            disableListWrap: true,
            ...slotProps.menu?.slotProps?.list
          },
          popper: {
            ...slotProps.menu?.slotProps?.paper,
            style: {
              minWidth: menuMinWidth,
              ...(slotProps.menu?.slotProps?.paper != null
                ? slotProps.menu?.slotProps?.paper?.style
                : null)
            }
          }
        }}
      >
        {items}
      </Menu>
    </React.Fragment>
  );
});

SelectInput.displayName = 'SelectInput';

export default SelectInput;
