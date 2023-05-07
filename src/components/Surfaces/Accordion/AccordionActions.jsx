import { forwardRef } from 'react';
import { cn } from '@utils';

const AccordionActions = forwardRef(
  ({ className, disableSpacing = false, ...other }, ref) => {
    const accordionActionsClasses = cn(
      'flex, items-center, p-2 justify-end',
      !disableSpacing && 'ml-4 first-of-type:ml-0',
      className
    );

    return (
      <div
        className={accordionActionsClasses}
        ref={ref}
        ownerState={ownerState}
        {...other}
      />
    );
  }
);
AccordionActions.displayName = 'AccordionActions';

export default AccordionActions;
