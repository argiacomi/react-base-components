// Importing necessary modules from React and components library
import React from 'react';
import { useForkRef, ownerDocument } from '@components/lib';

// Defining a list of selectors for focusable elements
const candidatesSelector = [
  'input',
  'select',
  'textarea',
  'a[href]',
  'button',
  '[tabindex]',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])'
].join(',');

// Function to return the tabIndex of the node
function getTabIndex(node) {
  const tabindexAttr = parseInt(node.getAttribute('tabindex') || '', 10);

  // Check if tabIndex is a number and return tabIndex
  if (!Number.isNaN(tabindexAttr)) {
    return tabindexAttr;
  }

  // Check if node is contentEditable or is AUDIO, VIDEO or DETAILS and tabIndex is null, return 0
  if (
    node.contentEditable === 'true' ||
    ((node.nodeName === 'AUDIO' || node.nodeName === 'VIDEO' || node.nodeName === 'DETAILS') &&
      node.getAttribute('tabindex') === null)
  ) {
    return 0;
  }

  // Otherwise return node's tabIndex
  return node.tabIndex;
}

// Function to check if radio is non-tabbable
function isNonTabbableRadio(node) {
  // Check if the node is not an INPUT or not of type radio
  if (node.tagName !== 'INPUT' || node.type !== 'radio') {
    return false;
  }

  // Check if radio doesn't have a name attribute
  if (!node.name) {
    return false;
  }

  // Function to get a radio button
  const getRadio = (selector) => node.ownerDocument.querySelector(`input[type="radio"]${selector}`);

  // Check if there's a checked radio button with the same name
  let roving = getRadio(`[name="${node.name}"]:checked`);

  // If no checked radio found, get the first radio button with the same name
  if (!roving) {
    roving = getRadio(`[name="${node.name}"]`);
  }

  // Return whether the current radio button is not the active (roving) radio button
  return roving !== node;
}

// Function to check if a node is focusable
function isNodeMatchingSelectorFocusable(node) {
  // If node is disabled, hidden input or non-tabbable radio, return false
  if (
    node.disabled ||
    (node.tagName === 'INPUT' && node.type === 'hidden') ||
    isNonTabbableRadio(node)
  ) {
    return false;
  }
  // Otherwise, the node is focusable
  return true;
}

// Function to get all tabbable nodes in the root node
function defaultGetTabbable(root) {
  // Lists to hold regular and ordered tab nodes
  const regularTabNodes = [];
  const orderedTabNodes = [];

  // Iterate over all nodes that match the candidatesSelector
  Array.from(root.querySelectorAll(candidatesSelector)).forEach((node, i) => {
    const nodeTabIndex = getTabIndex(node);

    // If node has tabIndex of -1 or is not focusable, skip it
    if (nodeTabIndex === -1 || !isNodeMatchingSelectorFocusable(node)) {
      return;
    }

    // If node has tabIndex of 0, add to regularTabNodes, else add to orderedTabNodes
    if (nodeTabIndex === 0) {
      regularTabNodes.push(node);
    } else {
      orderedTabNodes.push({
        documentOrder: i,
        tabIndex: nodeTabIndex,
        node: node
      });
    }
  });

  // Sort the orderedTabNodes by tabIndex and document order and return concatenated with regularTabNodes
  return orderedTabNodes
    .sort((a, b) =>
      a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex
    )
    .map((a) => a.node)
    .concat(regularTabNodes);
}

// Default function for checking if the focus trap is enabled
function defaultIsEnabled() {
  return true;
}

