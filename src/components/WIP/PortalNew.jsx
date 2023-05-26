import * as React from 'react';
import { createPortal } from 'react-dom';
import { useEnhancedEffect, useForkRef } from '@component-hooks';
import { setRef } from '../Lib';
import {
  disableFocusInside,
  enableFocusInside,
  getNextTabbable,
  getPreviousTabbable,
  isOutsideEvent
} from '@component-hooks';

const PortalContext = React.createContext(null);

function getElement(element) {
  return typeof element === 'function' ? element() : element;
}

function usePortalNode({ container, id, root, disablePortal = false }) {
  const [portalNode, setPortalNode] = React.useState(null);

  const uniqueId = React.useId();
  const portalContext = usePortalContext();

  const data = React.useMemo(
    () => ({ container, id, root, disablePortal, portalContext, uniqueId }),
    [container, id, root, disablePortal, portalContext, uniqueId]
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
        root,
        disablePortal,
        portalContext,
        uniqueId
      } = data;

      const resolvedContainer = getElement(containerProp);
      const resolvedRoot = root ? document.getElementById(root) : null;

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
          resolvedContainer ||
          portalContext?.portalNode ||
          resolvedRoot ||
          document.body;

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
    {
      children,
      container,
      id,
      root,
      disablePortal = false,
      preserveTabOrder = true
    },
    ref
  ) => {
    const portalNode = usePortalNode({ id, container, root, disablePortal });
    const [focusManagerState, setFocusManagerState] = React.useState();

    const beforeOutsideRef = React.useRef(null);
    const afterOutsideRef = React.useRef(null);
    const beforeInsideRef = React.useRef(null);
    const afterInsideRef = React.useRef(null);

    const shouldRenderGuards =
      !!focusManagerState &&
      !focusManagerState.modal &&
      focusManagerState.open &&
      preserveTabOrder &&
      !!(container || portalNode);

    useEnhancedEffect(() => {
      if (!portalNode || !preserveTabOrder || focusManagerState?.modal) {
        return;
      }
      function onFocus(event) {
        if (portalNode && isOutsideEvent(event)) {
          const focusing = event.type === 'focusin';
          const manageFocus = focusing ? enableFocusInside : disableFocusInside;
          manageFocus(portalNode);
        }
      }

      portalNode.addEventListener('focusin', onFocus, true);
      portalNode.addEventListener('focusout', onFocus, true);
      return () => {
        portalNode.removeEventListener('focusin', onFocus, true);
        portalNode.removeEventListener('focusout', onFocus, true);
      };
    }, [portalNode, preserveTabOrder, focusManagerState?.modal]);

    return (
      <PortalContext.Provider
        value={React.useMemo(
          () => ({
            preserveTabOrder,
            beforeOutsideRef,
            afterOutsideRef,
            beforeInsideRef,
            afterInsideRef,
            portalNode,
            setFocusManagerState
          }),
          [preserveTabOrder, portalNode]
        )}
      >
        {disablePortal ? (
          <React.Fragment>{children}</React.Fragment>
        ) : (
          <React.Fragment>
            {shouldRenderGuards && portalNode && (
              <FocusGuard
                data-type='outside'
                ref={beforeOutsideRef}
                onFocus={(event) => {
                  if (isOutsideEvent(event, portalNode)) {
                    beforeInsideRef.current?.focus();
                  } else {
                    const prevTabbable =
                      getPreviousTabbable() ||
                      focusManagerState?.refs.domReference.current;
                    prevTabbable?.focus();
                  }
                }}
              />
            )}
            {shouldRenderGuards && portalNode && (
              <span aria-owns={portalNode.id} className={HIDDEN_STYLES} />
            )}
            {portalNode && createPortal(children, portalNode)}
            {shouldRenderGuards && portalNode && (
              <FocusGuard
                data-type='outside'
                ref={afterOutsideRef}
                onFocus={(event) => {
                  if (isOutsideEvent(event, portalNode)) {
                    afterInsideRef.current?.focus();
                  } else {
                    const nextTabbable =
                      getNextTabbable() ||
                      focusManagerState?.refs.domReference.current;
                    nextTabbable?.focus();
                    focusManagerState?.closeOnFocusOut &&
                      focusManagerState?.onOpenChange(false);
                  }
                }}
              />
            )}
          </React.Fragment>
        )}
      </PortalContext.Provider>
    );
  }
);
Portal.displayName = 'Portal';

const usePortalContext = () => React.useContext(PortalContext);

export { Portal, usePortalContext };
