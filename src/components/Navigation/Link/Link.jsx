import React from 'react';
import styled from '@styles';
import clsx from 'clsx';
import { useForkRef, useIsFocusVisible } from '@component/hooks';
import { Text } from '@components/layout';

const LinkRoot = styled(Text)(({ theme, ownerState }) => ({
  ...(ownerState.underline === 'always' && {
    textDecorationLine: 'underline',
    '&:hover': {
      textDecorationColor: 'inherit'
    }
  }),
  ...(ownerState.underline === 'hover' && {
    textDecorationLine: 'none',
    '&:hover': {
      textDecorationLine: 'underline'
    }
  }),
  ...(ownerState.underline === 'none' && {
    textDecorationLine: 'none'
  }),

  ...(ownerState.color === 'inherit' && {
    color: 'inherit',
    textDecorationColor: 'inherit'
  }),
  ...(ownerState.color === 'text' && {
    color: theme.color.text.primary,
    textDecorationColor: 'inherit'
  }),
  ...(ownerState.color !== 'inherit' && {
    ...(ownerState.color !== 'text' && {
      color: theme.color[ownerState.color][500]
    })
  }),
  ...(ownerState.component === 'button' && {
    position: 'relative',
    WebkitTapHighlightColor: 'transparent',
    backgroundColor: 'transparent',
    outline: 0,
    border: 0,
    margin: 0,
    borderRadius: 0,
    padding: 0,
    cursor: 'pointer',
    userSelect: 'none',
    verticalAlign: 'middle',
    MozAppearance: 'none',
    WebkitAppearance: 'none',
    '&::-moz-focus-inner': {
      borderStyle: 'none'
    },
    '&:focus-visible': {
      outline: 'auto'
    }
  }),
  ...(ownerState.focusVisible && {
    ['&.focusVisible']: {
      outline: 'auto'
    }
  })
}));

const Link = React.forwardRef((props, ref) => {
  const {
    className,
    color = 'primary',
    component = 'a',
    onBlur,
    onFocus,
    underline = 'always',
    variant = 'inherit',
    ...other
  } = props;

  const {
    isFocusVisibleRef,
    onBlur: handleBlurVisible,
    onFocus: handleFocusVisible,
    ref: focusVisibleRef
  } = useIsFocusVisible();

  const [focusVisible, setFocusVisible] = React.useState(false);
  const handlerRef = useForkRef(ref, focusVisibleRef);

  const ownerState = {
    ...props,
    color,
    component,
    focusVisible,
    underline,
    variant
  };

  const handleBlur = (event) => {
    handleBlurVisible(event);
    if (isFocusVisibleRef.current === false) {
      setFocusVisible(false);
    }
    if (onBlur) {
      onBlur(event);
    }
  };

  const handleFocus = (event) => {
    handleFocusVisible(event);
    if (isFocusVisibleRef.current === true) {
      setFocusVisible(true);
    }
    if (onFocus) {
      onFocus(event);
    }
  };

  return (
    <LinkRoot
      color={color}
      className={clsx('Link-Root', className)}
      ownerState={ownerState}
      component={component}
      onBlur={handleBlur}
      onFocus={handleFocus}
      target='_blank'
      rel='noopener'
      ref={handlerRef}
      variant={variant}
      {...other}
    />
  );
});

Link.displayName = 'Link';

export default Link;
