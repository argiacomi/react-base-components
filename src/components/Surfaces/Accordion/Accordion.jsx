import React, { createContext, useCallback, useMemo, forwardRef } from 'react';
import { cn } from '@utils';
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

    const accordionBase = `
      relative no-overflow-anchoring before bg-white
      text-black dark:bg-black dark:text-white delay-0 transition-[margin] shadow-paper1
    `;

    const accordionDivider = `
      before:content-[''] before:absolute before:left-0 before:top-[-1px] before:right-0
      before:h-[1px] before:opacity-100 before:bg-separatorLight dark:before:bg-separatorDark
      before:transition-[opacity,background-color] before:delay-0 before:first-of-type:hidden
    `;

    const paperClasses = cn(
      accordionDivider,
      accordionBase,
      expanded && 'm-0 before:opacity-0 first-of-type:mt-0 last-of-type:mb-0',
      !square &&
        'rounded-none first-of-type:rounded-t-md last-of-type:rounded-b-md',
      enableGutters && expanded && 'my-4',
      disabled &&
        'bg-disabledLight text-disabledText dark:bg-disabledDark dark:text-disabledText',
      className
    );

    return (
      <Paper className={paperClasses} ref={ref} square={square} {...other}>
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
