import * as React from 'react';
import clsx from 'clsx';
import styled, { extractStyling } from '@styles';
import useAutocomplete, { createFilterOptions } from './useAutocomplete';
import Popper from '@components/Utils/Popper';
import Chip from '@components/Display/Chip';
import { ListSubheader } from '@components/Display/List';
import Paper from '@components/Surfaces/Paper';
import IconButton from '../Button/IconButton/IconButton';
import { inputClasses, inputBaseClasses, filledInputClasses, outlinedInputClasses } from '../Input';
import { capitalize, useForkRef } from '@components/lib';
import ClearIcon from '@components/lib/icons/Close';
import ArrowDropDownIcon from '@components/lib/icons/ArrowDropDown';

export const autocompleteClasses = {
  root: 'Autocomplete-Root',
  inputRoot: 'Autocomplete-InputRoot',
  tag: 'Autocomplete-Tag',
  endAdornment: 'Autocomplete-EndAdornment',
  clearIndicator: 'Autocomplete-ClearIndicator',
  popupIndicator: 'Autocomplete-PopupIndicator',
  popper: 'Autocomplete-Popper',
  paper: 'Autocomplete-Paper',
  listbox: 'Autocomplete-List',
  loading: 'Autocomplete-Loading',
  noOptions: 'Autocomplete-NoOptions',
  option: 'Autocomplete-Option',
  groupLabel: 'Autocomplete-GroupLabel',
  groupUl: 'Autocomplete-GroupUl',
  expanded: 'Expanded',
  focused: 'Focused',
  fullWidth: 'FullWidth',
  hasClearIcon: 'HasClearIcon',
  hasPopupIcon: 'HasPopupIcon'
};

const AutocompleteRoot = styled('div', {
  name: 'Autocomplete',
  slot: 'Root'
})(({ ownerState }) => ({
  [`&.${autocompleteClasses.focused} .${autocompleteClasses.clearIndicator}`]: {
    visibility: 'visible'
  },
  /* Avoid double tap issue on iOS */
  '@media (pointer: fine)': {
    [`&:hover .${autocompleteClasses.clearIndicator}`]: {
      visibility: 'visible'
    }
  },
  ...(ownerState.fullWidth && {
    width: '100%'
  }),
  [`& .${autocompleteClasses.tag}`]: {
    margin: 3,
    maxWidth: 'calc(100% - 6px)',
    ...(ownerState.size === 'small' && {
      margin: 2,
      maxWidth: 'calc(100% - 4px)'
    })
  },
  [`& .${autocompleteClasses.inputRoot}`]: {
    flexWrap: 'wrap',
    [`.${autocompleteClasses.hasPopupIcon}&, .${autocompleteClasses.hasClearIcon}&`]: {
      paddingRight: 26 + 4
    },
    [`.${autocompleteClasses.hasPopupIcon}.${autocompleteClasses.hasClearIcon}&`]: {
      paddingRight: 52 + 4
    },
    [`& .${autocompleteClasses.input}`]: {
      width: 0,
      minWidth: 30
    }
  },
  [`& .${inputClasses.root}`]: {
    paddingBottom: 1,
    '& .Input-Input': {
      padding: '4px 4px 4px 0px'
    }
  },
  [`& .${inputClasses.root}.${inputBaseClasses.sizeSmall}`]: {
    [`& .${inputClasses.input}`]: {
      padding: '2px 4px 3px 0'
    }
  },
  [`& .${outlinedInputClasses.root}`]: {
    padding: 9,
    [`.${autocompleteClasses.hasPopupIcon}&, .${autocompleteClasses.hasClearIcon}&`]: {
      paddingRight: 26 + 4 + 9
    },
    [`.${autocompleteClasses.hasPopupIcon}.${autocompleteClasses.hasClearIcon}&`]: {
      paddingRight: 52 + 4 + 9
    },
    [`& .${autocompleteClasses.input}`]: {
      padding: '7.5px 4px 7.5px 5px'
    },
    [`& .${autocompleteClasses.endAdornment}`]: {
      right: 9
    }
  },
  [`& .${outlinedInputClasses.root}.${inputBaseClasses.sizeSmall}`]: {
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 6,
    [`& .${autocompleteClasses.input}`]: {
      padding: '2.5px 4px 2.5px 8px'
    }
  },
  [`& .${filledInputClasses.root}`]: {
    paddingTop: 19,
    paddingLeft: 8,
    [`.${autocompleteClasses.hasPopupIcon}&, .${autocompleteClasses.hasClearIcon}&`]: {
      paddingRight: 26 + 4 + 9
    },
    [`.${autocompleteClasses.hasPopupIcon}.${autocompleteClasses.hasClearIcon}&`]: {
      paddingRight: 52 + 4 + 9
    },
    [`& .${filledInputClasses.input}`]: {
      padding: '7px 4px'
    },
    [`& .${autocompleteClasses.endAdornment}`]: {
      right: 9
    }
  },
  [`& .${filledInputClasses.root}.${inputBaseClasses.sizeSmall}`]: {
    paddingBottom: 1,
    [`& .${filledInputClasses.input}`]: {
      padding: '2.5px 4px'
    }
  },
  [`& .${inputBaseClasses.hiddenLabel}`]: {
    paddingTop: 8
  },
  [`& .${filledInputClasses.root}.${inputBaseClasses.hiddenLabel}`]: {
    paddingTop: 0,
    paddingBottom: 0,
    [`& .${autocompleteClasses.input}`]: {
      paddingTop: 16,
      paddingBottom: 17
    }
  },
  [`& .${filledInputClasses.root}.${inputBaseClasses.hiddenLabel}.${inputBaseClasses.sizeSmall}`]: {
    [`& .${autocompleteClasses.input}`]: {
      paddingTop: 8,
      paddingBottom: 9
    }
  },
  [`& .${autocompleteClasses.input}`]: {
    flexGrow: 1,
    textOverflow: 'ellipsis',
    opacity: 0,
    ...(ownerState.inputFocused && {
      opacity: 1
    })
  },
  ...ownerState.cssStyles
}));

