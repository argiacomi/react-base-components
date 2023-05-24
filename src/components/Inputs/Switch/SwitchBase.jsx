import * as React from 'react';
import { cn } from '@utils';
import tw from 'twin.macro';
import { useControlled, useFormControl } from '@component-hooks';
import { ButtonBase } from '@components';

const switchBaseRoot = {
  root: tw`p-[9px] rounded-full`,
  disabled: tw`pointer-events-none cursor-default`,
  edge: {
    start: tw`-ml-3`,
    end: tw`-mr-3`
  },
  edgeSmall: {
    start: tw`-ml-1`,
    end: tw`-mr-1`
  }
};

const switchBaseInput = tw`cursor-[inherit] absolute opacity-0 w-full h-full top-0 left-0 m-0 p-0 z-10`;

const SwitchBase = React.forwardRef(
  (
    {
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
      inputStyles,
      name,
      onBlur,
      onChange,
      onFocus,
      readOnly,
      required = false,
      setChecked: setCheckedProp,
      small,
      tabIndex,
      type,
      value,
      ...other
    },
    ref
  ) => {
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
      if (setCheckedProp) {
        setCheckedProp(newChecked);
      }
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

    const switchBaseRootStyles = [
      switchBaseRoot.root,
      disabled && switchBaseRoot.disabled,
      edge && switchBaseRoot.edge[edge],
      edge && small && switchBaseRoot.edgeSmall[edge]
    ].filter(Boolean);

    const switchBaseInputStyles = [switchBaseInput, inputStyles].filter(
      Boolean
    );

    return (
      <ButtonBase
        component='span'
        className={cn(className, 'SwitchBase-Root')}
        css={switchBaseRootStyles}
        centerRipple
        disableRipple={disableFocusRipple}
        disabled={disabled}
        tabIndex={null}
        role={undefined}
        onFocus={handleFocus}
        onBlur={handleBlur}
        ref={ref}
        {...other}
      >
        <input
          autoFocus={autoFocus}
          checked={checkedProp}
          css={switchBaseInputStyles}
          defaultChecked={defaultChecked}
          className={'SwitchBase-Input'}
          disabled={disabled}
          id={hasLabelFor ? id : undefined}
          name={name}
          onChange={handleInputChange}
          readOnly={readOnly}
          ref={inputRef}
          required={required}
          tabIndex={tabIndex}
          type={type}
          {...(type === 'checkbox' && value === undefined ? {} : { value })}
          {...inputProps}
        />
        {checked ? checkedIcon : icon}
      </ButtonBase>
    );
  }
);
SwitchBase.displayName = 'SwitchBase';

export default SwitchBase;
