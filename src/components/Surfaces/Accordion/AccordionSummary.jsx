import React from 'react';
import clsx from 'clsx';
import styled from 'styled-components/macro';
import { ButtonBase } from '@components';
import AccordionContext from './AccordionContext';

const accordionSummaryClasses = {
  expanded: 'expanded',
  focusVisible: 'focusVisible',
  disabled: 'disabled'
};

const AccordionSummaryRoot = styled(ButtonBase)(({ theme, ownerState }) => ({
  display: 'flex',
  minHeight: theme.spacing(6),
  padding: `0 ${theme.spacing(2)}`,
  transition: theme.transition.create(
    ['min-height', 'background-color'],
    theme.transition.duration.shortest
  ),
  '&:focus-visible': {
    backgroundColor: '#rgba(0,0,0,0.12)'
  },
  [`&.${accordionSummaryClasses.disabled}`]: {
    opacity: 0.45
  },
  [`&:hover:not(.${accordionSummaryClasses.disabled})`]: {
    cursor: 'pointer'
  },
  ...(ownerState.enableGutters && {
    [`&.${accordionSummaryClasses.expanded}`]: {
      minHeight: theme.spacing(8)
    }
  })
}));

const AccordionSummaryContent = styled('div')(({ theme, ownerState }) => ({
  display: 'flex',
  flexGrow: 1,
  margin: '12px 0',
  ...(ownerState.enableGutters && {
    transition: theme.transition.create(['margin'], {
      duration: theme.transition.duration.shortest
    }),
    [`&.${accordionSummaryClasses.expanded}`]: {
      margin: `${theme.spacing(2.5)} 0`
    }
  })
}));

const AccordionSummaryExpandIconWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  color: theme.color.text.secondary,
  transform: 'rotate(0deg)',
  transition: theme.transition.create('transform', {
    duration: theme.transition.duration.shortest
  }),
  [`&.${accordionSummaryClasses.expanded}`]: {
    transform: 'rotate(180deg)'
  }
}));

const AccordionSummary = React.forwardRef((props, ref) => {
  const { children, className, expandIcon, focusVisibleClassName, onClick, ...other } = props;

  const context = React.useContext(AccordionContext);
  const { disabled, enableGutters, expanded, toggle } = context;

  const ownerState = {
    ...props,
    disabled,
    enableGutters,
    expanded
  };

  const handleChange = (event) => {
    toggle?.(event);
    onClick?.(event);
  };

  const classes = [
    disabled && accordionSummaryClasses.disabled,
    expanded && accordionSummaryClasses.expanded
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <AccordionSummaryRoot
      focusRipple={false}
      disableRipple
      disabled={disabled}
      component='div'
      aria-expanded={expanded}
      className={clsx('AccordionSummary-Root', classes, className)}
      focusVisibleClassName={clsx(classes.focusVisible, focusVisibleClassName)}
      onClick={handleChange}
      ref={ref}
      ownerState={ownerState}
      {...other}
    >
      <AccordionSummaryContent
        className={clsx('AccordionSummary-Content', expanded && accordionSummaryClasses.expanded)}
        ownerState={ownerState}
      >
        {children}
      </AccordionSummaryContent>
      {expandIcon && (
        <AccordionSummaryExpandIconWrapper
          className={clsx(
            'AccordionSummary-ExpandedIconWrapper',
            expanded && accordionSummaryClasses.expanded
          )}
          ownerState={ownerState}
        >
          {expandIcon}
        </AccordionSummaryExpandIconWrapper>
      )}
    </AccordionSummaryRoot>
  );
});

AccordionSummary.displayName = 'AccordionSummary';

export default AccordionSummary;
