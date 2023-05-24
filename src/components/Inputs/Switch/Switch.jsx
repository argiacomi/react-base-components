import * as React from 'react';
import { cn } from '@utils';
import tw from 'twin.macro';
import SwitchBase from './SwitchBase';

const switchRootVariants = {
  root: tw`m-2 p-0 inline-flex w-[38px] h-[20px] overflow-hidden box-border relative shrink-0 z-0 align-middle`,
  small: tw`w-[34px] h-[18px]`,
  edge: {
    start: tw`-ml-[8px]`,
    end: tw`-mr-[8px]`
  }
};

const switchTrackVariants = {
  root: tw`h-full w-full rounded-full -z-10 duration-300 transition-[opacity,background-color] delay-[0ms] bg-black/[.35] dark:bg-white/[.3]`,
  disabled: tw`opacity-30 dark:opacity-50`,
  color: {
    primary: tw`bg-primary-500 dark:bg-primary-500`,
    secondary: tw`bg-secondary-500 dark:bg-secondary-500`,
    success: tw`bg-success-500/90 dark:bg-success-500/90`,
    warning: tw`bg-warning-500/80 dark:bg-warning-500/90`,
    danger: tw`bg-danger-500 dark:bg-danger-500`
  }
};

const switchThumbVariants = {
  root: tw`drop-shadow-2xl bg-current w-[16px] h-[16px] rounded-[50%]`,
  small: tw`w-[14px] h-[14px]`
};

const switchBaseVariants = {
  root: tw`p-0 m-[2px] absolute top-0 left-0 z-10 text-primary-dark dark:text-gray-300 duration-300 transition-[left,transform] delay-[0ms] hover:(bg-black/5 /*bg-[#0000008a]/5*/ cant-hover:bg-transparent)`,
  checked: tw`translate-x-[calc(100% + 2px)]`,
  disabled: tw`bg-disabled-light dark:bg-disabled-dark dark:text-disabled-dark`
};
const switchInputStyles = tw`w-[250%] -left-[50%]`;

const Switch = React.forwardRef(
  (
    {
      className,
      color = 'success',
      checked,
      defaultChecked,
      disabled = false,
      edge = false,
      small,
      ...other
    },
    ref
  ) => {
    const [isChecked, setIsChecked] = React.useState(defaultChecked ?? checked);

    const switchRootStyles = [
      switchRootVariants.root,
      edge && switchRootVariants.edge[edge],
      small && switchRootVariants.small
    ].filter(Boolean);

    const switchBaseStyles = [
      switchBaseVariants.root,
      isChecked && switchBaseVariants.checked,
      disabled && switchBaseVariants.disabled
    ].filter(Boolean);

    const switchTrackStyles = [
      switchTrackVariants.root,
      isChecked && switchTrackVariants.color[color],
      disabled && switchTrackVariants.disabled
    ].filter(Boolean);

    const switchThumbStyles = [
      switchThumbVariants.root,
      small && switchThumbVariants.small,
      disabled && switchThumbVariants.disabled
    ].filter(Boolean);

    const icon = <span className={'Switch-Thumb'} css={switchThumbStyles} />;

    return (
      <span
        className={cn('Switch-Root', className)}
        css={switchRootStyles}
        {...other}
      >
        <SwitchBase
          type='checkbox'
          checked={checked}
          className='Styled-SwitchBase'
          icon={icon}
          checkedIcon={icon}
          inputStyles={switchInputStyles}
          css={switchBaseStyles}
          disabled={disabled}
          defaultChecked={defaultChecked}
          ref={ref}
          setChecked={setIsChecked}
          {...other}
        />
        <span className={'Switch-Track'} css={switchTrackStyles} />
      </span>
    );
  }
);

export default Switch;
