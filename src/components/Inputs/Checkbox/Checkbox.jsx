import React from 'react';
import styled, { extractStyling, shouldForwardProp } from '@styles';
import { useSlotProps } from '@components/lib';
import Icon from '@components/Display/Icon';
import SwitchBase from '../switch/SwitchBase';
import CheckBoxIcon from '@icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@icons/CheckBoxOutlineBlank';
import IndeterminateCheckBoxIcon from '@icons/IndeterminateCheckBox';

export const checkboxClasses = {
  root: 'Checkbox-Root',
  switchBase: 'Checkbox-SwitchBase',
  checked: 'Checked',
  disabled: 'Disabled',
  indeterminate: 'Indeterminate'
};

const CheckboxRoot = styled(SwitchBase, {
  shouldForwardProp: (prop) => shouldForwardProp(prop) || prop === 'classes',
  name: 'Checkbox',
  slot: 'Root'
})(({ theme, ownerState }) => ({
  color: theme.color.text.secondary,
  ...(!ownerState.disableRipple && {
    '&:hover': {
      backgroundColor: theme.alpha.add(
        ownerState.color === 'default' ? theme.color.active : theme.color[ownerState.color].body,
        0.25
      ),
      '@media (hover: none)': {
        backgroundColor: 'transparent'
      }
    }
  }),
  ...(ownerState.color !== 'default' && {
    [`&.${checkboxClasses.checked}, &.${checkboxClasses.indeterminate}`]: {
      color: theme.color[ownerState.color].body
    }
  }),
  [`&.${checkboxClasses.disabled}`]: {
    color: theme.color.disabled.text
  },
  ...ownerState.cssStyles
}));

const defaultCheckedIcon = <CheckBoxIcon />;
const defaultIcon = <CheckBoxOutlineBlankIcon />;
const defaultIndeterminateIcon = <IndeterminateCheckBoxIcon />;

const Checkbox = React.forwardRef((props, ref) => {
  const {
    checkedIcon = defaultCheckedIcon,
    color = 'primary',
    icon: iconProp = defaultIcon,
    indeterminate = false,
    indeterminateIcon: indeterminateIconProp = defaultIndeterminateIcon,
    inputProps,
    size = 'medium',
    slots = {},
    slotProps = {},
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const renderIcon = (icon) => {
    if (typeof icon === 'string') {
      return <Icon icon={icon} color='inherit' />;
    }

    return icon;
  };

  const icon = renderIcon(indeterminate ? indeterminateIconProp : iconProp);
  const indeterminateIcon = renderIcon(indeterminate ? indeterminateIconProp : checkedIcon);

  const ownerState = {
    ...props,
    cssStyles,
    color,
    indeterminate,
    size
  };

  const classes = {
    root: [checkboxClasses.root, ownerState.indeterminate && checkboxClasses.indeterminate]
  };

  const CheckboxComponent = slots.root || CheckboxRoot;
  const checkboxnRootProps = useSlotProps({
    elementType: CheckboxComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      type: 'checkbox',
      inputProps: {
        'data-indeterminate': indeterminate,
        ...inputProps
      },
      ref: ref
    },
    ownerState,
    className: classes.root
  });

  return (
    <CheckboxComponent
      {...checkboxnRootProps}
      icon={React.cloneElement(icon, {
        size: icon.props.fontSize ?? size
      })}
      checkedIcon={React.cloneElement(indeterminateIcon, {
        size: indeterminateIcon.props.fontSize ?? size
      })}
    />
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
