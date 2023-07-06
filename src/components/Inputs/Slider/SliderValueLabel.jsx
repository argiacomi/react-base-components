import React from 'react';
import clsx from 'clsx';
import { sliderClasses } from './Slider';

const SliderValueLabel = React.forwardRef((props, ref) => {
  const { open, className, value } = props;
  const classes = {
    offset: clsx(open && sliderClasses.valueLabelOpen),
    circle: sliderClasses.valueLabelCircle,
    label: sliderClasses.valueLabelLabel
  };

  console.log(classes);

  return (
    <React.Fragment>
      <span className={clsx(classes.offset, className)} aria-hidden>
        <span className={classes.circle}>
          <span className={classes.label}>{value}</span>
        </span>
      </span>
    </React.Fragment>
  );
});

SliderValueLabel.displayName = 'SliderValueLabel';

export default SliderValueLabel;
