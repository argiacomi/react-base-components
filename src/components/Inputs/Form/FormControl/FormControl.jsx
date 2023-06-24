import React from 'react';
import clsx from 'clsx';
import styled from '@styles';
import { isFilled, isAdornedStart, useSlotProps } from '@components/lib';
import { FormControlContext } from './FormControlContext';

const FormControlRoot = styled('div')(({ theme, ownerState }) => ({
  display: 'inline-flex',
  flexDirection: 'column',
  position: 'relative',
  minWidth: 0,
  padding: 0,
  margin: 0,
  border: 0,
  verticalAlign: 'top',
  ...(ownerState.margin === 'normal' && {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1)
  }),
  ...(ownerState.margin === 'dense' && {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(0.5)
  }),
  ...(ownerState.fullWidth && {
    width: '100%'
  })
}));

const FormControl = React.forwardRef((props, ref) => {
  const {
    children,
    className,
    color = 'primary',
    component,
    disabled = false,
    error = false,
    focused: visuallyFocused,
    fullWidth = false,
    hiddenLabel = false,
    margin = 'none',
    required = false,
    slotProps = {},
    slots = {},
    size = 'medium',
    variant = 'outlined',
    ...other
  } = props;

  const [adornedStart, setAdornedStart] = React.useState(() => {
    let initialAdornedStart = false;

    if (children) {
      React.Children.forEach(children, (child) => {
        const input = child;

        if (input && isAdornedStart(input.props)) {
          initialAdornedStart = true;
        }
      });
    }
    return initialAdornedStart;
  });

  const [filled, setFilled] = React.useState(() => {
    let initialFilled = false;

    if (children) {
      React.Children.forEach(children, (child) => {
        if (isFilled(child?.props, true) || isFilled(child?.props?.inputProps, true)) {
          initialFilled = true;
        }
      });
    }

    return initialFilled;
  });

  const [focusedState, setFocused] = React.useState(false);
  const focused = visuallyFocused !== undefined && !disabled ? visuallyFocused : focusedState;

  React.useEffect(() => setFocused((isFocused) => (disabled ? false : isFocused)), [disabled]);

  const ownerState = {
    ...props,
    color,
    component,
    disabled,
    error,
    filled,
    focused,
    fullWidth,
    hiddenLabel,
    margin,
    required,
    size,
    variant
  };

  let registerEffect;
  if (!import.meta.env.PROD) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const registeredInput = React.useRef(false);
    registerEffect = () => {
      if (registeredInput.current) {
        console.error(
          `There are multiple 'InputBase' components inside a FormControl.
          This creates visual inconsistencies, only use one 'InputBase'.`
        );
      }
      registeredInput.current = true;
      return () => {
        registeredInput.current = false;
      };
    };
  }

  const childContext = React.useMemo(() => {
    return {
      adornedStart,
      setAdornedStart,
      color,
      disabled,
      error,
      filled,
      focused,
      fullWidth,
      hiddenLabel,
      size,
      onBlur: () => {
        setFocused(false);
      },
      onEmpty: () => {
        setFilled(false);
      },
      onFilled: () => {
        setFilled(true);
      },
      onFocus: () => {
        setFocused(true);
      },
      registerEffect,
      required,
      variant
    };
  }, [
    adornedStart,
    color,
    disabled,
    error,
    filled,
    focused,
    fullWidth,
    hiddenLabel,
    registerEffect,
    required,
    size,
    variant
  ]);

  const renderChildren = () => {
    if (typeof children === 'function') {
      return children(childContext);
    }

    return children;
  };

  const Root = component ?? slots.root ?? 'div';
  const rootProps = useSlotProps({
    externalSlotProps: slotProps.root,
    externalForwardedProps: other
  });

  return (
    <FormControlContext.Provider value={childContext}>
      <FormControlRoot
        as={Root}
        ownerState={ownerState}
        className={clsx('FormControl-Root', className)}
        ref={ref}
        {...rootProps}
      >
        {renderChildren()}
      </FormControlRoot>
    </FormControlContext.Provider>
  );
});

FormControl.displayName = 'FormControl';

export default FormControl;
