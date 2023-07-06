import React from 'react';
import { CompoundComponentContext } from './useCompound';
import { useEnhancedEffect } from './useEnhancedEffect';

export function useCompoundItem(id, itemMetadata) {
  const context = React.useContext(CompoundComponentContext);

  if (context === null) {
    throw new Error('useCompoundItem must be used within a useCompoundParent');
  }

  const { registerItem } = context;
  const [registeredId, setRegisteredId] = React.useState(typeof id === 'function' ? undefined : id);

  useEnhancedEffect(() => {
    const { id: returnedId, deregister } = registerItem(id, itemMetadata);
    setRegisteredId(returnedId);
    return deregister;
  }, [registerItem, itemMetadata, id]);

  return {
    id: registeredId,
    index: registeredId !== undefined ? context.getItemIndex(registeredId) : -1,
    totalItemCount: context.totalSubitemCount
  };
}
