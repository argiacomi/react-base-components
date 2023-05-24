import * as React from 'react';
import { useForkRef, useIsFocusVisible } from '@component-hooks';
import { Text } from '@components';
import tw from 'twin.macro';

const linkStyleVariants = {
  underline: {
    none: tw`no-underline`,
    hover: tw`no-underline hover:underline`,
    always: tw`underline hover:decoration-inherit`
  },
  color: {
    inherit: tw`text-inherit decoration-inherit`,
    text: tw`text-primary-light dark:text-primary-dark`,
    primary: tw`decoration-primary-500`,
    secondary: tw`decoration-secondary-500`,
    success: tw`decoration-success-500`,
    warning: tw`decoration-warning-500`,
    danger: tw`decoration-danger-500`
  },
  button: tw`relative bg-transparent outline-0 border-none m-0 rounded-none p-0 cursor-pointer select-none align-middle appearance-none border-0 focus-visible:outline-[auto]`
};

const Link = React.forwardRef(
  (
    {
      className,
      color = 'primary',
      component = 'a',
      onBlur,
      onFocus,
      underline = 'always',
      variant = 'inherit',
      ...other
    },
    ref
  ) => {
    const {
      isFocusVisibleRef,
      onBlur: handleBlurVisible,
      onFocus: handleFocusVisible,
      ref: focusVisibleRef
    } = useIsFocusVisible();

    const [focusVisible, setFocusVisible] = React.useState(false);
    const handlerRef = useForkRef(ref, focusVisibleRef);

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

    const linkStyles = [
      linkStyleVariants.underline[underline],
      linkStyleVariants.color[color],
      component === 'button' ? linkStyleVariants.button : null,
      variant
    ];

    return (
      <Text
        color={color}
        className={className}
        css={linkStyles}
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
  }
);
Link.displayName = 'Link';

export default Link;
