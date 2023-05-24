import * as React from 'react';
import tw from 'twin.macro';
import { Icon, SwitchBase } from '@components';
// import styled, { rootShouldForwardProp } from '../styles/styled';

const checkboxVariantStyles = {
  root: tw`text-secondary-light dark:text-secondary-dark cant-hover:bg-transparent`,
  default: tw`hover:(bg-primary-light/10 dark:bg-primary-dark/10)`,
  disabled: tw`text-disabled-light/70 dark:text-disabled-dark/50`,
  unchecked: {
    primary: tw`hover:bg-primary-500/10`,
    secondary: tw`hover:bg-secondary-500/10`,
    success: tw`hover:bg-success-500/10`,
    warning: tw`hover:bg-warning-500/10`,
    danger: tw`hover:bg-danger-500/10`,
    monochrome: tw`hover:(bg-black/10 dark:bg-white/10)`
  },
  checked: {
    primary: tw`text-primary-500 dark:text-primary-500`,
    secondary: tw`text-secondary-500 dark:text-secondary-500`,
    success: tw`text-success-500 dark:text-success-500`,
    warning: tw`text-warning-500 dark:text-warning-500`,
    danger: tw`text-danger-500 dark:text-danger-500`,
    monochrome: tw`text-black dark:text-white`
  }
};

const Checkbox = React.forwardRef(
  (
    {
      checkedIcon = 'MdCheckBox',
      color = 'primary',
      icon: iconProp = 'MdCheckBoxOutlineBlank',
      indeterminate = false,
      indeterminateIcon: indeterminateIconProp = 'MdIndeterminateCheckBox',
      inputProps,
      size = 'medium',
      className,
      ...other
    },
    ref
  ) => {
    const renderIcon = (icon) => {
      if (typeof icon === 'string') {
        return <Icon icon={icon} />;
      }

      return icon;
    };

    const icon = renderIcon(indeterminate ? indeterminateIconProp : iconProp);
    const indeterminateIcon = renderIcon(
      indeterminate ? indeterminateIconProp : checkedIcon
    );

    const [checked, setChecked] = React.useState(
      other.defaultChecked ?? other.checked ?? false
    );

    React.useEffect(() => {
      if (other.checked !== undefined) {
        setChecked(other.checked);
      }
    }, [other.checked]);

    const handleChange = (event) => {
      setChecked(event.target.checked);
    };

    const checkboxStyles = [
      checkboxVariantStyles.root,
      color === 'default' && checkboxVariantStyles.default,
      color !== 'default' && checkboxVariantStyles.unchecked[color],
      color !== 'default' && checked && checkboxVariantStyles.checked[color],
      color !== 'default' &&
        indeterminate &&
        checkboxVariantStyles.checked[color],
      other.disabled && checkboxVariantStyles.disabled
    ];

    return (
      <SwitchBase
        className={className}
        css={checkboxStyles}
        type='checkbox'
        inputProps={{
          'data-indeterminate': indeterminate,
          ...inputProps
        }}
        icon={React.cloneElement(icon, {
          fontSize: icon.props.fontSize ?? size
        })}
        checkedIcon={React.cloneElement(indeterminateIcon, {
          fontSize: indeterminateIcon.props.fontSize ?? size
        })}
        checked={checked}
        onChange={handleChange}
        ref={ref}
        {...other}
      />
    );
  }
);
Checkbox.displayName = 'Checkbox';

export default Checkbox;
