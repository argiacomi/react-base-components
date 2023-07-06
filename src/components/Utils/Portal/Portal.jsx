import React from 'react';
import { createPortal } from 'react-dom';
import usePortalNode from './usePortalNode';

const Portal = React.forwardRef((props, ref) => {
  const { children } = props;

  const { disablePortal, handleRef, mountNode } = usePortalNode({ props, ref });

  if (disablePortal) {
    if (React.isValidElement(children)) {
      const newProps = {
        ref: handleRef
      };
      return React.cloneElement(children, newProps);
    }
    return <React.Fragment>{children}</React.Fragment>;
  }

  return (
    <React.Fragment>{mountNode ? createPortal(children, mountNode) : mountNode}</React.Fragment>
  );
});
Portal.displayName = 'Portal';

export default Portal;
