import React from 'react';
import clsx from 'clsx';
import { styled } from '@styles';
import { Text } from '@components/layout';
import { FormControlContext, useFormControl } from '@components/Inputs/Form';

const inputAdornmentClasses = {
  root: 'InputAdornment-Root',
  start: 'InputAdornment-PositionStart',
  hiddenLabel: 'InputAdornment-HiddenLabel'
};

const InputAdornmentRoot = styled('div')(({ theme, ownerState }) => ({
  display: 'flex',
  maxHeight: '2em',
  alignItems: 'center',
  whiteSpace: 'nowrap',
  color: theme.color.selected,
  ...(ownerState.variant === 'filled' && {
    [`&.${inputAdornmentClasses.positionStart}&:not(.${inputAdornmentClasses.hiddenLabel})`]: {
      marginTop: theme.spacing(2)
    }
  }),
  ...(ownerState.position === 'start' && {
    marginRight: theme.spacing(1)
  }),
  ...(ownerState.position === 'end' && {
    marginLeft: theme.spacing(1)
  }),
  ...(ownerState.disablePointerEvents === true && {
    pointerEvents: 'none'
  })
}));

const InputAdornment = React.forwardRef((props, ref) => {
  const {
    children,
    className,
    component = 'div',
    disablePointerEvents = false,
    disableTypography = false,
    position,
    variant: variantProp,
    ...other
  } = props;

  const formControl = useFormControl() || {};

  let variant = variantProp;

  if (variantProp && formControl.variant) {
    if (!import.meta.env.PROD) {
      if (variantProp === formControl.variant) {
        console.error(
          `The 'InputAdornment' variant infers the variant prop, you do not have to provide one.`
        );
      }
    }
  }

  if (formControl && !variant) {
    variant = formControl.variant;
  }

  const ownerState = {
    ...props,
    hiddenLabel: formControl.hiddenLabel,
    size: formControl.size,
    disablePointerEvents,
    position,
    variant
  };

  const classes = {
    root: [
      inputAdornmentClasses.Root,
      ownerState.position === 'start' && inputAdornmentClasses.start,
      ownerState.hiddenLabel && inputAdornmentClasses.hiddenLabel
    ]
  };

  return (
    <FormControlContext.Provider value={null}>
      <InputAdornmentRoot
        as={component}
        ownerState={ownerState}
        className={clsx(classes.root, className)}
        ref={ref}
        {...other}
      >
        {typeof children === 'string' && !disableTypography ? (
          <Text color='text.secondary'>{children}</Text>
        ) : (
          <React.Fragment>
            {/* To have the correct vertical alignment baseline */}
            {position === 'start' ? (
              /* notranslate needed while Google Translate will not fix zero-width space issue */
              <span className='notranslate'>&#8203;</span>
            ) : null}
            {children}
          </React.Fragment>
        )}
      </InputAdornmentRoot>
    </FormControlContext.Provider>
  );
});

InputAdornment.displayName = 'InputAdornment';

export default InputAdornment;
