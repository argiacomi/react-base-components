import React from 'react';
import clsx from 'clsx';
import { styled } from '@styles';
import { Collapse, Paper } from '@components';
import { useControlled } from '@component/hooks';
import AccordionContext from './AccordionContext';

const accordionClasses = {
  root: 'Accordion-Root',
  region: 'Accordion-Region',
  expanded: 'expanded',
  disabled: 'disabled'
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
      color: theme.color.disabled.text,
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
    })
  })
);

const Accordion = React.forwardRef((props, ref) => {
  const {
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
  } = props;

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
    square,
    disabled,
    enableGutters,
    expanded
  };

  const classes = {
    root: [
      accordionClasses.root,
      ownerState.expanded && accordionClasses.expanded,
      ownerState.disabled && accordionClasses.disabled
    ],
    region: accordionClasses.region
  };

  return (
    <AccordionRoot
      className={clsx(classes.root, className)}
      ref={ref}
      ownerState={ownerState}
      square={square}
      {...other}
    >
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
    </AccordionRoot>
  );
});
Accordion.displayName = 'Accordion';

export default Accordion;
