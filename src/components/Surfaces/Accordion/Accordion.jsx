import React, { createContext, useCallback, useMemo, forwardRef } from 'react';
import { cn } from '@utils';
import tw from 'twin.macro';
import { Collapse, Paper } from '@components';
import { useControlled } from '@component-hooks';

const AccordionContext = React.createContext({});

if (process.env.NODE_ENV !== 'production') {
  AccordionContext.displayName = 'AccordionContext';
}

const Accordion = forwardRef(
  (
    {
      children: childrenProp,
      className,
      defaultExpanded = false,
      disabled = false,
      enableGutters = false,
      expanded: expandedProp,
      onChange,
      square = false,
      TransitionComponent = Collapse,
      TransitionProps,
      ...other
    },
    ref
  ) => {
    const [expanded, setExpandedState] = useControlled({
      controlled: expandedProp,
      default: defaultExpanded,
      name: 'Accordion',
      state: 'expanded'
    });

    const handleChange = useCallback(
      (event) => {
        setExpandedState(!expanded);

        if (onChange) {
          onChange(event, !expanded);
        }
      },
      [expanded, onChange, setExpandedState]
    );

    const [summary, ...children] = React.Children.toArray(childrenProp);
    const contextValue = useMemo(
      () => ({ expanded, disabled, enableGutters, toggle: handleChange }),
      [expanded, disabled, enableGutters, handleChange]
    );

    const accordionBase = tw`relative [overflow-anchor:none] transition-[margin] delay-[0ms]`;

    const accordionDivider = tw`before:absolute before:left-0 before:top-[-1px] before:right-0 before:h-[1px] before:content-[""] before:opacity-100 before:bg-dividerLight dark:before:bg-dividerDark before:transition-[opacity,background-color] before:delay-[0ms] first-of-type:before:hidden`;

    const accordionStyles = [
      accordionBase,
      accordionDivider,
      expanded &&
        tw`first-of-type:mt-0 last-of-type:mb-0 ['& + &']:before:hidden`,
      disabled &&
        tw`bg-disabledLight text-disabledText dark:bg-disabledDark dark:text-disabledText`,
      !square &&
        tw`rounded-none first-of-type:rounded-t-md last-of-type:rounded-b-md`,
      enableGutters && expanded && tw`before:opacity-0 my-4`
    ].filter(Boolean);

    return (
      <Paper
        className={className}
        css={accordionStyles}
        ref={ref}
        square={square}
        {...other}
      >
        <AccordionContext.Provider value={contextValue}>
          {summary}
        </AccordionContext.Provider>
        <TransitionComponent in={expanded} timeout='auto' {...TransitionProps}>
          <div
            aria-labelledby={summary.props.id}
            id={summary.props['aria-controls']}
            role='region'
          >
            {children}
          </div>
        </TransitionComponent>
      </Paper>
    );
  }
);
Accordion.displayName = 'Accordion';

export { Accordion, AccordionContext };
