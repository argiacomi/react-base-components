import React, {
  cloneElement,
  forwardRef,
  isValidElement,
  useMemo
} from 'react';
import { cn } from '@utils';

const AccordionGroup = forwardRef(
  (
    {
      children,
      className,
      Component = 'div',
      defaultExpanded = false,
      disabled = false,
      enableGutters = false,
      square = false,
      ...other
    },
    ref
  ) => {
    return (
      <Component className={className} ref={ref} {...other}>
        {React.Children.map(children, (child) => {
          if (!isValidElement(child)) {
            return null;
          }
          return cloneElement(child, {
            className: cn(child.props.className),
            defaultExpanded: defaultExpanded,
            disabled: disabled,
            enableGutters: enableGutters,
            square: square
          });
        })}
      </Component>
    );
  }
);
AccordionGroup.displayName = 'AccordionGroup';

export default AccordionGroup;
