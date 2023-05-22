import { forwardRef } from 'react';
import { ButtonBase } from '@components';
import tw, { css } from 'twin.macro';

const iconButtonVariants = {
  root: tw`text-center flex-[0_0_auto] rounded-full overflow-visible transition-colors box-content`,
  variants: {
    edge: {
      start: tw`ml-[-12px]`,
      end: tw`mr-[-12px]`
    },
    color: {
      inherit: tw`text-inherit fill-inherit hover:bg-black/5`,
      primary: tw`text-primary-500 fill-primary-500 hover:bg-primary-500/20`,
      secondary: tw`text-secondary-500 fill-secondary-500 hover:bg-secondary-500/20`,
      success: tw`text-success-500 fill-success-500 hover:bg-success-500/20`,
      warning: tw`text-warning-500 fill-warning-500 hover:bg-warning-500/20`,
      danger: tw`text-danger-500 fill-danger-500 hover:bg-danger-500/20`
    },
    size: {
      xs: tw`p-1 h-6 w-6`,
      small: tw`p-[6px] h-6 w-6`,
      medium: tw`p-2 h-6 w-6`,
      large: tw`p-3 h-6 w-6`,
      xl: tw`p-[14px] h-6 w-6`
    }
  },
  compoundVariants: tw`ml-[-3px]`,
  disabled: tw`pointer-events-none text-disabledLight dark:text-disabledDark`
};

const IconButton = forwardRef(
  (
    {
      edge = false,
      children,
      className,
      color = 'inherit',
      disabled = false,
      disableFocusRipple = false,
      disableRipple = false,
      size = 'medium',
      ...other
    },
    ref
  ) => {
    const iconButtonStyles = [
      iconButtonVariants.root,
      iconButtonVariants.variants.edge[edge],
      iconButtonVariants.variants.color[color],
      iconButtonVariants.variants.size[size],
      edge === 'start' &&
        (size === 'xs' || size === 'sm') &&
        iconButtonVariants.compoundVariants,
      disabled && iconButtonVariants.disabled
    ].filter(Boolean);

    return (
      <ButtonBase
        className={className}
        css={iconButtonStyles}
        centerRipple
        disabled={disabled}
        focusRipple={!disableFocusRipple}
        disableRipple={disableRipple}
        ref={ref}
        {...other}
      >
        {children}
      </ButtonBase>
    );
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;
