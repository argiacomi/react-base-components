import * as React from 'react';
import { useEventCallback, extractEventHandlers } from '@components/lib';

export default function useSnackbar(parameters) {
  const {
    autoHideDuration = null,
    disableWindowBlurListener = false,
    onClose,
    open,
    resumeHideDuration
  } = parameters;

  const timerAutoHide = React.useRef();

  React.useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handleKeyDown(nativeEvent) {
      if (!nativeEvent.defaultPrevented) {
        if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
          onClose?.(nativeEvent, 'escapeKeyDown');
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  const handleClose = useEventCallback((event, reason) => {
    onClose?.(event, reason);
  });

  const setAutoHideTimer = useEventCallback((autoHideDurationParam) => {
    if (!onClose || autoHideDurationParam == null) {
      return;
    }

    clearTimeout(timerAutoHide.current);
    timerAutoHide.current = setTimeout(() => {
      handleClose(null, 'timeout');
    }, autoHideDurationParam);
  });

  React.useEffect(() => {
    if (open) {
      setAutoHideTimer(autoHideDuration);
    }

    return () => {
      clearTimeout(timerAutoHide.current);
    };
  }, [open, autoHideDuration, setAutoHideTimer]);

  const handleClickAway = (event) => {
    onClose?.(event, 'clickaway');
  };

  const handlePause = () => {
    clearTimeout(timerAutoHide.current);
  };

  const handleResume = React.useCallback(() => {
    if (autoHideDuration != null) {
      setAutoHideTimer(resumeHideDuration != null ? resumeHideDuration : autoHideDuration * 0.5);
    }
  }, [autoHideDuration, resumeHideDuration, setAutoHideTimer]);

  const createHandleBlur = (otherHandlers) => (event) => {
    const onBlurCallback = otherHandlers.onBlur;
    onBlurCallback?.(event);
    handleResume();
  };

  const createHandleFocus = (otherHandlers) => (event) => {
    const onFocusCallback = otherHandlers.onFocus;
    onFocusCallback?.(event);
    handlePause();
  };

  const createMouseEnter = (otherHandlers) => (event) => {
    const onMouseEnterCallback = otherHandlers.onMouseEnter;
    onMouseEnterCallback?.(event);
    handlePause();
  };

  const createMouseLeave = (otherHandlers) => (event) => {
    const onMouseLeaveCallback = otherHandlers.onMouseLeave;
    onMouseLeaveCallback?.(event);
    handleResume();
  };

  React.useEffect(() => {
    if (!disableWindowBlurListener && open) {
      const handleFocus = () => {
        if (autoHideDuration != null) {
          setAutoHideTimer(
            resumeHideDuration != null ? resumeHideDuration : autoHideDuration * 0.5
          );
        }
      };

      const handleBlur = () => {
        clearTimeout(timerAutoHide.current);
      };

      window.addEventListener('focus', handleFocus);
      window.addEventListener('blur', handleBlur);

      return () => {
        window.removeEventListener('focus', handleFocus);
        window.removeEventListener('blur', handleBlur);
      };
    }
  }, [
    disableWindowBlurListener,
    open,
    autoHideDuration,
    resumeHideDuration,
    setAutoHideTimer,
    timerAutoHide
  ]);

  const getRootProps = (otherHandlers) => {
    const propsEventHandlers = extractEventHandlers(parameters);
    const externalEventHandlers = {
      ...propsEventHandlers,
      ...otherHandlers
    };

    return {
      role: 'presentation',
      ...externalEventHandlers,
      onBlur: createHandleBlur(externalEventHandlers),
      onFocus: createHandleFocus(externalEventHandlers),
      onMouseEnter: createMouseEnter(externalEventHandlers),
      onMouseLeave: createMouseLeave(externalEventHandlers)
    };
  };

  return { getRootProps, onClickAway: handleClickAway };
}
