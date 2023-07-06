import React from 'react';
import { setRef, useEnhancedEffect, useForkRef } from '@components/lib';

function getContainer(element) {
  return typeof element === 'function'
    ? element()
    : typeof element === 'string'
    ? document.getElementById(element)
    : element;
}

function usePortalNode(parameters) {
  const { children, container, disablePortal = false } = parameters.props;
  const externalRef = parameters.ref;

  const [mountNode, setMountNode] = React.useState(null);

  const handleRef = useForkRef(React.isValidElement(children) ? children.ref : null, externalRef);

  useEnhancedEffect(() => {
    if (!disablePortal) {
      setMountNode(getContainer(container) || getContainer('root'));
    }
  }, [container, disablePortal]);

  useEnhancedEffect(() => {
    if (mountNode && !disablePortal) {
      setRef(externalRef, mountNode);
      return () => {
        setRef(externalRef, null);
      };
    }
  }, [externalRef, mountNode, disablePortal]);

  return { disablePortal, handleRef, mountNode };
}

export default usePortalNode;
