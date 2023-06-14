import React from 'react';
import clsx from 'clsx';
import { useEnhancedEffect } from '@component/hooks';

const Ripple = (props) => {
  const { className, classes, rippleX, rippleY, rippleSize, in: inProp, onExited, timeout } = props;
  const [leaving, setLeaving] = React.useState(false);

  const rippleClassName = clsx(className, classes.ripple, classes.rippleVisible);

  const rippleStyles = {
    width: rippleSize,
    height: rippleSize,
    top: -(rippleSize / 2) + rippleY,
    left: -(rippleSize / 2) + rippleX
  };

  const childClassName = clsx(classes.child, {
    [classes.childLeaving]: leaving
  });

  if (!inProp && !leaving) {
    setLeaving(true);
  }
  useEnhancedEffect(() => {
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
};
Ripple.displayName = 'Ripple';

export default Ripple;