const AutocompleteEndAdornment = styled('div', {
  name: 'Autocomplete',
  slot: 'EndAdornment'
})({
  position: 'absolute',
  right: 0,
  top: 'calc(50% - 14px)'
});

const AutocompleteClearIndicator = styled(IconButton, {
  name: 'Autocomplete',
  slot: 'ClearIndicator'
})({
  marginRight: -2,
  padding: 4,
  visibility: 'hidden'
});

const AutocompletePopupIndicator = styled(IconButton, {
  name: 'Autocomplete',
  slot: 'PopupIndicator'
})(({ ownerState }) => ({
  padding: 2,
  marginRight: -2,
  ...(ownerState.popupOpen && {
    transform: 'rotate(180deg)'
  })
}));

const AutocompletePopper = styled(Popper, {
  name: 'Autocomplete',
  slot: 'Popper'
})(({ theme, ownerState }) => ({
  zIndex: theme.zIndex.modal,
  ...(ownerState.disablePortal && {
    position: 'absolute'
  })
}));

const AutocompletePaper = styled(Paper, {
  name: 'Autocomplete',
  slot: 'Paper'
})(({ theme }) => ({
  ...theme.text.typography.body1,
  overflow: 'auto'
}));

const AutocompleteLoading = styled('div', {
  name: 'Autocomplete',
  slot: 'Loading'
})(({ theme }) => ({
  color: theme.color.text.secondary,
  padding: '14px 16px'
}));

const AutocompleteNoOptions = styled('div', {
  name: 'Autocomplete',
  slot: 'NoOptions'
})(({ theme }) => ({
  color: theme.color.text.secondary,
  padding: '14px 16px'
}));

