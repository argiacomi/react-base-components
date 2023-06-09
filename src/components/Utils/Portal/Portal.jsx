import * as React from 'react';
import clsx from 'clsx';
import { createPortal } from 'react-dom';
import { useEnhancedEffect } from '@component/hooks';
import { setRef } from '@component/utils';
import { PortalContext, usePortalContext } from './PortalContext';

export const HIDDEN_STYLES = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'fixed',
  whiteSpace: 'nowrap',
  width: '1px',
  top: 0,
  left: 0
};

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

const Portal = React.forwardRef((props, ref) => {
  const { className, children, container = null, id, disablePortal = false } = props;

  const portalNode = usePortalNode({ container, id, ref, disablePortal });

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
            <span
              className={clsx('Portal-Node', className)}
              aria-owns={portalNode.id}
              style={HIDDEN_STYLES}
            />
          )}
          {portalNode && createPortal(children, portalNode)}
        </React.Fragment>
      )}
    </PortalContext.Provider>
  );
});
Portal.displayName = 'Portal';

export default Portal;
