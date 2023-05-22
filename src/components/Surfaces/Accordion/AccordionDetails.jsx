import { forwardRef } from 'react';
import 'twin.macro';

const AccordionDetails = forwardRef(({ className, ...other }, ref) => {
  return <div className={className} tw='pt-2 pb-4 px-4' ref={ref} {...other} />;
});
AccordionDetails.displayName = 'AccordionDetails';

export default AccordionDetails;
