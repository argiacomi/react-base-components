import { useEffect, useState } from 'react';
import tw, { css } from 'twin.macro';

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

  const rippleRootStyles = [
    classes.ripple,
    classes.rippleVisible,
    pulsate && classes.ripplePulsate
  ].filter(Boolean);

  const rippleStyles = {
    width: rippleSize,
    height: rippleSize,
    top: -(rippleSize / 2) + rippleY,
    left: -(rippleSize / 2) + rippleX
  };

  const childStyles = [
    classes.child,
    leaving && classes.childLeaving,
    pulsate && classes.childPulsate
  ].filter(Boolean);

  return (
    <span className={className} css={rippleRootStyles} style={rippleStyles}>
      <span css={childStyles} />
    </span>
  );
};
Ripple.displayName = 'Ripple';

export default Ripple;
