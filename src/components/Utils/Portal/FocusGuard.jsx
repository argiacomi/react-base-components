import * as React from 'react';
import { useEnhancedEffect } from '@component-hooks';
import { cn } from '@utils';

const HIDDEN_STYLES =
  'clip-all border-0 overflow-hidden h-[0px] m-[-1px] p-0 fixed whitespace-nowrap w-[0px] top-0 left-0';

let activeElement;
let timeoutId;

function setActiveElementOnTab(event) {
  if (event.key === 'Tab') {
    activeElement = event.target;
    clearTimeout(timeoutId);
  }
}

const FocusGuard = React.forwardRef((props, ref) => {
  const [role, setRole] = React.useState();

  useEnhancedEffect(() => {
    if (/apple/i.test(navigator.vendor)) {
      setRole('button');
    }

    document.addEventListener('keydown', setActiveElementOnTab);
    return () => {
      document.removeEventListener('keydown', setActiveElementOnTab);
    };
  }, []);

  return (
    <span
      {...props}
      ref={ref}
      tabIndex={0}
      role={role}
      aria-hidden={role ? undefined : true}
      data-floating-ui-focus-guard=''
      className={cn(props.classNames, HIDDEN_STYLES)}
    />
  );
});

FocusGuard.displayName = 'FocusGuard';

export { FocusGuard, HIDDEN_STYLES };
