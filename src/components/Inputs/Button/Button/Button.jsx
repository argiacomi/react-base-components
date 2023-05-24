import { forwardRef, useContext } from 'react';
import tw, { css } from 'twin.macro';
import { cva } from 'class-variance-authority';
import { cn } from '@utils';
import { ButtonBase } from '@components';
import { ButtonGroupContext } from './ButtonGroup';

const buttonVariants = {
  root: tw`inline-flex min-w-[64px] active:scale-95 rounded-lg transition-colors items-center justify-center relative box-border font-medium w-auto bg-transparent outline-0 border-none border m-0 p-0 cursor-pointer select-none align-middle no-underline overflow-hidden`,
  disabled: tw`dark:shadow-none pointer-events-none border-none bg-disabled-light text-disabled-text shadow-none drop-shadow-none dark:border-none dark:bg-disabled-dark dark:text-disabled-text dark:drop-shadow-none`,
  variants: {
    color: {
      default: tw`bg-gray-600 hover:bg-gray-700`,
      primary: tw`bg-primary-500 hover:bg-primary-600`,
      secondary: tw`bg-secondary-500 hover:bg-secondary-600`,
      success: tw`bg-success-500 hover:bg-success-600`,
      warning: tw`bg-warning-500 hover:bg-warning-600`,
      danger: tw`bg-danger-500 hover:bg-danger-600`,
      monochrome: tw`bg-black hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-500 dark:text-black`
    },
    variant: {
      contain: tw`bg-opacity-100 text-white shadow-md`,
      text: tw`bg-opacity-0 text-black dark:text-white drop-shadow-md`,
      outline: tw`bg-opacity-0 border border-solid border-current shadow-md`
    },
    size: {
      xs: tw`px-3 py-1 leading-4 text-xs`,
      small: tw`px-4 py-1 leading-4 text-sm`,
      medium: tw`px-4 py-1 leading-6 text-base`,
      large: tw`px-5 py-1 leading-7 text-lg`,
      xl: tw`px-6 py-2 leading-8 text-xl`
    }
  },
  compoundVariants: {
    root: {
      default: tw`hover:text-gray-500 dark:hover:text-gray-500 hover:bg-gray-800/20`,
      primary: tw`hover:text-primary-500 dark:hover:text-primary-500 hover:bg-primary-500/20`,
      secondary: tw`hover:text-secondary-500 dark:hover:text-secondary-500 hover:bg-secondary-500/20`,
      success: tw`hover:text-success-500 dark:hover:text-success-500 hover:bg-success-500/20`,
      warning: tw`hover:text-warning-500 dark:hover:text-warning-500 hover:bg-warning-500/20`,
      danger: tw`hover:text-danger-500 dark:hover:text-danger-500 hover:bg-danger-500/20`,
      monochrome: tw`dark:text-white hover:text-black dark:hover:text-white hover:bg-gray-900/20`
    },
    outline: {
      default: tw`text-gray-700 dark:text-gray-600`,
      primary: tw`text-primary-500`,
      secondary: tw`text-secondary-500`,
      success: tw`text-success-500`,
      warning: tw`text-warning-500`,
      danger: tw`text-danger-500`,
      monochrome: tw`text-black`
    }
  }
};

const iconVariants = {
  root: tw`inline-flex items-center justify-center font-medium my-1`,
  variants: {
    edge: {
      start: tw`mr-[10px]`,
      end: tw`ml-[10px]`
    },
    size: {
      xs: tw`leading-4 h-[14px] w-[14px]`,
      small: tw`leading-4 h-4 w-4`,
      medium: tw`leading-6 h-[18px] w-[18px]`,
      large: tw`leading-7 h-5 w-5`,
      xl: tw`leading-8 h-[22px] w-[22px]`
    }
  },
  compoundVariants: {
    start: {
      xs: tw`mr-2`,
      small: tw`mr-2`,
      large: tw`mr-3`,
      xl: tw`mr-3`
    },
    end: {
      xs: tw`ml-2`,
      small: tw`ml-2`,
      large: tw`ml-3`,
      xl: tw`ml-3`
    }
  }
};

const Button = forwardRef((props, ref) => {
  const contextProps = useContext(ButtonGroupContext);
  const {
    children,
    className,
    color = 'primary',
    disabled = false,
    disableElevation = false,
    disableFocusRipple = false,
    endIcon: endIconProp,
    focusVisibleClassName,
    fullWidth = false,
    size = 'medium',
    startIcon: startIconProp,
    styles,
    variant = 'contain',
    ...other
  } = { ...props, ...contextProps };

  const buttonStyles = [
    buttonVariants.root,
    buttonVariants.variants.color[color],
    buttonVariants.variants.variant[variant],
    buttonVariants.variants.size[size],
    variant !== 'contain' && buttonVariants.compoundVariants.root[color],
    variant === 'outline' && buttonVariants.compoundVariants.outline[color],
    styles,
    disabled && buttonVariants.disabled,
    disableElevation && tw`shadow-none drop-shadow-none`,
    fullWidth && tw`w-full`
  ].filter(Boolean);

  const startIconStyles = [
    iconVariants.root,
    iconVariants.variants.edge.start,
    iconVariants.variants.size[size],
    iconVariants.compoundVariants.start[size]
  ].filter(Boolean);

  const endIconStyles = [
    iconVariants.root,
    iconVariants.variants.edge.end,
    iconVariants.variants.size[size],
    iconVariants.compoundVariants.end[size]
  ].filter(Boolean);

  const startIcon = startIconProp && (
    <span css={startIconStyles}>{startIconProp}</span>
  );

  const endIcon = endIconProp && <span css={endIconStyles}>{endIconProp}</span>;

  return (
    <ButtonBase
      className={className}
      css={buttonStyles}
      focusRipple={!disableFocusRipple}
      focusVisibleClassName={cn(
        variant === 'contained' && 'shadow-lg',
        focusVisibleClassName
      )}
      ref={ref}
      {...other}
    >
      {startIcon}
      {children}
      {endIcon}
    </ButtonBase>
  );
});
Button.displayName = 'Button';

export { Button, buttonVariants };
