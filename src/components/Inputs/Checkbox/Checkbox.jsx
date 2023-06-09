import * as React from 'react';
import clsx from 'clsx';
import styled from 'styled-components/macro';
import { Icon, SwitchBase } from '@components';

const CheckboxRoot = styled(SwitchBase)(({ theme, ownerState }) => ({
  color: theme.color.text.secondary,
  '@media (hover: none)': {
    backgroundColor: 'transparent'
  },
  ...(ownerState.color === 'default' && {
    '&:hover': {
      backgroundColor: theme.alpha.add(theme.color.text.primary, 0.1)
    }
  }),
  ...(ownerState.color !== 'default' && {
    '&:hover': {
      backgroundColor: theme.alpha.add(theme.color[ownerState.color][500], 0.1)
    },
    [`&.${ownerState.checkboxClasses.checked}, &.${ownerState.checkboxClasses.indeterminate}`]: {
      color: theme.color[ownerState.color][500]
    },
    [`&.${ownerState.checkboxClasses.disabled}`]: {
      color: theme.color.disabled.body
    }
  })
}));

const Checkbox = React.forwardRef((props, ref) => {
  const {
    checkedIcon = 'MdCheckBox',
    color = 'primary',
    icon: iconProp = 'MdCheckBoxOutlineBlank',
    indeterminate = false,
    indeterminateIcon: indeterminateIconProp = 'MdIndeterminateCheckBox',
    inputProps,
    size = 'medium',
    className,
    ...other
  } = props;

  const checkboxClasses = {
    root: 'Checkbox-Root',
    checked: 'Checkbox-Checked',
    disabled: 'Checkbox-Disabled',
    indeterminate: indeterminate && 'Checkbox-Indeterminate'
  };

  const ownerState = {
    ...props,
    checkboxClasses,
    color,
    indeterminate,
    size
  };

  const renderIcon = (icon) => {
    if (typeof icon === 'string') {
      return <Icon icon={icon} color='inherit' />;
    }

    return icon;
  };

  const icon = renderIcon(indeterminate ? indeterminateIconProp : iconProp);
  const indeterminateIcon = renderIcon(indeterminate ? indeterminateIconProp : checkedIcon);

  return (
    <CheckboxRoot
      className={clsx(checkboxClasses.root, className)}
      type='checkbox'
      inputProps={{
        'data-indeterminate': indeterminate,
        ...inputProps
      }}
      icon={React.cloneElement(icon, {
        size: icon.props.fontSize ?? size
      })}
      checkedIcon={React.cloneElement(indeterminateIcon, {
        size: indeterminateIcon.props.fontSize ?? size
      })}
      ownerState={ownerState}
      ref={ref}
      classes={{
        ...checkboxClasses,
        root: 'Checkbox-SwitchBase'
      }}
      {...other}
    />
  );
});
Checkbox.displayName = 'Checkbox';

export default Checkbox;
