import React from 'react';
import clsx from 'clsx';

export const accordionGroupClasses = { root: 'AccordionGroup-Root' };

const AccordionGroup = React.forwardRef((props, ref) => {
  const {
    children,
    className,
    component,
    defaultExpanded = false,
    disabled = false,
    enableGutters = false,
    square = false,
    ...other
  } = props;

  const AccordionGroupRoot = component || 'div';

  return (
    <AccordionGroupRoot
      as={component}
      className={clsx(accordionGroupClasses.root, className)}
      ref={ref}
      {...other}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
          return null;
        }
        return React.cloneElement(child, {
          className: clsx(child.props.className),
          defaultExpanded: defaultExpanded,
          disabled: disabled,
          enableGutters: enableGutters,
          square: square
        });
      })}
    </AccordionGroupRoot>
  );
});
AccordionGroup.displayName = 'AccordionGroup';

export default AccordionGroup;
