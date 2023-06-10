import React from 'react';
import { ownerDocument, useForkRef, useEventCallback } from '@components/lib';

export const IGNORE_CLASS_NAME = 'ignore-click-away-listener';

let passiveSupported = false;
try {
  const options = {
    get passive() {
      passiveSupported = true;
      return false;
    }
  };
  window.addEventListener('test', options, options);
  window.removeEventListener('test', options, options);
} catch (err) {
  passiveSupported = false;
}

function mapEventPropToEvent(eventProp) {
  return eventProp.substring(2).toLowerCase();
}

function clickedRootScrollbar(event, doc) {
  return (
    doc.documentElement.clientWidth < event.clientX ||
    doc.documentElement.clientHeight < event.clientY
  );
}

export function ClickAwayListener(props) {
  const {
    children,
    disableOnClickOutside = false,
    disableReactTree = false,
    eventTypes = ['onClick', 'onTouchEnd'],
    includeScrollbar = true,
    onClickAway,
    preventDefault = false,
    stopPropagation = false,
    setClickOutsideRef
  } = props;
  const movedRef = React.useRef(false);
  const nodeRef = React.useRef(null);
  const activatedRef = React.useRef(false);
  const syntheticEventRef = React.useRef(false);

  React.useEffect(() => {
    setTimeout(() => {
      activatedRef.current = true;
    }, 0);
    return () => {
      activatedRef.current = false;
    };
  }, []);

  const handleRef = useForkRef(children.ref, nodeRef);

  const handleClickAway = useEventCallback((event) => {
    if (preventDefault) {
      event.preventDefault();
    }

    if (stopPropagation) {
      event.stopPropagation();
    }

    const insideReactTree = syntheticEventRef.current;
    syntheticEventRef.current = false;

    const doc = ownerDocument(nodeRef.current);

    if (
      !activatedRef.current ||
      !nodeRef.current ||
      (!includeScrollbar && 'clientX' in event && clickedRootScrollbar(event, doc))
    ) {
      return;
    }

    if (movedRef.current) {
      movedRef.current = false;
      return;
    }

    let target = event.target;
    while (target) {
      if (target.classList && target.classList.contains(IGNORE_CLASS_NAME)) {
        return;
      }
      target = target.parentNode;
    }

    const insideElements = setClickOutsideRef ? setClickOutsideRef() : false;

    let insideDOM;

    if (insideElements) {
      insideDOM = insideElements.some((element) =>
        event.composedPath ? event.composedPath().includes(element) : element.contains(event.target)
      );
    } else {
      insideDOM = event.composedPath
        ? event.composedPath().indexOf(nodeRef.current) > -1
        : !doc.documentElement.contains(event.target) || nodeRef.current.contains(event.target);
    }

    if (!insideDOM && (disableReactTree || !insideReactTree)) {
      onClickAway(event);
    }
  });

  const createHandleSynthetic = (handlerName) => (event) => {
    syntheticEventRef.current = true;

    const childrenPropsHandler = children.props[handlerName];
    if (childrenPropsHandler) {
      childrenPropsHandler(event);
    }
  };

  const childrenProps = { ref: handleRef };

  eventTypes.forEach((eventType) => {
    childrenProps[eventType] = createHandleSynthetic(eventType);
  });

  React.useEffect(() => {
    if (!disableOnClickOutside) {
      const doc = ownerDocument(nodeRef.current);

      const handleTouchMove = () => {
        movedRef.current = true;
      };

      const options = passiveSupported ? { passive: true } : false;
      eventTypes.forEach((eventType) => {
        const mappedEventType = mapEventPropToEvent(eventType);
        doc.addEventListener(mappedEventType, handleClickAway, options);
      });
      doc.addEventListener('touchmove', handleTouchMove, options);

      return () => {
        eventTypes.forEach((eventType) => {
          const mappedEventType = mapEventPropToEvent(eventType);
          doc.removeEventListener(mappedEventType, handleClickAway, options);
        });
        doc.removeEventListener('touchmove', handleTouchMove, options);
      };
    }
  }, [handleClickAway, eventTypes, disableOnClickOutside]);

  return <React.Fragment>{React.cloneElement(children, childrenProps)}</React.Fragment>;
}

ClickAwayListener.displayName = 'ClickAwayListener';
