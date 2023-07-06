import React from 'react';
import clsx from 'clsx';
import styled from '@styles';

export const accordionDetailsClasses = { root: 'AccordionDetails-Root' };

const AccordionDetailsRoot = styled('div')(({ theme }) => ({
  padding: `${theme.spacing(1)} ${theme.spacing(2)} ${theme.spacing(2)}`
}));

const AccordionDetails = React.forwardRef((props, ref) => {
  const { className, ...other } = props;

  return (
    <AccordionDetailsRoot
      className={clsx(accordionDetailsClasses.root, className)}
      ref={ref}
      {...other}
    />
  );
});
AccordionDetails.displayName = 'AccordionDetails';

export default AccordionDetails;
