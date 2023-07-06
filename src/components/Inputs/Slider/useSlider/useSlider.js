import React from 'react';
import {
  areArraysEqual,
  ownerDocument,
  useControlled,
  useEnhancedEffect,
  useEventCallback,
  useForkRef,
  useIsFocusVisible,
  visuallyHidden
} from '@components/lib';

const INTENTIONAL_DRAG_COUNT_THRESHOLD = 2;

function asc(a, b) {
  return a - b;
}

function clamp(value, min, max) {
  if (value == null) {
    return min;
  }
  return Math.min(Math.max(min, value), max);
}

function findClosest(values, currentValue) {
  const { index: closestIndex } =
    values.reduce((acc, value, index) => {
      const distance = Math.abs(currentValue - value);

      if (acc === null || distance < acc.distance || distance === acc.distance) {
        return {
          distance,
          index
        };
      }

      return acc;
    }, null) ?? {};
  return closestIndex;
}

function trackFinger(event, touchId) {
  if (touchId.current !== undefined && event.changedTouches) {
    const touchEvent = event;
    for (let i = 0; i < touchEvent.changedTouches.length; i += 1) {
      const touch = touchEvent.changedTouches[i];
      if (touch.identifier === touchId.current) {
        return {
          x: touch.clientX,
          y: touch.clientY
        };
      }
    }

    return false;
  }

  return {
    x: event.clientX,
    y: event.clientY
  };
}

export function valueToPercent(value, min, max) {
  return ((value - min) * 100) / (max - min);
}

function percentToValue(percent, min, max) {
  return (max - min) * percent + min;
}

function getDecimalPrecision(num) {
  if (Math.abs(num) < 1) {
    const parts = num.toExponential().split('e-');
    const matissaDecimalPart = parts[0].split('.')[1];
    return (matissaDecimalPart ? matissaDecimalPart.length : 0) + parseInt(parts[1], 10);
  }

  const decimalPart = num.toString().split('.')[1];
  return decimalPart ? decimalPart.length : 0;
}

function roundValueToStep(value, step, min) {
  const nearest = Math.round((value - min) / step) * step + min;
  return Number(nearest.toFixed(getDecimalPrecision(step)));
}

function setValueIndex({ values, newValue, index }) {
  const output = values.slice();
  output[index] = newValue;
  return output.sort(asc);
}

function focusThumb({ sliderRef, activeIndex, setActive }) {
  const doc = ownerDocument(sliderRef.current);
  if (
    !sliderRef.current?.contains(doc.activeElement) ||
    Number(doc?.activeElement?.getAttribute('data-index')) !== activeIndex
  ) {
    sliderRef.current?.querySelector(`[type="range"][data-index="${activeIndex}"]`).focus();
  }

  if (setActive) {
    setActive(activeIndex);
  }
}

function areValuesEqual(newValue, oldValue) {
  if (typeof newValue === 'number' && typeof oldValue === 'number') {
    return newValue === oldValue;
  }
  if (typeof newValue === 'object' && typeof oldValue === 'object') {
    return areArraysEqual(newValue, oldValue);
  }
  return false;
}

const axisProps = {
  horizontal: {
    offset: (percent) => ({ left: `${percent}%` }),
    leap: (percent) => ({ width: `${percent}%` })
  },
  'horizontal-reverse': {
    offset: (percent) => ({ right: `${percent}%` }),
    leap: (percent) => ({ width: `${percent}%` })
  },
  vertical: {
    offset: (percent) => ({ bottom: `${percent}%` }),
    leap: (percent) => ({ height: `${percent}%` })
  }
};

export const Identity = (x) => x;

let cachedSupportsTouchActionNone;
function doesSupportTouchActionNone() {
  if (cachedSupportsTouchActionNone === undefined) {
    if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function') {
      cachedSupportsTouchActionNone = CSS.supports('touch-action', 'none');
    } else {
      cachedSupportsTouchActionNone = true;
    }
  }
  return cachedSupportsTouchActionNone;
}

