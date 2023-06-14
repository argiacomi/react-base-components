import React from 'react';
import { useEnhancedEffect } from '@component/hooks';

export function useSize(element) {
  const [size, setSize] = React.useState(undefined);

  useEnhancedEffect(() => {
    if (element) {
      setSize({ width: element.offsetWidth, height: element.offsetHeight });

      const resizeObserver = new ResizeObserver((entries) => {
        if (!Array.isArray(entries)) {
          return;
        }

        if (!entries.length) {
          return;
        }

        const entry = entries[0];
        let width;
        let height;

        if ('borderBoxSize' in entry) {
          const borderSizeEntry = entry['borderBoxSize'];
          const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;
          width = borderSize['inlineSize'];
          height = borderSize['blockSize'];
        } else {
          width = element.offsetWidth;
          height = element.offsetHeight;
        }

        setSize({ width, height });
      });

      resizeObserver.observe(element, { box: 'border-box' });

      return () => resizeObserver.unobserve(element);
    } else {
      setSize(undefined);
    }
  }, [element]);

  return size;
}
