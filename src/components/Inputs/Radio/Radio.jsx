import React from 'react';
import clsx from 'clsx';
import styled from '@styles';
import SwitchBase from '../Switch/SwitchBase';
import { Icon } from '@components/display';
import { createChainedFunction } from '@components/lib';
import { useRadioGroup } from './RadioGroupContext';

const radioClasses = {
  root: 'Radio-Root',
  checked: 'Radio-Checked',
  disabled: 'Radio-Disabled'
};

const RadioButtonUncheckedIcon = (props) => {
  const { fontSize, className, ownerState } = props;
  return (
    <Icon
      fontSize={fontSize}
      className={className}
      ownerState={ownerState}
      icon='MdRadioButtonUnchecked'
    />
  );
};
const RadioButtonCheckedIcon = (props) => {
  const { fontSize, className, ownerState } = props;
  return (
    <Icon
      fontSize={fontSize}
      className={className}
      ownerState={ownerState}
      icon='MdRadioButtonChecked'
    />
  );
};

const RadioButtonIconRoot = styled('span')({
  position: 'relative',
  display: 'flex'
});

const RadioButtonIconBackground = styled(RadioButtonUncheckedIcon)({
  transform: 'scale(1)'
});

const RadioButtonIconDot = styled(RadioButtonCheckedIcon)(({ theme, ownerState }) => ({
  left: 0,
  position: 'absolute',
  transform: 'scale(0)',
  transition: theme.transition.create('transform', {
    easing: theme.transition.easing.easeIn,
    duration: theme.transition.duration.shortest
  }),
  ...(ownerState.checked && {
    transform: 'scale(1)',
    transition: theme.transition.create('transform', {
      easing: theme.transition.easing.easeOut,
      duration: theme.transition.duration.shortest
    })
  })
}));

function RadioButtonIcon(props) {
  const { checked = false, classes = {}, fontSize } = props;

  const ownerState = { ...props, checked };

  return (
    <RadioButtonIconRoot className={classes.root} ownerState={ownerState}>
      <RadioButtonIconBackground
        fontSize={fontSize}
        className={classes.background}
        ownerState={ownerState}
      />
      <RadioButtonIconDot fontSize={fontSize} className={classes.dot} ownerState={ownerState} />
    </RadioButtonIconRoot>
  );
}

const RadioRoot = styled(SwitchBase)(({ theme, ownerState }) => ({
  color: theme.color.text.secondary,
  ...(!ownerState.disableRipple && {
    '&:hover': {
      backgroundColor: theme.alpha.add(
        theme.color[ownerState.color].body,
        theme.color.mode === 'light' ? 0.06 : 0.1
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

function areEqualValues(a, b) {
  if (typeof b === 'object' && b !== null) {
    return a === b;
  }
  return String(a) === String(b);
}

const defaultCheckedIcon = <RadioButtonIcon checked />;
const defaultIcon = <RadioButtonIcon />;

const Radio = React.forwardRef((props, ref) => {
  const {
    checked: checkedProp,
    checkedIcon = defaultCheckedIcon,
    color = 'primary',
    icon = defaultIcon,
    name: nameProp,
    onChange: onChangeProp,
    size = 'medium',
    className,
    ...other
  } = props;
  const ownerState = {
    ...props,
    color,
    size
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

  const classes = {
    root: clsx([
      radioClasses.root,
      checked && radioClasses.checked,
      ownerState.disabled && radioClasses.disabled
    ])
  };

  return (
    <RadioRoot
      type='radio'
      icon={React.cloneElement(icon, { fontSize: defaultIcon.props.fontSize ?? size })}
      checkedIcon={React.cloneElement(checkedIcon, {
        fontSize: defaultCheckedIcon.props.fontSize ?? size
      })}
      ownerState={ownerState}
      classes={classes}
      name={name}
      checked={checked}
      onChange={onChange}
      ref={ref}
      className={clsx(classes.root, className)}
      {...other}
    />
  );
});

Radio.displayName = 'Radio';
export default Radio;
