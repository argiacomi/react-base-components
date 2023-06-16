import React from 'react';
import ReactDOM from 'react-dom';
import { debounce, useForkRef, useEnhancedEffect, ownerWindow } from '@components/lib';

function getStyleValue(value) {
  return parseInt(value, 10) || 0;
}

const styles = {
  shadow: {
    visibility: 'hidden',
    position: 'absolute',
    overflow: 'hidden',
    height: 0,
    top: 0,
    left: 0,
    transform: 'translateZ(0)'
  }
};

function isEmpty(obj) {
  return (
    obj === undefined ||
    obj === null ||
    Object.keys(obj).length === 0 ||
    (obj.outerHeightStyle === 0 && !obj.overflow)
  );
}

const TextareaAutosize = React.forwardRef((props, ref) => {
  const { onChange, maxRows, minRows = 1, style, value, ...other } = props;

  const { current: isControlled } = React.useRef(value != null);
  const inputRef = React.useRef(null);
  const handleRef = useForkRef(ref, inputRef);
  const shadowRef = React.useRef(null);
  const renders = React.useRef(0);
  const [state, setState] = React.useState({
    outerHeightStyle: 0
  });

  const getUpdatedState = React.useCallback(() => {
    const input = inputRef.current;

    const containerWindow = ownerWindow(input);
    const computedStyle = containerWindow.getComputedStyle(input);

    if (computedStyle.width === '0px') {
      return {
        outerHeightStyle: 0
      };
    }

    const inputShallow = shadowRef.current;

    inputShallow.style.width = computedStyle.width;
    inputShallow.value = input.value || props.placeholder || 'x';
    if (inputShallow.value.slice(-1) === '\n') {
      inputShallow.value += ' ';
    }

    const boxSizing = computedStyle.boxSizing;
    const padding =
      getStyleValue(computedStyle.paddingBottom) + getStyleValue(computedStyle.paddingTop);
    const border =
      getStyleValue(computedStyle.borderBottomWidth) + getStyleValue(computedStyle.borderTopWidth);

    const innerHeight = inputShallow.scrollHeight;

    inputShallow.value = 'x';
    const singleRowHeight = inputShallow.scrollHeight;

    let outerHeight = innerHeight;

    if (minRows) {
      outerHeight = Math.max(Number(minRows) * singleRowHeight, outerHeight);
    }
    if (maxRows) {
      outerHeight = Math.min(Number(maxRows) * singleRowHeight, outerHeight);
    }
    outerHeight = Math.max(outerHeight, singleRowHeight);

    const outerHeightStyle = outerHeight + (boxSizing === 'border-box' ? padding + border : 0);
    const overflow = Math.abs(outerHeight - innerHeight) <= 1;

    return { outerHeightStyle, overflow };
  }, [maxRows, minRows, props.placeholder]);

  const updateState = (prevState, newState) => {
    const { outerHeightStyle, overflow } = newState;
    if (
      renders.current < 20 &&
      ((outerHeightStyle > 0 &&
        Math.abs((prevState.outerHeightStyle || 0) - outerHeightStyle) > 1) ||
        prevState.overflow !== overflow)
    ) {
      renders.current += 1;
      return {
        overflow,
        outerHeightStyle
      };
    }
    if (!import.meta.env.PROD) {
      if (renders.current === 20) {
        console.error(
          `Too many re-renders. The layout is unstable.
            TextareaAutosize limits the number of renders to prevent an infinite loop.`
        );
      }
    }
    return prevState;
  };

  const syncHeight = React.useCallback(() => {
    const newState = getUpdatedState();

    if (isEmpty(newState)) {
      return;
    }

    setState((prevState) => {
      return updateState(prevState, newState);
    });
  }, [getUpdatedState]);

  const syncHeightWithFlushSync = () => {
    const newState = getUpdatedState();

    if (isEmpty(newState)) {
      return;
    }

    ReactDOM.flushSync(() => {
      setState((prevState) => {
        return updateState(prevState, newState);
      });
    });
  };

  React.useEffect(() => {
    const handleResize = debounce(() => {
      renders.current = 0;

      if (inputRef.current) {
        syncHeightWithFlushSync();
      }
    });
    let resizeObserver;

    const input = inputRef.current;
    const containerWindow = ownerWindow(input);

    containerWindow.addEventListener('resize', handleResize);

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(input);
    }

    return () => {
      handleResize.clear();
      containerWindow.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  });

  useEnhancedEffect(() => {
    syncHeight();
  });

  React.useEffect(() => {
    renders.current = 0;
  }, [value]);

  const handleChange = (event) => {
    renders.current = 0;

    if (!isControlled) {
      syncHeight();
    }

    if (onChange) {
      onChange(event);
    }
  };

  return (
    <React.Fragment>
      <textarea
        value={value}
        onChange={handleChange}
        ref={handleRef}
        rows={minRows}
        style={{
          height: state.outerHeightStyle,
          overflow: state.overflow ? 'hidden' : undefined,
          ...style
        }}
        {...other}
      />
      <textarea
        aria-hidden
        className={props.className}
        readOnly
        ref={shadowRef}
        tabIndex={-1}
        style={{
          ...styles.shadow,
          ...style,
          padding: 0
        }}
      />
    </React.Fragment>
  );
});

TextareaAutosize.displayName = 'TextareaAutosize';

export default TextareaAutosize;