const AutocompleteListbox = styled('div', {
  name: 'Autocomplete',
  slot: 'Listbox'
})(({ theme }) => ({
  listStyle: 'none',
  margin: 0,
  padding: '8px 0',
  maxHeight: '40vh',
  overflow: 'auto',
  position: 'relative',
  [`& .${autocompleteClasses.option}`]: {
    minHeight: 48,
    display: 'flex',
    overflow: 'hidden',
    justifyContent: 'flex-start',
    alignItems: 'center',
    cursor: 'pointer',
    paddingTop: 6,
    boxSizing: 'border-box',
    outline: '0',
    WebkitTapHighlightColor: 'transparent',
    paddingBottom: 6,
    paddingLeft: 16,
    paddingRight: 16,
    [theme.breakpoints.up('sm')]: {
      minHeight: 'auto'
    },
    [`&.${autocompleteClasses.focused}`]: {
      backgroundColor: theme.color.hover,
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        backgroundColor: 'transparent'
      }
    },
    '&[aria-disabled="true"]': {
      opacity: theme.color.disabledOpacity,
      pointerEvents: 'none'
    },
    [`&.${autocompleteClasses.focusVisible}`]: {
      backgroundColor: theme.color.focus
    },
    '&[aria-selected="true"]': {
      backgroundColor: theme.alpha.add(theme.color.primary.body, theme.color.selectedOpacity),
      [`&.${autocompleteClasses.focused}`]: {
        backgroundColor: theme.alpha.add(
          theme.color.primary.body,
          theme.color.selectedOpacity + theme.color.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: theme.color.selected
        }
      },
      [`&.${autocompleteClasses.focusVisible}`]: {
        backgroundColor: theme.alpha.add(
          theme.color.primary.body,
          theme.color.selectedOpacity + theme.color.focusOpacity
        )
      }
    }
  }
}));

const AutocompleteGroupLabel = styled(ListSubheader, {
  name: 'Autocomplete',
  slot: 'GroupLabel'
})(({ theme }) => ({
  backgroundColor: theme.color.background,
  top: -8
}));

const AutocompleteGroupUl = styled('ul', {
  name: 'Autocomplete',
  slot: 'GroupUl'
})({
  padding: 0,
  [`& .${autocompleteClasses.option}`]: {
    paddingLeft: 24
  }
});

export { createFilterOptions };

