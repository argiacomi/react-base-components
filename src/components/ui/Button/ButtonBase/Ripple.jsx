import React, { useEffect, useState } from 'react';
import { cn } from '../../../../lib/utils';

function Ripple(props) {
  const {
    className,
    classes,
    pulsate = false,
    rippleX,
    rippleY,
    rippleSize,
    in: inProp,
    onExited,
    timeout
  } = props;
  const [leaving, setLeaving] = useState(false);

  const rippleClassName = cn(
    className,
    classes.ripple,
    classes.rippleVisible,
    pulsate ? classes.ripplePulsate : null
  );

  const rippleStyles = {
    width: rippleSize,
    height: rippleSize,
    top: -(rippleSize / 2) + rippleY,
    left: -(rippleSize / 2) + rippleX
  };

  const childClassName = cn(
    classes.child,
    leaving ? classes.childLeaving : null,
    pulsate ? classes.childPulsate : null
  );

  if (!inProp && !leaving) {
    setLeaving(true);
  }
  React.useEffect(() => {
    if (!inProp && onExited != null) {
      const timeoutId = setTimeout(onExited, timeout);
      return () => {
        clearTimeout(timeoutId);
      };
    }
    return undefined;
  }, [onExited, inProp, timeout]);

  return (
    <span className={rippleClassName} style={rippleStyles}>
      <span className={childClassName} />
    </span>
  );
}

export default Ripple;
