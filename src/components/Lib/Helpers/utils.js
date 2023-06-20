export function ownerDocument(node) {
  return (node && node.ownerDocument) || document;
}

export function ownerWindow(node) {
  const doc = ownerDocument(node);
  return doc.defaultView || window;
}

export function createChainedFunction(funcs, id) {
  return funcs.reduce(
    (acc, func) => {
      if (func === null || func === undefined) {
        return acc;
      }

      return function chainedFunction(...args) {
        if (id && args.indexOf(id) === -1) {
          args.push(id);
        }
        acc.apply(this, args);
        func.apply(this, args);
      };
    },
    () => {}
  );
}

export function getScrollbarSize(doc) {
  const documentWidth = doc.documentElement.clientWidth;
  return Math.abs(window.innerWidth - documentWidth);
}

let cachedType;

export function detectScrollType() {
  if (cachedType) {
    return cachedType;
  }

  const dummy = document.createElement('div');
  const container = document.createElement('div');
  container.style.width = '10px';
  container.style.height = '1px';
  dummy.appendChild(container);
  dummy.dir = 'rtl';
  dummy.style.fontSize = '14px';
  dummy.style.width = '4px';
  dummy.style.height = '1px';
  dummy.style.position = 'absolute';
  dummy.style.top = '-1000px';
  dummy.style.overflow = 'scroll';

  document.body.appendChild(dummy);

  cachedType = 'reverse';

  if (dummy.scrollLeft > 0) {
    cachedType = 'default';
  } else {
    dummy.scrollLeft = 1;
    if (dummy.scrollLeft === 0) {
      cachedType = 'negative';
    }
  }

  document.body.removeChild(dummy);
  return cachedType;
}

export function getNormalizedScrollLeft(element, direction) {
  const scrollLeft = element.scrollLeft;

  if (direction !== 'rtl') {
    return scrollLeft;
  }

  const type = detectScrollType();

  switch (type) {
    case 'negative':
      return element.scrollWidth - element.clientWidth + scrollLeft;
    case 'reverse':
      return element.scrollWidth - element.clientWidth - scrollLeft;
    default:
      return scrollLeft;
  }
}

export function areArraysEqual(array1, array2, itemComparer) {
  return (
    array1.length === array2.length &&
    array1.every((value, index) => itemComparer(value, array2[index]))
  );
}
