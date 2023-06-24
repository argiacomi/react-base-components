import React from 'react';
import { setRef, useEnhancedEffect } from '@components/lib';
import { usePortalContext } from './PortalContext';

function getElement(element) {
  return typeof element === 'function'
    ? element()
    : typeof element === 'string'
    ? document.getElementById(element)
    : element;
}

function usePortalNode({ container: root, id, ref, disablePortal = false }) {
  const [portalNode, setPortalNode] = React.useState(null);

  const uniqueId = React.useId();
  const portalContext = usePortalContext();

  const data = React.useMemo(
    () => ({ id, root, disablePortal, portalContext, uniqueId }),
    [id, root, disablePortal, portalContext, uniqueId]
  );

  const dataRef = React.useRef();

  useEnhancedEffect(() => {
    return () => {
      portalNode?.remove();
    };
  }, [portalNode, data]);

  useEnhancedEffect(() => {
    if (!disablePortal) {
      if (dataRef.current === data) return;

      dataRef.current = data;

      const { id, container: root, portalContext, uniqueId } = data;

      const resolvedContainer = getElement(root) ?? getElement('root');

      const existingIdRoot = id ? document.getElementById(id) : null;
      const attr = 'data-portal';

      if (existingIdRoot) {
        const subRoot = document.createElement('div');
        subRoot.id = uniqueId;
        subRoot.setAttribute(attr, '');
        existingIdRoot.appendChild(subRoot);
        setPortalNode(subRoot);
      } else {
        let container = resolvedContainer || portalContext?.portalNode;
        const ElementConstructor = container?.ownerDocument?.defaultView?.Element || window.Element;
        if (container && !(container instanceof ElementConstructor)) {
          container = container.current;
        }
        container = container || document.body;

        let idWrapper = null;
        if (id) {
          idWrapper = document.createElement('div');
          idWrapper.id = id;
          container.appendChild(idWrapper);
        }

        const subRoot = document.createElement('div');

        subRoot.id = uniqueId;
        subRoot.setAttribute(attr, '');

        container = idWrapper || container;
        container.appendChild(subRoot);

        setPortalNode(subRoot);
      }
    }
  }, [data]);

  useEnhancedEffect(() => {
    if (portalNode && !disablePortal) {
      setRef(ref, portalNode);
      return () => {
        setRef(ref, null);
      };
    }

    return undefined;
  }, [ref, portalNode, disablePortal]);

  return portalNode;
}

export default usePortalNode;
