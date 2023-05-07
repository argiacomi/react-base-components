import { useEffect, useState } from 'react';
import { cn } from '@utils';

const Ripple = ({
  className,
  classes,
  pulsate = false,
  rippleX,
  rippleY,
  rippleSize,
  in: inProp,
  onExited,
  timeout
}) => {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!inProp) {
      setLeaving(true);
    }

    if (!inProp && onExited) {
      const timeoutId = setTimeout(onExited, timeout);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [inProp, onExited, timeout]);

  const rippleClassName = cn(
    className,
    classes.ripple,
    classes.rippleVisible,
    pulsate && classes.ripplePulsate
  );

  const rippleStyles = {
    width: rippleSize,
    height: rippleSize,
    top: -(rippleSize / 2) + rippleY,
    left: -(rippleSize / 2) + rippleX
  };

  const childClassName = cn(
    classes.child,
    leaving && classes.childLeaving,
    pulsate && classes.childPulsate
  );

  return (
    <span className={rippleClassName} style={rippleStyles}>
      <span className={childClassName} />
    </span>
  );
};
Ripple.displayName = 'Ripple';

export default Ripple;
