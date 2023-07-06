import React from 'react';
import clsx from 'clsx';
import styled, { shouldForwardProp } from '@styles';
import { formControlState, FormLabel, useFormControl } from '@components/Inputs/Form';

export const inputLabelClasses = {
  root: 'InputLabel-Root',
  required: 'InputLabel-Asterisk'
};

const InputLabelRoot = styled(FormLabel, {
  shouldForwardProp: (prop) => shouldForwardProp(prop) || prop === 'classes',
  name: 'InputLabel',
  slot: 'Root'
})(({ theme, ownerState }) => ({
  display: 'block',
  transformOrigin: 'top left',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '100%',
  ...(ownerState.formControl && {
    position: 'absolute',
    left: 0,
    top: 0,
    // slight alteration to spec spacing to match visual spec result
    transform: 'translate(0, 20px) scale(1)'
  }),
  ...(ownerState.size === 'small' && {
    // Compensation for the `Input.inputSizeSmall` style.
    transform: 'translate(0, 17px) scale(1)'
  }),
  ...(ownerState.shrink && {
    transform: 'translate(0, -1.5px) scale(0.75)',
    transformOrigin: 'top left',
    maxWidth: '133%'
  }),
  ...(!ownerState.disableAnimation && {
    transition: theme.transition.create(['color', 'transform', 'max-width'], {
      duration: theme.transition.duration.shorter,
      easing: theme.transition.easing.easeOut
    })
  }),
  ...(ownerState.variant === 'filled' && {
    zIndex: 1,
    pointerEvents: 'none',
    transform: 'translate(12px, 16px) scale(1)',
    maxWidth: 'calc(100% - 24px)',
    ...(ownerState.size === 'small' && {
      transform: 'translate(12px, 13px) scale(1)'
    }),
    ...(ownerState.shrink && {
      userSelect: 'none',
      pointerEvents: 'auto',
      transform: 'translate(12px, 7px) scale(0.75)',
      maxWidth: 'calc(133% - 24px)',
      ...(ownerState.size === 'small' && {
        transform: 'translate(12px, 4px) scale(0.75)'
      })
    })
  }),
  ...(ownerState.variant === 'outlined' && {
    zIndex: 1,
    pointerEvents: 'none',
    transform: 'translate(14px, 16px) scale(1)',
    maxWidth: 'calc(100% - 24px)',
    ...(ownerState.size === 'small' && {
      transform: 'translate(14px, 9px) scale(1)'
    }),
    ...(ownerState.shrink && {
      userSelect: 'none',
      pointerEvents: 'auto',
      maxWidth: 'calc(133% - 32px)',
      transform: 'translate(14px, -9px) scale(0.75)'
    })
  })
}));

const InputLabel = React.forwardRef((props, ref) => {
  const { disableAnimation = false, shrink: shrinkProp, className, ...other } = props;

  const formControl = useFormControl();

  let shrink = shrinkProp;
  if (typeof shrink === 'undefined' && formControl) {
    shrink = formControl.filled || formControl.focused || formControl.adornedStart;
  }

  const fcs = formControlState({
    props,
    formControl,
    states: ['size', 'variant', 'required']
  });

  const ownerState = {
    ...props,
    disableAnimation,
    formControl: formControl,
    shrink,
    size: fcs.size,
    variant: fcs.variant,
    required: fcs.required
  };

  const classes = {
    root: inputLabelClasses.root,
    asterisk: [ownerState.required && inputLabelClasses.required]
  };

  return (
    <InputLabelRoot
      data-shrink={shrink}
      ownerState={ownerState}
      ref={ref}
      className={clsx(classes.root, className)}
      {...other}
      classes={classes}
    />
  );
});

InputLabel.displayName = 'InputLabel';

export default InputLabel;
