import { createContext, forwardRef, useMemo } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@utils';
import tw, { css } from 'twin.macro';

export const ButtonGroupContext = createContext({});

const buttonGroupVariants = {
  root: tw`min-w-[40px] rounded-none active:scale-100 shadow-none`,
  text: tw`drop-shadow-md`,
  orientation: {
    horizontal: tw`ml-[-1px] first-of-type:ml-0 first-of-type:rounded-l-md last-of-type:rounded-r-md`,
    vertical: tw`mt-[-1px] first-of-type:mt-0 first-of-type:rounded-t-md last-of-type:rounded-b-md`
  },
  color: {
    default: tw`border-gray-700`,
    primary: tw`border-primary-600`,
    secondary: tw`border-secondary-600`,
    success: tw`border-success-600`,
    warning: tw`border-warning-600`,
    danger: tw`border-danger-600`,
    monochrome: tw`border-gray-900`
  },
  compoundVariants: {
    horizontal: tw`border-y-0 border-x border-solid first-of-type:border-l-0 last-of-type:border-r-0`,
    vertical: tw`border-x-0 border-y border-solid first-of-type:border-t-0 last-of-type:border-b-0`
  }
};

const ButtonGroup = forwardRef(
  (
    {
      children,
      className,
      color = 'primary',
      Component = 'div',
      disabled = false,
      disableElevation = false,
      disableFocusRipple = false,
      disableRipple = false,
      fullWidth = false,
      orientation = 'horizontal',
      size = 'md',
      variant = 'outline',
      ...other
    },
    ref
  ) => {
    const styles = [
      buttonGroupVariants.root,
      variant === 'text' && buttonGroupVariants.text,
      buttonGroupVariants.orientation[orientation],
      buttonGroupVariants.color[color],
      variant !== 'outline' && buttonGroupVariants.compoundVariants[orientation]
    ].filter(Boolean);

    const context = useMemo(
      () => ({
        className,
        styles,
        color,
        disabled,
        disableElevation,
        disableFocusRipple,
        disableRipple,
        fullWidth,
        orientation,
        size,
        variant
      }),
      [
        className,
        styles,
        color,
        disabled,
        disableElevation,
        disableFocusRipple,
        disableRipple,
        fullWidth,
        orientation,
        size,
        variant
      ]
    );

    const buttonGroupStyles = [
      tw`inline-flex rounded-md`,
      orientation === 'horizontal' ? tw`flex-row` : tw`flex-col`,
      variant !== 'text' && tw`shadow-md`,
      disabled &&
        tw`border-none bg-disabled-light shadow-none drop-shadow-none dark:bg-disabled-dark`,
      disableElevation && tw`shadow-none drop-shadow-none`,
      fullWidth && tw`w-full`
    ].filter(Boolean);

    return (
      <Component
        className={cn('group', className)}
        css={buttonGroupStyles}
        ref={ref}
        {...other}
      >
        <ButtonGroupContext.Provider value={context}>
          {children}
        </ButtonGroupContext.Provider>
      </Component>
    );
  }
);
ButtonGroup.displayName = 'ButtonGroup';

export { ButtonGroup };
