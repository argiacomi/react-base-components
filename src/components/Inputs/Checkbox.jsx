import * as React from 'react';
import tw from 'twin.macro';
// import { Icon, SwitchBase }  from '@components';
// import CheckBoxOutlineBlankIcon from '../internal/svg-icons/CheckBoxOutlineBlank';
// import CheckBoxIcon from '../internal/svg-icons/CheckBox';
// import IndeterminateCheckBoxIcon from '../internal/svg-icons/IndeterminateCheckBox';
// import styled, { rootShouldForwardProp } from '../styles/styled';

const checkboxVariantStyles = {
  root: tw`text-secondary-light dark:text-secondary-dark cant-hover:bg-transparent`,
  default: tw`hover:(bg-primary-light dark:bg-primary-dark)`,
  disabled: tw`text-disabled-light dark:text-disabled-dark`,
  unchecked: {
    primary: tw`hover:bg-primary-500/5`,
    secondary: tw`hover:bg-secondary-500/5`,
    success: tw`hover:bg-success-500/5`,
    warning: tw`hover:bg-warning-500/5`,
    danger: tw`hover:bg-danger-500/5`,
    monochrome: tw`hover:(bg-black/5 dark:bg-white/5)`
  },
  checked: {
    primary: tw`text-primary-500`,
    secondary: tw`text-secondary-500`,
    success: tw`text-success-500`,
    warning: tw`text-warning-500`,
    danger: tw`text-danger-500`,
    monochrome: tw`text-black dark:text-white`
  }
};

const defaultCheckedIcon = <Icon icon='MdCheckBox' />;
const defaultIcon = <Icon icon='MdCheckBoxOutlineBlank' />;
const defaultIndeterminateIcon = <Icon icon='MdIndeterminateCheckBox' />;

const Checkbox = React.forwardRef(
  (
    {
      checkedIcon = defaultCheckedIcon,
      color = 'primary',
      icon: iconProp = defaultIcon,
      indeterminate = false,
      indeterminateIcon: indeterminateIconProp = defaultIndeterminateIcon,
      inputProps,
      size = 'medium',
      className,
      ...other
    },
    ref
  ) => {
    const icon = indeterminate ? indeterminateIconProp : iconProp;
    const indeterminateIcon = indeterminate
      ? indeterminateIconProp
      : checkedIcon;

    const checkboxStyles = [
      checkboxVariantStyles.root,
      (color = 'default' && checkboxVariantStyles.default),
      color,
      indeterminate,
      size
    ];

    const classes = useUtilityClasses(ownerState);

    return (
      <CheckboxRoot
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
        ref={ref}
        className={className}
        {...other}
        classes={classes}
      />
    );
  }
);
Checkbox.displayName = 'Checkbox';

export default Checkbox;
