import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';
import ButtonBase from '@components/inputs/button/buttonBase';
import AccordionContext from './AccordionContext';

export const accordionSummaryClasses = {
  root: 'AccordionSummary-Root',
  content: 'AccordionSummary-Content',
  iconWrapper: 'AccordionSummary-ExpandIconWrapper',
  expanded: 'Expanded',
  focusVisible: 'FocusVisible',
  disabled: 'Disabled'
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
  }),
  ...ownerState.cssStyles
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
  const {
    children,
    component = 'div',
    expandIcon,
    focusVisibleClassName,
    onClick,
    slots = {},
    slotProps = {},
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const context = React.useContext(AccordionContext);
  const { disabled, enableGutters, expanded, toggle } = context;

  const ownerState = {
    ...props,
    cssStyles,
    disabled,
    enableGutters,
    expanded
  };

  const handleChange = (event) => {
    toggle?.(event);
    onClick?.(event);
  };

  const classes = {
    root: [
      accordionSummaryClasses.root,
      ownerState.disabled && accordionSummaryClasses.disabled,
      ownerState.expanded && accordionSummaryClasses.expanded
    ],
    content: [
      accordionSummaryClasses.content,
      ownerState.expanded && accordionSummaryClasses.expanded
    ],
    iconWrapper: [
      accordionSummaryClasses.iconWrapper,
      ownerState.expanded && accordionSummaryClasses.expanded
    ]
  };

  const AccordionSummaryComponent = slots.root || AccordionSummaryRoot;
  const accordionSummaryprops = useSlotProps({
    elementType: AccordionSummaryComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      disableFocusRipple: true,
      disableRipple: true,
      disabled,
      component: component,
      'aria-expanded': expanded,
      focusVisibleClassName: clsx(classes.focusVisible, focusVisibleClassName),
      onClick: handleChange,
      ref: ref
    },
    ownerState,
    className: classes.root
  });

  return (
    <AccordionSummaryComponent {...accordionSummaryprops}>
      <AccordionSummaryContent className={clsx(classes.content)} ownerState={ownerState}>
        {children}
      </AccordionSummaryContent>
      {expandIcon && (
        <AccordionSummaryExpandIconWrapper
          className={clsx(classes.iconWrapper)}
          ownerState={ownerState}
        >
          {expandIcon}
        </AccordionSummaryExpandIconWrapper>
      )}
    </AccordionSummaryComponent>
  );
});

AccordionSummary.displayName = 'AccordionSummary';

export default AccordionSummary;
