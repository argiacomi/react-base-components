import { tabbable } from 'tabbable';

function activeElement(doc) {
  let activeElement = doc.activeElement;

  while (activeElement?.shadowRoot?.activeElement != null) {
    activeElement = activeElement.shadowRoot.activeElement;
  }

  return activeElement;
}

function isShadowRoot(node) {
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  const nodeDocument = node?.ownerDocument || document;
  const nodeWindow = nodeDocument.defaultView || window;

  const OwnElement = nodeWindow.ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}

function contains(parent, child) {
  if (!parent || !child) {
    return false;
  }

  const rootNode = child.getRootNode && child.getRootNode();

  if (parent.contains(child)) {
    return true;
  }

  if (rootNode && isShadowRoot(rootNode)) {
    let next = child;
    while (next) {
      if (parent === next) {
        return true;
      }
      next = next.parentNode || next.host;
    }
  }

  return false;
}

export const getTabbableOptions = () => ({
  getShadowRoot: true,
  displayCheck:
    typeof ResizeObserver === 'function' &&
    ResizeObserver.toString().includes('[native code]')
      ? 'full'
      : 'none'
});

export function getTabbableIn(container, direction) {
  const allTabbable = tabbable(container, getTabbableOptions());

  if (direction === 'prev') {
    allTabbable.reverse();
  }

  const activeIndex = allTabbable.indexOf(
    activeElement(container?.ownerDocument || document)
  );
  const nextTabbableElements = allTabbable.slice(activeIndex + 1);
  return nextTabbableElements[0];
}

export function getNextTabbable() {
  return getTabbableIn(document.body, 'next');
}

export function getPreviousTabbable() {
  return getTabbableIn(document.body, 'prev');
}

export function isOutsideEvent(event, container) {
  const containerElement = container || event.currentTarget;
  const relatedTarget = event.relatedTarget;
  return !relatedTarget || !contains(containerElement, relatedTarget);
}

export function disableFocusInside(container) {
  const tabbableElements = tabbable(container, getTabbableOptions());
  tabbableElements.forEach((element) => {
    element.dataset.tabindex = element.getAttribute('tabindex') || '';
    element.setAttribute('tabindex', '-1');
  });
}

export function enableFocusInside(container) {
  const elements = container.querySelectorAll('[data-tabindex]');
  elements.forEach((element) => {
    const tabindex = element.dataset.tabindex;
    delete element.dataset.tabindex;
    if (tabindex) {
      element.setAttribute('tabindex', tabindex);
    } else {
      element.removeAttribute('tabindex');
    }
  });
}
