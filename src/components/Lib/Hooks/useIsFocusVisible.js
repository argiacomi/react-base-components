import { useCallback, useRef } from 'react';

// Initial variables
let hadKeyboardEvent = true;
let hadFocusVisibleRecently = false;
let hadFocusVisibleRecentlyTimeout;

const inputTypesWhitelist = {
  text: true,
  search: true,
  url: true,
  tel: true,
  email: true,
  password: true,
  number: true,
  date: true,
  month: true,
  week: true,
  time: true,
  datetime: true,
  'datetime-local': true
};

// Checks if a given HTML element should trigger keyboard modality. It returns true if the element is an input of a certain type (not read-only), a non-read-only textarea, or a contentEditable element.
const focusTriggersKeyboardModality = (node) => {
  const { type, tagName } = node;

  if (tagName === 'INPUT' && inputTypesWhitelist[type] && !node.readOnly) {
    return true;
  }

  if (tagName === 'TEXTAREA' && !node.readOnly) {
    return true;
  }

  if (node.isContentEditable) {
    return true;
  }

  return false;
};

// Event handler for keydown events. It sets `hadKeyboardEvent` to true unless the
// key event includes a meta, alt, or control key.
const handleKeyDown = (event) => {
  if (event.metaKey || event.altKey || event.ctrlKey) {
    return;
  }
  hadKeyboardEvent = true;
};

// Event handler for mousedown, pointerdown, and touchstart events. It sets `hadKeyboardEvent`
// to false, indicating that the most recent user interaction was not via the keyboard
const handlePointerDown = () => {
  hadKeyboardEvent = false;
};

// Event handler for visibilitychange events. If the document becomes hidden, it
// sets `hadKeyboardEvent` to true if `hadFocusVisibleRecently` is true.
const handleVisibilityChange = function () {
  if (this.visibilityState === 'hidden') {
    if (hadFocusVisibleRecently) {
      hadKeyboardEvent = true;
    }
  }
};

// Adds the above event listeners to the given document.
export function prepare(doc) {
  doc.addEventListener('keydown', handleKeyDown, true);
  doc.addEventListener('mousedown', handlePointerDown, true);
  doc.addEventListener('pointerdown', handlePointerDown, true);
  doc.addEventListener('touchstart', handlePointerDown, true);
  doc.addEventListener('visibilitychange', handleVisibilityChange, true);
}

// Removes the event listeners added by `prepare(doc)` from the given document.
export function teardown(doc) {
  doc.removeEventListener('keydown', handleKeyDown, true);
  doc.removeEventListener('mousedown', handlePointerDown, true);
  doc.removeEventListener('pointerdown', handlePointerDown, true);
  doc.removeEventListener('touchstart', handlePointerDown, true);
  doc.removeEventListener('visibilitychange', handleVisibilityChange, true);
}

// Checks if the focus is visible for a given focus event. It first tries to use
// the `:focus-visible` pseudo - class, and if that's not supported, it falls back
// to checking `hadKeyboardEvent` and`focusTriggersKeyboardModality(target)`
function isFocusVisible(event) {
  const { target } = event;
  try {
    return target.matches(':focus-visible');
  } catch (error) {
    // Browsers not implementing :focus-visible will throw a SyntaxError.
  }

  return hadKeyboardEvent || focusTriggersKeyboardModality(target);
}

// Hook to use the above functions and React hooks to return an object with properties \
// that can be used to determine if the focus is visible and handle focus and blur events.
export function useIsFocusVisible() {
  const ref = useCallback((node) => {
    if (node != null) {
      prepare(node.ownerDocument);
    }
  }, []);

  const isFocusVisibleRef = useRef(false);

  const handleBlurVisible = () => {
    if (isFocusVisibleRef.current) {
      hadFocusVisibleRecently = true;
      window.clearTimeout(hadFocusVisibleRecentlyTimeout);
      hadFocusVisibleRecentlyTimeout = window.setTimeout(() => {
        hadFocusVisibleRecently = false;
      }, 100);

      isFocusVisibleRef.current = false;

      return true;
    }

    return false;
  };

  // Function to handle blur visible
  const handleFocusVisible = (event) => {
    if (isFocusVisible(event)) {
      isFocusVisibleRef.current = true;
      return true;
    }
    return false;
  };

  return {
    isFocusVisibleRef,
    onFocus: handleFocusVisible,
    onBlur: handleBlurVisible,
    ref
  };
}