const Autocomplete = React.forwardRef((props, ref) => {
  const {
    autoComplete = false,
    autoHighlight = false,
    autoSelect = false,
    blurOnSelect = false,
    ChipProps,
    className,
    clearIcon = <ClearIcon size='small' />,
    clearOnBlur = !props.freeSolo,
    clearOnEscape = false,
    clearText = 'Clear',
    closeText = 'Close',
    componentsProps = {},
    defaultValue = props.multiple ? [] : null,
    disableClearable = false,
    disableCloseOnSelect = false,
    disabled = false,
    disabledItemsFocusable = false,
    disableListWrap = false,
    disablePortal = false,
    filterOptions,
    filterSelectedOptions = false,
    forcePopupIcon = 'auto',
    freeSolo = false,
    fullWidth = false,
    getLimitTagsText = (more) => `+${more}`,
    getOptionDisabled,
    getOptionLabel = (option) => option.label ?? option,
    isOptionEqualToValue,
    groupBy,
    handleHomeEndKeys = !props.freeSolo,
    id: idProp,
    includeInputInList = false,
    inputValue: inputValueProp,
    limitTags = -1,
    ListboxComponent = 'ul',
    ListboxProps,
    loading = false,
    loadingText = 'Loading…',
    multiple = false,
    noOptionsText = 'No options',
    open,
    openOnFocus = false,
    openText = 'Open',
    options,
    PaperComponent = Paper,
    PopperComponent = Popper,
    popupIcon = <ArrowDropDownIcon />,
    readOnly = false,
    renderGroup: renderGroupProp,
    renderInput,
    renderOption: renderOptionProp,
    renderTags,
    selectOnFocus = !props.freeSolo,
    size = 'medium',
    slotProps = {},
    value: valueProp,
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const {
    getRootProps,
    getInputProps,
    getInputLabelProps,
    getPopupIndicatorProps,
    getClearProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    value,
    dirty,
    expanded,
    id,
    popupOpen,
    focused,
    focusedTag,
    anchorEl,
    setAnchorEl,
    inputValue,
    groupedOptions
  } = useAutocomplete({ ...props, componentName: 'Autocomplete' });

  const hasClearIcon = !disableClearable && !disabled && dirty && !readOnly;
  const hasPopupIcon = (!freeSolo || forcePopupIcon === true) && forcePopupIcon !== false;

  const { onMouseDown: handleInputMouseDown } = getInputProps();
  const { ref: externalListboxRef } = ListboxProps ?? {};
  const { ref: listboxRef, ...otherListboxProps } = getListboxProps();

  const combinedListboxRef = useForkRef(listboxRef, externalListboxRef);

  // If you modify this, make sure to keep the `AutocompleteOwnerState` type in sync.
  const ownerState = {
    ...props,
    autoComplete,
    autoHighlight,
    autoSelect,
    blurOnSelect,
    clearOnBlur,
    clearOnEscape,
    componentsProps,
    cssStyles,
    defaultValue,
    disableCloseOnSelect,
    disabledItemsFocusable,
    disableListWrap,
    disablePortal,
    expanded,
    filterOptions,
    filterSelectedOptions,
    focused,
    fullWidth,
    getOptionDisabled,
    handleHomeEndKeys,
    hasClearIcon,
    hasPopupIcon,
    idProp,
    includeInputInList,
    inputFocused: focusedTag === -1,
    inputValueProp,
    isOptionEqualToValue,
    open,
    openOnFocus,
    options,
    popupOpen,
    selectOnFocus,
    size,
    valueProp
  };

  const classes = {
    root: [
      autocompleteClasses.root,
      ownerState.expanded && autocompleteClasses.expanded,
      ownerState.focused && autocompleteClasses.focused,
      ownerState.fullWidth && autocompleteClasses.fullWidth,
      ownerState.hasClearIcon && autocompleteClasses.hasClearIcon,
      ownerState.hasPopupIcon && autocompleteClasses.hasPopupIcon
    ],
    inputRoot: [autocompleteClasses.inputRoot],
    input: [autocompleteClasses.input, ownerState.inputFocused && autocompleteClasses.inputFocused],
    tag: [autocompleteClasses.tag, `tagSize${capitalize(size)}`],
    endAdornment: [autocompleteClasses.endAdornment],
    clearIndicator: [autocompleteClasses.clearIndicator],
    popupIndicator: [
      autocompleteClasses.popupIndicator,
      ownerState.popupOpen && autocompleteClasses.popupIndicatorOpen
    ],
    popper: [
      autocompleteClasses.popper,
      ownerState.disablePortal && autocompleteClasses.popperDisablePortal
    ],
    paper: [autocompleteClasses.paper],
    listbox: [autocompleteClasses.listbox],
    loading: [autocompleteClasses.loading],
    noOptions: [autocompleteClasses.noOptions],
    option: [autocompleteClasses.option],
    groupLabel: [autocompleteClasses.groupLabel],
    groupUl: [autocompleteClasses.groupUl]
  };

  let startAdornment;

  if (multiple && value.length > 0) {
    const getCustomizedTagProps = (params) => ({
      className: classes.tag,
      disabled,
      ...getTagProps(params)
    });

    if (renderTags) {
      startAdornment = renderTags(value, getCustomizedTagProps, ownerState);
    } else {
      startAdornment = value.map((option, index) => (
        <Chip
          key={index}
          label={getOptionLabel(option)}
          size={size}
          {...getCustomizedTagProps({ index })}
          {...ChipProps}
        />
      ));
    }
  }

  if (limitTags > -1 && Array.isArray(startAdornment)) {
    const more = startAdornment.length - limitTags;
    if (!focused && more > 0) {
      startAdornment = startAdornment.splice(0, limitTags);
      startAdornment.push(
        <span className={classes.tag} key={startAdornment.length}>
          {getLimitTagsText(more)}
        </span>
      );
    }
  }

  const defaultRenderGroup = (params) => (
    <li key={params.key}>
      <AutocompleteGroupLabel
        className={classes.groupLabel}
        ownerState={ownerState}
        component='div'
      >
        {params.group}
      </AutocompleteGroupLabel>
      <AutocompleteGroupUl className={classes.groupUl} ownerState={ownerState}>
        {params.children}
      </AutocompleteGroupUl>
    </li>
  );

  const renderGroup = renderGroupProp || defaultRenderGroup;
  const defaultRenderOption = (props2, option) => <li {...props2}>{getOptionLabel(option)}</li>;
  const renderOption = renderOptionProp || defaultRenderOption;

  const renderListOption = (option, index) => {
    const optionProps = getOptionProps({ option, index });

    return renderOption({ ...optionProps, className: classes.option }, option, {
      selected: optionProps['aria-selected'],
      index,
      inputValue
    });
  };

  const clearIndicatorSlotProps = slotProps.clearIndicator;
  const paperSlotProps = slotProps.paper;
  const popperSlotProps = slotProps.popper;
  const popupIndicatorSlotProps = slotProps.popupIndicator;

  return (
    <React.Fragment>
      <AutocompleteRoot
        ref={ref}
        className={clsx(classes.root, className)}
        ownerState={ownerState}
        {...getRootProps(other)}
      >
        {renderInput({
          id,
          disabled,
          fullWidth: true,
          size: size === 'small' ? 'small' : undefined,
          slotProps: {
            inputLabel: getInputLabelProps(),
            input: {
              ref: setAnchorEl,
              className: classes.inputRoot,
              startAdornment,
              onClick: (event) => {
                if (event.target === event.currentTarget) {
                  handleInputMouseDown(event);
                }
              },
              ...((hasClearIcon || hasPopupIcon) && {
                endAdornment: (
                  <AutocompleteEndAdornment
                    className={classes.endAdornment}
                    ownerState={ownerState}
                  >
                    {hasClearIcon ? (
                      <AutocompleteClearIndicator
                        {...getClearProps()}
                        aria-label={clearText}
                        title={clearText}
                        ownerState={ownerState}
                        {...clearIndicatorSlotProps}
                        className={clsx(classes.clearIndicator, clearIndicatorSlotProps?.className)}
                      >
                        {clearIcon}
                      </AutocompleteClearIndicator>
                    ) : null}

                    {hasPopupIcon ? (
                      <AutocompletePopupIndicator
                        {...getPopupIndicatorProps()}
                        disabled={disabled}
                        aria-label={popupOpen ? closeText : openText}
                        title={popupOpen ? closeText : openText}
                        ownerState={ownerState}
                        {...popupIndicatorSlotProps}
                        className={clsx(classes.popupIndicator, popupIndicatorSlotProps?.className)}
                      >
                        {popupIcon}
                      </AutocompletePopupIndicator>
                    ) : null}
                  </AutocompleteEndAdornment>
                )
              })
            }
          },
          inputProps: {
            className: classes.input,
            disabled,
            readOnly,
            ...getInputProps()
          }
        })}
      </AutocompleteRoot>
      {anchorEl ? (
        <AutocompletePopper
          keepMounted
          as={PopperComponent}
          disablePortal={disablePortal}
          style={{
            width: anchorEl ? anchorEl.clientWidth : null
          }}
          ownerState={ownerState}
          role='presentation'
          anchorEl={anchorEl}
          open={popupOpen}
          {...popperSlotProps}
          className={clsx(classes.popper, popperSlotProps?.className)}
        >
          <AutocompletePaper
            ownerState={ownerState}
            as={PaperComponent}
            {...paperSlotProps}
            className={clsx(classes.paper, paperSlotProps?.className)}
          >
            {loading && groupedOptions.length === 0 ? (
              <AutocompleteLoading className={classes.loading} ownerState={ownerState}>
                {loadingText}
              </AutocompleteLoading>
            ) : null}
            {groupedOptions.length === 0 && !freeSolo && !loading ? (
              <AutocompleteNoOptions
                className={classes.noOptions}
                ownerState={ownerState}
                role='presentation'
                onMouseDown={(event) => {
                  // Prevent input blur when interacting with the "no options" content
                  event.preventDefault();
                }}
              >
                {noOptionsText}
              </AutocompleteNoOptions>
            ) : null}
            {groupedOptions.length > 0 ? (
              <AutocompleteListbox
                as={ListboxComponent}
                className={classes.listbox}
                ownerState={ownerState}
                {...otherListboxProps}
                {...ListboxProps}
                ref={combinedListboxRef}
              >
                {groupedOptions.map((option, index) => {
                  if (groupBy) {
                    return renderGroup({
                      key: option.key,
                      group: option.group,
                      children: option.options.map((option2, index2) =>
                        renderListOption(option2, option.index + index2)
                      )
                    });
                  }
                  return renderListOption(option, index);
                })}
              </AutocompleteListbox>
            ) : null}
          </AutocompletePaper>
        </AutocompletePopper>
      ) : null}
    </React.Fragment>
  );
});

Autocomplete.displayName = 'Autocomplete';

export default Autocomplete;
