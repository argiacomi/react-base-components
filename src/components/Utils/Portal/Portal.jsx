import * as React from 'react';
import { createPortal } from 'react-dom';
import { useEnhancedEffect, useForkRef } from '@component-hooks';
import {
  disableFocusInside,
  enableFocusInside,
  getNextTabbable,
  getPreviousTabbable,
  isOutsideEvent,
  setRef
} from '@components/lib';
import { FocusGuard, HIDDEN_STYLES } from './FocusGuard';

const PortalContext = React.createContext(null);

function getElement(element) {
  return typeof element === 'function'
    ? element()
    : typeof element === 'string'
    ? document.getElementById(element)
    : element;
}

function usePortalNode({ container, id, disablePortal = false }) {
  const [portalNode, setPortalNode] = React.useState(null);

  const uniqueId = React.useId();
  const portalContext = usePortalContext();

  const data = React.useMemo(
    () => ({ container, id, disablePortal, portalContext, uniqueId }),
    [container, id, disablePortal, portalContext, uniqueId]
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

      const {
        container: containerProp,
        id,
        disablePortal,
        portalContext,
        uniqueId
      } = data;

      const resolvedContainer = getElement(containerProp) ?? getElement('root');

      const existingIdRoot = id ? document.getElementById(id) : null;
      const attr = 'data-portal';

      if (existingIdRoot) {
        const subRoot = document.createElement('div');
        subRoot.id = uniqueId;
        subRoot.setAttribute(attr, '');
        existingIdRoot.appendChild(subRoot);
        setPortalNode(subRoot);
      } else {
        let containerElement =
          resolvedContainer || portalContext?.portalNode || document.body;

        let idWrapper = null;
        if (id) {
          idWrapper = document.createElement('div');
          idWrapper.id = id;
          containerElement.appendChild(idWrapper);
        }

        const subRoot = document.createElement('div');

        subRoot.id = uniqueId;
        subRoot.setAttribute(attr, '');

        containerElement = idWrapper || containerElement;
        containerElement.appendChild(subRoot);

        setPortalNode(subRoot);
      }
    }
  }, [container, data, disablePortal]);

  useEnhancedEffect(() => {
    if (portalNode && !disablePortal) {
      setRef(dataRef, portalNode);
      return () => {
        setRef(dataRef, null);
      };
    }

    return undefined;
  }, [dataRef, portalNode, disablePortal]);

  return portalNode;
}

const Portal = React.forwardRef(
  (
    { children, container, id, disablePortal = false, preserveTabOrder = true },
    ref
  ) => {
    const portalNode = usePortalNode({ id, container, disablePortal });

    return (
      <PortalContext.Provider
        value={React.useMemo(
          () => ({
            portalNode
          }),
          [portalNode]
        )}
      >
        {disablePortal ? (
          <React.Fragment>{children}</React.Fragment>
        ) : (
          <React.Fragment>
            {portalNode && (
              <span aria-owns={portalNode.id} className={HIDDEN_STYLES} />
            )}
            {portalNode && createPortal(children, portalNode)}
          </React.Fragment>
        )}
      </PortalContext.Provider>
    );
  }
);
Portal.displayName = 'Portal';

const usePortalContext = () => React.useContext(PortalContext);

export { Portal, usePortalContext };
