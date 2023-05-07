import { forwardRef, useContext } from 'react';
import { cn } from '@utils';
import { ButtonBase } from '@components';
import { AccordionContext } from './Accordion';

const getClasses = ({ disabled, enableGutters, expanded, className }) => ({
  root: cn(
    'flex min-h-[48px] px-4 no-underline transition-[min-height,background-color] duration-150 ease-in-out delay-0 focus-visible:bg-gray-400',
    disabled && 'pointer-events-none',
    className
  ),
  content: cn(
    'm-0 flex flex-grow my-3',
    enableGutters && 'transition-[margin] duration-150 ease-in-out delay-0',
    enableGutters && expanded && 'my-5'
  ),
  expandIconWrapper: cn(
    'flex text-current rotate-0 transition-[transform] duration-150 ease-in-out delay-0 h-5 w-5',
    expanded && 'rotate-180'
  )
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
    const classes = getClasses({
      disabled,
      enableGutters,
      expanded,
      className
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
        className={classes.root}
        focusVisibleClassName={focusVisibleClassName}
        onClick={handleChange}
        ref={ref}
        {...other}
      >
        <div className={classes.content}>{children}</div>
        {expandIcon && (
          <div className={classes.expandIconWrapper}>{expandIcon}</div>
        )}
      </ButtonBase>
    );
  }
);
AccordionSummary.displayName = 'AccordionSummary';

export default AccordionSummary;
