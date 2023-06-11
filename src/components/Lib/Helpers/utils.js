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