// Main FocusTrap component
function FocusTrap(props) {
  const {
    children,
    disableAutoFocus = false,
    disableEnforceFocus = false,
    disableRestoreFocus = false,
    getTabbable = defaultGetTabbable,
    isEnabled = defaultIsEnabled,
    open
  } = props;

  // Define refs to control the focus
  const ignoreNextEnforceFocus = React.useRef(false);
  const sentinelStart = React.useRef(null);
  const sentinelEnd = React.useRef(null);
  const nodeToRestore = React.useRef(null);
  const reactFocusEventTarget = React.useRef(null);
  const activated = React.useRef(false);
  const rootRef = React.useRef(null);
  const handleRef = useForkRef(children.ref, rootRef);
  const lastKeydown = React.useRef(null);

  // Effect to handle auto focus when the trap is open
  React.useEffect(() => {
    if (!open || !rootRef.current) {
      return;
    }

    activated.current = !disableAutoFocus;
  }, [disableAutoFocus, open, rootRef]);

  // Effect to handle focus when the trap is open and to restore focus when the trap is closed
  React.useEffect(() => {
    if (!open || !rootRef.current) {
      return;
    }

    const doc = ownerDocument(rootRef.current);

    // If the root node does not contain the active element, set tabIndex and focus it
    if (!rootRef.current.contains(doc.activeElement)) {
      if (!rootRef.current.hasAttribute('tabIndex')) {
        if (!import.meta.env.PROD) {
          console.error(
            [
              'The modal content node does not accept focus.',
              'For the benefit of assistive technologies,',
              'the tabIndex of the node is being set to "-1".'
            ].join('\n')
          );
        }
        rootRef.current.setAttribute('tabIndex', '-1');
      }

      // If activated, focus the root node
      if (activated.current) {
        rootRef.current.focus();
      }
    }

    // When the effect is cleaned up, if restore focus is not disabled, restore focus to the node to restore
    return () => {
      if (!disableRestoreFocus) {
        if (nodeToRestore.current && nodeToRestore.current.focus) {
          ignoreNextEnforceFocus.current = true;
          nodeToRestore.current.focus();
        }

        nodeToRestore.current = null;
      }
    };
  }, [open, disableRestoreFocus, rootRef]);

  // Effect to contain the focus within the focus trap
  React.useEffect(() => {
    if (!open || !rootRef.current) {
      return;
    }

    const doc = ownerDocument(rootRef.current);

    const contain = (nativeEvent) => {
      const { current: rootElement } = rootRef;

      if (rootElement === null) {
        return;
      }

      // If the document does not have focus, the focus trap is disabled, isEnabled returns false,
      // or the next focus enforcement should be ignored, reset ignoreNextEnforceFocus and return
      if (
        !doc.hasFocus() ||
        disableEnforceFocus ||
        !isEnabled() ||
        ignoreNextEnforceFocus.current
      ) {
        ignoreNextEnforceFocus.current = false;
        return;
      }

      // If the root element does not contain the active element...
      if (!rootElement.contains(doc.activeElement)) {
        if (
          (nativeEvent && reactFocusEventTarget.current !== nativeEvent.target) ||
          doc.activeElement !== reactFocusEventTarget.current
        ) {
          reactFocusEventTarget.current = null;
        } else if (reactFocusEventTarget.current !== null) {
          return;
        }

        if (!activated.current) {
          return;
        }

        let tabbable = [];
        // If the active element is one of the sentinels, get the tabbable elements
        if (
          doc.activeElement === sentinelStart.current ||
          doc.activeElement === sentinelEnd.current
        ) {
          tabbable = getTabbable(rootRef.current);
        }

        // If there are tabbable elements, focus the first or last one depending on whether Shift+Tab was pressed
        // Otherwise, focus the root element
        if (tabbable.length > 0) {
          const isShiftTab = Boolean(
            lastKeydown.current?.shiftKey && lastKeydown.current?.key === 'Tab'
          );

          const focusNext = tabbable[0];
          const focusPrevious = tabbable[tabbable.length - 1];

          if (typeof focusNext !== 'string' && typeof focusPrevious !== 'string') {
            if (isShiftTab) {
              focusPrevious.focus();
            } else {
              focusNext.focus();
            }
          }
        } else {
          rootElement.focus();
        }
      }
    };

    // Further code to loop the focus...
    const loopFocus = (nativeEvent) => {
      lastKeydown.current = nativeEvent;

      // If focus enforcement is disabled, isEnabled returns false, or the key pressed is not Tab, return
      if (disableEnforceFocus || !isEnabled() || nativeEvent.key !== 'Tab') {
        return;
      }

      // If the active element is the root node and Shift+Tab was pressed, ignore the next focus enforcement and focus the end sentinel
      if (doc.activeElement === rootRef.current && nativeEvent.shiftKey) {
        ignoreNextEnforceFocus.current = true;
        if (sentinelEnd.current) {
          sentinelEnd.current.focus();
        }
      }
    };

    // Add event listeners for focusin and keydown
    doc.addEventListener('focusin', contain);
    doc.addEventListener('keydown', loopFocus, true);

    // Set up an interval to call the contain function if the active element is the body
    const interval = setInterval(() => {
      if (doc.activeElement && doc.activeElement.tagName === 'BODY') {
        contain(null);
      }
    }, 50);

    // When the effect is cleaned up, clear the interval and remove the event listeners
    return () => {
      clearInterval(interval);

      doc.removeEventListener('focusin', contain);
      doc.removeEventListener('keydown', loopFocus, true);
    };
  }, [
    disableAutoFocus,
    disableEnforceFocus,
    disableRestoreFocus,
    isEnabled,
    open,
    getTabbable,
    rootRef
  ]);

  // Defining the onFocus handler for the focusable child component
  // This handler does several things:
  // 1) Set the nodeToRestore ref to the event.relatedTarget,
  // which means the last active element before the child component is focused.
  // 2) Set activated to true, which indicates the child component has been activated.
  // 3) Set reactFocusEventTarget to the current event.target
  // 4) If the child component has its own onFocus prop, call it with the event.
  const onFocus = (event) => {
    if (nodeToRestore.current === null) {
      nodeToRestore.current = event.relatedTarget;
    }
    activated.current = true;
    reactFocusEventTarget.current = event.target;

    const childrenPropsHandler = children.props.onFocus;
    if (childrenPropsHandler) {
      childrenPropsHandler(event);
    }
  };

  // This is similar to the above onFocus handler, but for the focus sentinel elements
  const handleFocusSentinel = (event) => {
    if (nodeToRestore.current === null) {
      nodeToRestore.current = event.relatedTarget;
    }
    activated.current = true;
  };

  // Rendering the actual component
  // Includes sentinel divs at the beginning and end to manage the focus
  // and trap it within the child component when open. When the focus trap is not open,
  // the sentinel divs cannot be tabbed to (tabIndex is -1).
  return (
    <React.Fragment>
      <div
        tabIndex={open ? 0 : -1}
        onFocus={handleFocusSentinel}
        ref={sentinelStart}
        data-testid='sentinelStart'
      />
      {React.cloneElement(children, { ref: handleRef, onFocus })}
      <div
        tabIndex={open ? 0 : -1}
        onFocus={handleFocusSentinel}
        ref={sentinelEnd}
        data-testid='sentinelEnd'
      />
    </React.Fragment>
  );
}

FocusTrap.displayName = 'FocusTrap';

export default FocusTrap;