export default function useSlider(parameters) {
  const {
    'aria-labelledby': ariaLabelledby,
    defaultValue,
    disabled = false,
    disableSwap = false,
    isRtl = false,
    marks: marksProp = false,
    max = 100,
    min = 0,
    name,
    onChange,
    onChangeCommitted,
    orientation = 'horizontal',
    rootRef: ref,
    scale = Identity,
    step = 1,
    tabIndex,
    value: valueProp
  } = parameters;

  const touchId = React.useRef();

  const [active, setActive] = React.useState(-1);
  const [open, setOpen] = React.useState(-1);
  const [dragging, setDragging] = React.useState(false);
  const moveCount = React.useRef(0);

  const [valueDerived, setValueState] = useControlled({
    controlled: valueProp,
    default: defaultValue ?? min,
    name: 'Slider'
  });

  const handleChange =
    onChange &&
    ((event, value, thumbIndex) => {
      const nativeEvent = event.nativeEvent || event;
      const clonedEvent = new nativeEvent.constructor(nativeEvent.type, nativeEvent);

      Object.defineProperty(clonedEvent, 'target', {
        writable: true,
        value: { value, name }
      });

      onChange(clonedEvent, value, thumbIndex);
    });

  const range = Array.isArray(valueDerived);
  let values = range ? valueDerived.slice().sort(asc) : [valueDerived];
  values = values.map((value) => clamp(value, min, max));
  const marks =
    marksProp === true && step !== null
      ? [...Array(Math.floor((max - min) / step) + 1)].map((_, index) => ({
          value: min + step * index
        }))
      : marksProp || [];

  const marksValues = marks.map((mark) => mark.value);

  const {
    isFocusVisibleRef,
    onBlur: handleBlurVisible,
    onFocus: handleFocusVisible,
    ref: focusVisibleRef
  } = useIsFocusVisible();
  const [focusedThumbIndex, setFocusedThumbIndex] = React.useState(-1);

  const sliderRef = React.useRef();
  const handleFocusRef = useForkRef(focusVisibleRef, sliderRef);
  const handleRef = useForkRef(ref, handleFocusRef);

  const createHandleHiddenInputFocus = (otherHandlers) => (event) => {
    const index = Number(event.currentTarget.getAttribute('data-index'));
    handleFocusVisible(event);
    if (isFocusVisibleRef.current === true) {
      setFocusedThumbIndex(index);
    }
    setOpen(index);
    otherHandlers?.onFocus?.(event);
  };
  const createHandleHiddenInputBlur = (otherHandlers) => (event) => {
    handleBlurVisible(event);
    if (isFocusVisibleRef.current === false) {
      setFocusedThumbIndex(-1);
    }
    setOpen(-1);
    otherHandlers?.onBlur?.(event);
  };

  useEnhancedEffect(() => {
    if (disabled && sliderRef.current?.contains(document.activeElement)) {
      document.activeElement?.blur();
    }
  }, [disabled]);

  if (disabled && active !== -1) {
    setActive(-1);
  }
  if (disabled && focusedThumbIndex !== -1) {
    setFocusedThumbIndex(-1);
  }

  const createHandleHiddenInputChange = (otherHandlers) => (event) => {
    otherHandlers.onChange?.(event);

    const index = Number(event.currentTarget.getAttribute('data-index'));
    const value = values[index];
    const marksIndex = marksValues.indexOf(value);

    let newValue = event.target.valueAsNumber;

    if (marks && step == null) {
      const maxMarksValue = marksValues[marksValues.length - 1];
      if (newValue > maxMarksValue) {
        newValue = maxMarksValue;
      } else if (newValue < marksValues[0]) {
        newValue = marksValues[0];
      } else {
        newValue = newValue < value ? marksValues[marksIndex - 1] : marksValues[marksIndex + 1];
      }
    }

    newValue = clamp(newValue, min, max);

    if (range) {
      if (disableSwap) {
        newValue = clamp(newValue, values[index - 1] || -Infinity, values[index + 1] || Infinity);
      }

      const previousValue = newValue;
      newValue = setValueIndex({
        values,
        newValue,
        index
      });

      let activeIndex = index;

      if (!disableSwap) {
        activeIndex = newValue.indexOf(previousValue);
      }

      focusThumb({ sliderRef, activeIndex });
    }

    setValueState(newValue);
    setFocusedThumbIndex(index);

    if (handleChange && !areValuesEqual(newValue, valueDerived)) {
      handleChange(event, newValue, index);
    }

    if (onChangeCommitted) {
      onChangeCommitted(event, newValue);
    }
  };

  const previousIndex = React.useRef();
  let axis = orientation;
  if (isRtl && orientation === 'horizontal') {
    axis += '-reverse';
  }

  const getFingerNewValue = ({ finger, move = false }) => {
    const { current: slider } = sliderRef;
    const { width, height, bottom, left } = slider.getBoundingClientRect();
    let percent;

    if (axis.indexOf('vertical') === 0) {
      percent = (bottom - finger.y) / height;
    } else {
      percent = (finger.x - left) / width;
    }

    if (axis.indexOf('-reverse') !== -1) {
      percent = 1 - percent;
    }

    let newValue;
    newValue = percentToValue(percent, min, max);
    if (step) {
      newValue = roundValueToStep(newValue, step, min);
    } else {
      const closestIndex = findClosest(marksValues, newValue);
      newValue = marksValues[closestIndex];
    }

    newValue = clamp(newValue, min, max);
    let activeIndex = 0;

    if (range) {
      if (!move) {
        activeIndex = findClosest(values, newValue);
      } else {
        activeIndex = previousIndex.current;
      }

      if (disableSwap) {
        newValue = clamp(
          newValue,
          values[activeIndex - 1] || -Infinity,
          values[activeIndex + 1] || Infinity
        );
      }

      const previousValue = newValue;
      newValue = setValueIndex({
        values,
        newValue,
        index: activeIndex
      });

      if (!(disableSwap && move)) {
        activeIndex = newValue.indexOf(previousValue);
        previousIndex.current = activeIndex;
      }
    }

    return { newValue, activeIndex };
  };

  const handleTouchMove = useEventCallback((nativeEvent) => {
    const finger = trackFinger(nativeEvent, touchId);

    if (!finger) {
      return;
    }

    moveCount.current += 1;

    if (nativeEvent.type === 'mousemove' && nativeEvent.buttons === 0) {
      handleTouchEnd(nativeEvent);
      return;
    }

    const { newValue, activeIndex } = getFingerNewValue({
      finger,
      move: true
    });

    focusThumb({ sliderRef, activeIndex, setActive });
    setValueState(newValue);

    if (!dragging && moveCount.current > INTENTIONAL_DRAG_COUNT_THRESHOLD) {
      setDragging(true);
    }

    if (handleChange && !areValuesEqual(newValue, valueDerived)) {
      handleChange(nativeEvent, newValue, activeIndex);
    }
  });

  const handleTouchEnd = useEventCallback((nativeEvent) => {
    const finger = trackFinger(nativeEvent, touchId);
    setDragging(false);

    if (!finger) {
      return;
    }

    const { newValue } = getFingerNewValue({ finger, move: true });

    setActive(-1);
    if (nativeEvent.type === 'touchend') {
      setOpen(-1);
    }

    if (onChangeCommitted) {
      onChangeCommitted(nativeEvent, newValue);
    }

    touchId.current = undefined;

    stopListening();
  });

  const handleTouchStart = useEventCallback((nativeEvent) => {
    if (disabled) {
      return;
    }
    if (!doesSupportTouchActionNone()) {
      nativeEvent.preventDefault();
    }

    const touch = nativeEvent.changedTouches[0];
    if (touch != null) {
      touchId.current = touch.identifier;
    }
    const finger = trackFinger(nativeEvent, touchId);
    if (finger !== false) {
      const { newValue, activeIndex } = getFingerNewValue({ finger });
      focusThumb({ sliderRef, activeIndex, setActive });

      setValueState(newValue);

      if (handleChange && !areValuesEqual(newValue, valueDerived)) {
        handleChange(nativeEvent, newValue, activeIndex);
      }
    }

    moveCount.current = 0;
    const doc = ownerDocument(sliderRef.current);
    doc.addEventListener('touchmove', handleTouchMove);
    doc.addEventListener('touchend', handleTouchEnd);
  });

  const stopListening = React.useCallback(() => {
    const doc = ownerDocument(sliderRef.current);
    doc.removeEventListener('mousemove', handleTouchMove);
    doc.removeEventListener('mouseup', handleTouchEnd);
    doc.removeEventListener('touchmove', handleTouchMove);
    doc.removeEventListener('touchend', handleTouchEnd);
  }, [handleTouchEnd, handleTouchMove]);

  React.useEffect(() => {
    const { current: slider } = sliderRef;
    slider.addEventListener('touchstart', handleTouchStart, {
      passive: doesSupportTouchActionNone()
    });

    return () => {
      slider.removeEventListener('touchstart', handleTouchStart, {
        passive: doesSupportTouchActionNone()
      });

      stopListening();
    };
  }, [stopListening, handleTouchStart]);

  React.useEffect(() => {
    if (disabled) {
      stopListening();
    }
  }, [disabled, stopListening]);

  const createHandleMouseDown = (otherHandlers) => (event) => {
    otherHandlers.onMouseDown?.(event);
    if (disabled) {
      return;
    }

    if (event.defaultPrevented) {
      return;
    }

    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    const finger = trackFinger(event, touchId);
    if (finger !== false) {
      const { newValue, activeIndex } = getFingerNewValue({ finger });
      focusThumb({ sliderRef, activeIndex, setActive });

      setValueState(newValue);

      if (handleChange && !areValuesEqual(newValue, valueDerived)) {
        handleChange(event, newValue, activeIndex);
      }
    }

    moveCount.current = 0;
    const doc = ownerDocument(sliderRef.current);
    doc.addEventListener('mousemove', handleTouchMove);
    doc.addEventListener('mouseup', handleTouchEnd);
  };

  const trackOffset = valueToPercent(range ? values[0] : min, min, max);
  const trackLeap = valueToPercent(values[values.length - 1], min, max) - trackOffset;

  const getRootProps = (otherHandlers) => {
    const ownEventHandlers = {
      onMouseDown: createHandleMouseDown(otherHandlers || {})
    };

    const mergedEventHandlers = {
      ...otherHandlers,
      ...ownEventHandlers
    };
    return {
      ref: handleRef,
      ...mergedEventHandlers
    };
  };

  const createHandleMouseOver = (otherHandlers) => (event) => {
    otherHandlers.onMouseOver?.(event);

    const index = Number(event.currentTarget.getAttribute('data-index'));
    setOpen(index);
  };

  const createHandleMouseLeave = (otherHandlers) => (event) => {
    otherHandlers.onMouseLeave?.(event);

    setOpen(-1);
  };

  const getThumbProps = (otherHandlers) => {
    const ownEventHandlers = {
      onMouseOver: createHandleMouseOver(otherHandlers || {}),
      onMouseLeave: createHandleMouseLeave(otherHandlers || {})
    };

    return {
      ...otherHandlers,
      ...ownEventHandlers
    };
  };

  const getThumbStyle = (index) => {
    return {
      pointerEvents: active !== -1 && active !== index ? 'none' : undefined
    };
  };

  const getHiddenInputProps = (otherHandlers) => {
    const ownEventHandlers = {
      onChange: createHandleHiddenInputChange(otherHandlers || {}),
      onFocus: createHandleHiddenInputFocus(otherHandlers || {}),
      onBlur: createHandleHiddenInputBlur(otherHandlers || {})
    };

    const mergedEventHandlers = {
      ...otherHandlers,
      ...ownEventHandlers
    };

    return {
      tabIndex,
      'aria-labelledby': ariaLabelledby,
      'aria-orientation': orientation,
      'aria-valuemax': scale(max),
      'aria-valuemin': scale(min),
      name,
      type: 'range',
      min: parameters.min,
      max: parameters.max,
      step: parameters.step === null && parameters.marks ? 'any' : parameters.step ?? undefined,
      disabled,
      ...mergedEventHandlers,
      style: {
        ...visuallyHidden,
        direction: isRtl ? 'rtl' : 'ltr',
        width: '100%',
        height: '100%'
      }
    };
  };

  return {
    active,
    axis,
    axisProps,
    dragging,
    focusedThumbIndex,
    getHiddenInputProps,
    getRootProps,
    getThumbProps,
    marks,
    open,
    range,
    rootRef: handleRef,
    trackLeap,
    trackOffset,
    values,
    getThumbStyle
  };
}
