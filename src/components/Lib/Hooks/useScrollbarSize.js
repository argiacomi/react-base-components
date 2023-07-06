import React from 'react';
import { debounce, ownerWindow, useEnhancedEffect } from '@components/lib';

export function useScrollbarSize(scrollable = true) {
  const [dimensions, setDimensions] = React.useState({ height: 0, width: 0 });
  const nodeRef = React.useRef(null);

  const getElement = () => {
    if (nodeRef.current == null) {
      nodeRef.current = document.createElement('div');
      nodeRef.current.style.visibility = 'hidden';
      nodeRef.current.style.width = '99px';
      nodeRef.current.style.height = '99px';
      nodeRef.current.style.overflow = 'scroll';
      nodeRef.current.style.position = 'absolute';
      nodeRef.current.style.top = '-9999px';
      nodeRef.current.setAttribute('aria-hidden', 'true');
      nodeRef.current.setAttribute('role', 'presentation');
    }
    return nodeRef.current;
  };

  useEnhancedEffect(() => {
    if (!scrollable) {
      return;
    }

    const updateState = () => {
      const { offsetHeight, clientHeight, offsetWidth, clientWidth } = getElement();
      const scrollbarHeight = offsetHeight - clientHeight;
      const scrollbarWidth = offsetWidth - clientWidth;

      setDimensions((prevDims) => {
        const { height, width } = prevDims;
        return height !== scrollbarHeight || width !== scrollbarWidth
          ? { height: scrollbarHeight, width: scrollbarWidth }
          : prevDims;
      });
    };
    updateState();

    const handleResize = debounce(updateState);
    const containerWindow = ownerWindow(nodeRef.current);
    containerWindow.addEventListener('resize', handleResize);
    document.body.appendChild(nodeRef.current);

    return () => {
      handleResize.clear();
      containerWindow.removeEventListener('resize', handleResize);
      document.body.removeChild(nodeRef.current);
    };
  }, []);

  return dimensions;
}
