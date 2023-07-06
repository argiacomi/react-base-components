import React from 'react';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';
import { Collapse, Paper } from '@components';
import { useControlled } from '@component/hooks';
import AccordionContext from './AccordionContext';

export const accordionClasses = {
  root: 'Accordion-Root',
  region: 'Accordion-Region',
  rounded: 'Rounded',
  expanded: 'Expanded',
  disabled: 'Disabled',
  gutters: 'Gutters'
};

const AccordionRoot = styled(Paper)(
  ({ theme }) => ({
    position: 'relative',
    transition: theme.transition.create(['margin'], theme.transition.duration.shortest),
    overflowAnchor: 'none',
    '&:before': {
      position: 'absolute',
      left: 0,
      top: -1,
      right: 0,
      height: 1,
      content: '""',
      opacity: 1,
      backgroundColor: theme.color.divider,
      transition: theme.transition.create(
        ['opacity', 'background-color'],
        theme.transition.duration.shortest
      )
    },
    '&:first-of-type': {
      '&:before': {
        display: 'none'
      }
    },
    [`&.${accordionClasses.expanded}`]: {
      '&:first-of-type': {
        marginTop: 0
      },
      '&:last-of-type': {
        marginBottom: 0
      }
    },
    [`&.${accordionClasses.disabled}`]: {
      backgroundColor: theme.color.disabled.body
    }
  }),
  ({ theme, ownerState }) => ({
    ...(!ownerState.square && {
      borderRadius: 0,
      '&:first-of-type': {
        borderTopLeftRadius: theme.rounded.md,
        borderTopRightRadius: theme.rounded.md
      },
      '&:last-of-type': {
        borderBottomLeftRadius: theme.rounded.md,
        borderBottomRightRadius: theme.rounded.md,
        '@supports (-ms-ime-align: auto)': {
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0
        }
      }
    }),
    ...(ownerState.enableGutters && {
      [`&.${accordionClasses.expanded}`]: {
        margin: '1rem 0'
      },
      '&:before': {
        opacity: 0
      },
      '& + &': {
        '&:before': {
          display: 'none'
        }
      }
    }),
    ...ownerState.cssStyles
  })
);

const Accordion = React.forwardRef((props, ref) => {
  const {
    children: childrenProp,
    defaultExpanded = false,
    disabled = false,
    enableGutters = false,
    expanded: expandedProp,
    onChange,
    slots = {},
    slotProps = {},
    square = false,
    TransitionComponent = Collapse,
    TransitionProps,
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const [expanded, setExpandedState] = useControlled({
    controlled: expandedProp,
    default: defaultExpanded,
    name: 'Accordion',
    state: 'expanded'
  });

  const handleChange = React.useCallback(
    (event) => {
      setExpandedState(!expanded);

      if (onChange) {
        onChange(event, !expanded);
      }
    },
    [expanded, onChange, setExpandedState]
  );

  const [summary, ...children] = React.Children.toArray(childrenProp);
  const contextValue = React.useMemo(
    () => ({ expanded, disabled, enableGutters, toggle: handleChange }),
    [expanded, disabled, enableGutters, handleChange]
  );

  const ownerState = {
    ...props,
    cssStyles,
    square,
    disabled,
    enableGutters,
    expanded
  };

  const classes = {
    root: [
      accordionClasses.root,
      !ownerState.square && accordionClasses.rounded,
      ownerState.expanded && accordionClasses.expanded,
      ownerState.disabled && accordionClasses.disabled,
      !ownerState.disableGutters && accordionClasses.gutters
    ],
    region: accordionClasses.region
  };

  const AccordionComponent = slots.root || AccordionRoot;
  const accordionProps = useSlotProps({
    elementType: AccordionComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: ref,
      square
    },
    ownerState,
    className: classes.root
  });

  return (
    <AccordionComponent {...accordionProps}>
      <AccordionContext.Provider value={contextValue}>{summary}</AccordionContext.Provider>
      <TransitionComponent in={expanded} timeout='auto' {...TransitionProps}>
        <div
          aria-labelledby={summary.props.id}
          id={summary.props['aria-controls']}
          role='region'
          className={classes.region}
        >
          {children}
        </div>
      </TransitionComponent>
    </AccordionComponent>
  );
});
Accordion.displayName = 'Accordion';

export default Accordion;
