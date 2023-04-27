import { forwardRef } from 'react';
import { cn } from '@utils';

const AccordionDetails = forwardRef(({ className, ...other }, ref) => {
  const accordionDetailsClasses = cn('pt-2 pb-4 px-4 ', className);

  return <div className={accordionDetailsClasses} ref={ref} {...other} />;
});
AccordionDetails.displayName = 'AccordionDetails';

export default AccordionDetails;
