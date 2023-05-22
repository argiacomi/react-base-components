import { forwardRef, useContext } from 'react';
import { cn } from '@utils';
import tw from 'twin.macro';
import { ButtonBase } from '@components';
import { AccordionContext } from './Accordion';

const getStyles = ({ disabled, enableGutters, expanded }) => ({
  root: [
    tw`flex min-h-[48px] px-4 no-underline transition-[min-height,background-color] duration-150 ease-in-out delay-[0ms] focus-visible:bg-gray-400`,
    disabled && tw`pointer-events-none`
  ].filter(Boolean),
  content: [
    tw`m-0 flex grow my-3`,
    enableGutters &&
      tw`transition-[margin] duration-150 ease-in-out delay-[0ms]`,
    enableGutters && expanded && tw`my-5`
  ].filter(Boolean),
  expandIconWrapper: [
    tw`flex text-current rotate-0 transition-[transform] duration-150 ease-in-out delay-[0ms]`,
    expanded && tw`rotate-180`
  ]
});

const AccordionSummary = forwardRef(
  (
    {
      children,
      className,
      expandIcon,
      focusVisibleClassName,
      onClick,
      ...other
    },
    ref
  ) => {
    const context = useContext(AccordionContext);
    const { disabled, enableGutters, expanded, toggle } = context;
    const summaryStyles = getStyles({
      disabled,
      enableGutters,
      expanded
    });

    const handleChange = (event) => {
      toggle?.(event);
      onClick?.(event);
    };

    return (
      <ButtonBase
        focusRipple={false}
        disableRipple
        disabled={disabled}
        component='div'
        aria-expanded={expanded}
        className={className}
        css={summaryStyles.root}
        focusVisibleClassName={focusVisibleClassName}
        onClick={handleChange}
        ref={ref}
        {...other}
      >
        <div css={summaryStyles.content}>{children}</div>
        {expandIcon && (
          <div css={summaryStyles.expandIconWrapper}>{expandIcon}</div>
        )}
      </ButtonBase>
    );
  }
);
AccordionSummary.displayName = 'AccordionSummary';

export default AccordionSummary;
