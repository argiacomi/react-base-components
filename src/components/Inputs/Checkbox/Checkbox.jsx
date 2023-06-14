import React from 'react';
import clsx from 'clsx';
import { styled } from '@styles';
import SwitchBase from '../switch/SwitchBase';
import { Icon } from '@components/display';

export const checkboxClasses = {
  root: 'Checkbox-Root',
  checked: 'Checkbox-Checked',
  disabled: 'Checkbox-Disabled',
  indeterminate: 'Checkbox-Indeterminate'
};

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
    [`&.${checkboxClasses.checked}, &.${checkboxClasses.indeterminate}`]: {
      color: theme.color[ownerState.color][500]
    },
    [`&.${checkboxClasses.disabled}`]: {
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

  const ownerState = {
    ...props,
    color,
    indeterminate,
    size
  };

  const classes = {
    root: [checkboxClasses.root, ownerState.indeterminate && checkboxClasses.indeterminate]
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
      className={clsx(classes.root, className)}
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
        ...classes,
        root: 'Checkbox-SwitchBase'
      }}
      {...other}
    />
  );
});
Checkbox.displayName = 'Checkbox';

export default Checkbox;
