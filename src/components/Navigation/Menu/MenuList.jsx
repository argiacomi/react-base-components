import * as React from 'react';
import { isFragment } from 'react-is';
import { List } from '@components/display';
import { getScrollbarSize, ownerDocument, useForkRef, useEnhancedEffect } from '@components/lib';

function nextItem(list, item, disableListWrap) {
  if (list === item) {
    return list.firstChild;
  }
  if (item && item.nextElementSibling) {
    return item.nextElementSibling;
  }
  return disableListWrap ? null : list.firstChild;
}

function previousItem(list, item, disableListWrap) {
  if (list === item) {
    return disableListWrap ? list.firstChild : list.lastChild;
  }
  if (item && item.previousElementSibling) {
    return item.previousElementSibling;
  }
  return disableListWrap ? null : list.lastChild;
}

function textCriteriaMatches(nextFocus, textCriteria) {
  if (textCriteria === undefined) {
    return true;
  }
  let text = nextFocus.innerText;
  if (text === undefined) {
    text = nextFocus.textContent;
  }
  text = text.trim().toLowerCase();
  if (text.length === 0) {
    return false;
  }
  if (textCriteria.repeating) {
    return text[0] === textCriteria.keys[0];
  }
  return text.indexOf(textCriteria.keys.join('')) === 0;
}

function moveFocus(
  list,
  currentFocus,
  disableListWrap,
  disabledItemsFocusable,
  traversalFunction,
  textCriteria
) {
  let wrappedOnce = false;
  let nextFocus = traversalFunction(list, currentFocus, currentFocus ? disableListWrap : false);

  while (nextFocus) {
    if (nextFocus === list.firstChild) {
      if (wrappedOnce) {
        return false;
      }
      wrappedOnce = true;
    }

    const nextFocusDisabled = disabledItemsFocusable
      ? false
      : nextFocus.disabled || nextFocus.getAttribute('aria-disabled') === 'true';

    if (
      !nextFocus.hasAttribute('tabindex') ||
      !textCriteriaMatches(nextFocus, textCriteria) ||
      nextFocusDisabled
    ) {
      // Move to the next element.
      nextFocus = traversalFunction(list, nextFocus, disableListWrap);
    } else {
      nextFocus.focus();
      return true;
    }
  }
  return false;
}

const MenuList = React.forwardRef((props, ref) => {
  const {
    actions,
    autoFocus = false,
    autoFocusItem = false,
    children,
    className,
    disabledItemsFocusable = false,
    disableListWrap = false,
    onKeyDown,
    variant = 'selectedMenu',
    ...other
  } = props;
  const listRef = React.useRef(null);
  const textCriteriaRef = React.useRef({
    keys: [],
    repeating: true,
    previousKeyMatched: true,
    lastTime: null
  });

  useEnhancedEffect(() => {
    if (autoFocus) {
      listRef.current.focus();
    }
  }, [autoFocus]);

  React.useImperativeHandle(
    actions,
    () => ({
      adjustStyleForScrollbar: (containerElement, theme) => {
        const noExplicitWidth = !listRef.current.style.width;
        if (containerElement.clientHeight < listRef.current.clientHeight && noExplicitWidth) {
          const scrollbarSize = `${getScrollbarSize(ownerDocument(containerElement))}px`;
          listRef.current.style[theme.direction === 'rtl' ? 'paddingLeft' : 'paddingRight'] =
            scrollbarSize;
          listRef.current.style.width = `calc(100% + ${scrollbarSize})`;
        }
        return listRef.current;
      }
    }),
    []
  );

  const handleKeyDown = (event) => {
    const list = listRef.current;
    const key = event.key;

    const currentFocus = ownerDocument(list).activeElement;

    if (key === 'ArrowDown') {
      event.preventDefault();
      moveFocus(list, currentFocus, disableListWrap, disabledItemsFocusable, nextItem);
    } else if (key === 'ArrowUp') {
      event.preventDefault();
      moveFocus(list, currentFocus, disableListWrap, disabledItemsFocusable, previousItem);
    } else if (key === 'Home') {
      event.preventDefault();
      moveFocus(list, null, disableListWrap, disabledItemsFocusable, nextItem);
    } else if (key === 'End') {
      event.preventDefault();
      moveFocus(list, null, disableListWrap, disabledItemsFocusable, previousItem);
    } else if (key.length === 1) {
      const criteria = textCriteriaRef.current;
      const lowerKey = key.toLowerCase();
      const currTime = performance.now();
      if (criteria.keys.length > 0) {
        // Reset
        if (currTime - criteria.lastTime > 500) {
          criteria.keys = [];
          criteria.repeating = true;
          criteria.previousKeyMatched = true;
        } else if (criteria.repeating && lowerKey !== criteria.keys[0]) {
          criteria.repeating = false;
        }
      }
      criteria.lastTime = currTime;
      criteria.keys.push(lowerKey);
      const keepFocusOnCurrent =
        currentFocus && !criteria.repeating && textCriteriaMatches(currentFocus, criteria);
      if (
        criteria.previousKeyMatched &&
        (keepFocusOnCurrent ||
          moveFocus(list, currentFocus, false, disabledItemsFocusable, nextItem, criteria))
      ) {
        event.preventDefault();
      } else {
        criteria.previousKeyMatched = false;
      }
    }

    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  const handleRef = useForkRef(listRef, ref);

  let activeItemIndex = -1;

  React.Children.forEach(children, (child, index) => {
    if (!React.isValidElement(child)) {
      if (activeItemIndex === index) {
        activeItemIndex += 1;
        if (activeItemIndex >= children.length) {
          activeItemIndex = -1;
        }
      }
      return;
    }

    if (!import.meta.env.PROD) {
      if (isFragment(child)) {
        console.error(
          `The Menu component doesn't accept a Fragment as a child. Consider providing an array instead.`
        );
      }
    }

    if (!child.props.disabled) {
      if (variant === 'selectedMenu' && child.props.selected) {
        activeItemIndex = index;
      } else if (activeItemIndex === -1) {
        activeItemIndex = index;
      }
    }

    if (
      activeItemIndex === index &&
      (child.props.disabled || child.props.muiSkipListHighlight || child.type.muiSkipListHighlight)
    ) {
      activeItemIndex += 1;
      if (activeItemIndex >= children.length) {
        activeItemIndex = -1;
      }
    }
  });

  const items = React.Children.map(children, (child, index) => {
    if (index === activeItemIndex) {
      const newChildProps = {};
      if (autoFocusItem) {
        newChildProps.autoFocus = true;
      }
      if (child.props.tabIndex === undefined && variant === 'selectedMenu') {
        newChildProps.tabIndex = 0;
      }

      return React.cloneElement(child, newChildProps);
    }

    return child;
  });

  return (
    <List
      role='menu'
      ref={handleRef}
      className={className}
      onKeyDown={handleKeyDown}
      tabIndex={autoFocus ? 0 : -1}
      {...other}
    >
      {items}
    </List>
  );
});

MenuList.displayName = 'MenuList';

export default MenuList;
