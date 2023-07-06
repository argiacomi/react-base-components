import React from 'react';

export const CompoundComponentContext = React.createContext(null);

CompoundComponentContext.displayName = 'CompoundComponentContext';

function sortSubitems(subitems) {
  const subitemsArray = Array.from(subitems.keys()).map((key) => {
    const subitem = subitems.get(key);
    return { key, subitem };
  });

  subitemsArray.sort((a, b) => {
    const aNode = a.subitem.ref.current;
    const bNode = b.subitem.ref.current;

    if (aNode === null || bNode === null || aNode === bNode) {
      return 0;
    }

    return aNode.compareDocumentPosition(bNode) & Node.DOCUMENT_POSITION_PRECEDING ? 1 : -1;
  });

  return new Map(subitemsArray.map((item) => [item.key, item.subitem]));
}

export function useCompoundParent() {
  const [subitems, setSubitems] = React.useState(new Map());
  const subitemKeys = React.useRef(new Set());

  const deregisterItem = React.useCallback(function deregisterItem(id) {
    subitemKeys.current.delete(id);
    setSubitems((previousState) => {
      const newState = new Map(previousState);
      newState.delete(id);
      return newState;
    });
  }, []);

  const registerItem = React.useCallback(
    function registerItem(id, item) {
      let providedOrGeneratedId;

      if (typeof id === 'function') {
        providedOrGeneratedId = id(subitemKeys.current);
      } else {
        providedOrGeneratedId = id;
      }

      subitemKeys.current.add(providedOrGeneratedId);
      setSubitems((previousState) => {
        const newState = new Map(previousState);
        newState.set(providedOrGeneratedId, item);
        return newState;
      });

      return {
        id: providedOrGeneratedId,
        deregister: () => deregisterItem(providedOrGeneratedId)
      };
    },
    [deregisterItem]
  );

  const sortedSubitems = React.useMemo(() => sortSubitems(subitems), [subitems]);

  const getItemIndex = React.useCallback(
    function getItemIndex(id) {
      return Array.from(sortedSubitems.keys()).indexOf(id);
    },
    [sortedSubitems]
  );

  return {
    contextValue: {
      getItemIndex,
      registerItem,
      totalSubitemCount: subitems.size
    },
    subitems: sortedSubitems
  };
}
