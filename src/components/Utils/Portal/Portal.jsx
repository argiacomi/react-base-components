import React from 'react';
import clsx from 'clsx';
import { createPortal } from 'react-dom';
import { PortalContext } from './PortalContext';
import usePortalNode from './usePortalNode';

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
