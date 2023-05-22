import { forwardRef } from 'react';
import tw from 'twin.macro';

const AccordionActions = forwardRef(
  ({ className, disableSpacing = false, ...other }, ref) => {
    const actionStyles = [
      tw`flex items-center p-2 justify-end`,
      !disableSpacing && tw`ml-4 first-of-type:ml-0`
    ].filter(Boolean);

    return (
      <div
        className={className}
        css={actionStyles}
        ref={ref}
        ownerState={ownerState}
        {...other}
      />
    );
  }
);
AccordionActions.displayName = 'AccordionActions';

export default AccordionActions;
