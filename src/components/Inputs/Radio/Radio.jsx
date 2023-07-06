import React from 'react';
import styled, { extractStyling, shouldForwardProp } from '@styles';
import { areEqualValues, createChainedFunction, useSlotProps } from '@components/lib';
import SwitchBase from '../Switch/SwitchBase';
import RadioButtonIcon from './RadioButtonIcon';
import { useRadioGroup } from './RadioGroupContext';

export const radioClasses = {
  root: 'Radio-Root',
  checked: 'Checked',
  disabled: 'Disabled'
};

const RadioRoot = styled(SwitchBase, {
  shouldForwardProp: (prop) => shouldForwardProp(prop) || prop === 'classes',
  name: 'Radio',
  slot: 'Root'
})(({ theme, ownerState }) => ({
  color: theme.color.text.secondary,
  ...(!ownerState.disableRipple && {
    '&:hover': {
      backgroundColor: theme.alpha.add(
        ownerState.color === 'default' ? theme.color.active : theme.color[ownerState.color].body,
        theme.color.hoverOpacity
      ),
      '@media (hover: none)': {
        backgroundColor: 'transparent'
      }
    }
  }),
  ...(ownerState.color !== 'default' && {
    [`&.${radioClasses.checked}`]: {
      color: theme.color[ownerState.color].body
    }
  }),
  [`&.${radioClasses.disabled}`]: {
    color: theme.color.disabled.body
  }
}));

const defaultCheckedIcon = <RadioButtonIcon checked />;
const defaultIcon = <RadioButtonIcon />;

const Radio = React.forwardRef((props, ref) => {
  const {
    checked: checkedProp,
    checkedIcon = defaultCheckedIcon,
    color = 'primary',
    component: componentProp = SwitchBase,
    icon = defaultIcon,
    name: nameProp,
    onChange: onChangeProp,
    size = 'medium',
    slots = {},
    slotProps = {},
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = {
    ...props,
    cssStyles,
    color,
    size
  };

  const classes = {
    ...ownerState.classes,
    root: radioClasses.root
  };
  const radioGroup = useRadioGroup();

  let checked = checkedProp;
  const onChange = createChainedFunction([onChangeProp, radioGroup && radioGroup.onChange]);
  let name = nameProp;

  if (radioGroup) {
    if (typeof checked === 'undefined') {
      checked = areEqualValues(radioGroup.value, props.value);
    }
    if (typeof name === 'undefined') {
      name = radioGroup.name;
    }
  }

  const component = componentProp ?? SwitchBase;
  const RadioRootComponent = slots.root ?? RadioRoot;
  const radioRootprops = useSlotProps({
    elementType: RadioRootComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      checked,
      classes: classes,
      name,
      onChange,
      ref: ref,
      type: 'radio'
    },
    ownerState,
    className: classes.root
  });

  return (
    <RadioRootComponent
      as={component}
      icon={React.cloneElement(icon, { size: defaultIcon.props.size ?? size })}
      checkedIcon={React.cloneElement(checkedIcon, {
        size: defaultCheckedIcon.props.size ?? size
      })}
      {...radioRootprops}
    />
  );
});

Radio.displayName = 'Radio';

export default Radio;
