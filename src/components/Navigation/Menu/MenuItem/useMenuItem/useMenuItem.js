import { useBaseListItem as useListItem } from '@BaseList';
import React from 'react';
import { useCompoundItem, useForkRef, useId } from '@components/lib';
import { useButton } from '@components/Inputs/Button/ButtonBase';

function idGenerator(existingKeys) {
  return `menu-item-${existingKeys.size}`;
}

export default function useMenuItem(params) {
  const { disabled = false, id: idParam, rootRef: externalRef, label } = params;

  const id = useId(idParam);
  const itemRef = React.useRef(null);

  const itemMetadata = React.useMemo(
    () => ({ disabled, id: id ?? '', label, ref: itemRef }),
    [disabled, id, label]
  );

  const {
    getRootProps: getListRootProps,
    highlighted,
    rootRef: listItemRefHandler,
    selected
  } = useListItem({
    item: id
  });

  const { index, totalItemCount } = useCompoundItem(id ?? idGenerator, itemMetadata);

  const {
    getRootProps: getButtonProps,
    focusVisible,
    rootRef: buttonRefHandler
  } = useButton({
    disabled,
    disableFocusRipple: true,
    focusableWhenDisabled: true
  });

  const handleRef = useForkRef(listItemRefHandler, buttonRefHandler, externalRef, itemRef);

  React.useDebugValue({ id, highlighted, disabled, label });

  if (id === undefined) {
    return {
      getRootProps: (otherHandlers) => ({
        ...otherHandlers,
        ...getButtonProps(otherHandlers),
        role: 'menuitem'
      }),
      disabled: false,
      focusVisible,
      highlighted: false,
      index: -1,
      totalItemCount: 0,
      rootRef: handleRef
    };
  }

  const getRootProps = (otherHandlers) => {
    const resolvedButtonProps = {
      ...otherHandlers,
      ...getButtonProps(otherHandlers)
    };

    const resolvedMenuItemProps = {
      ...resolvedButtonProps,
      ...getListRootProps(resolvedButtonProps)
    };

    return {
      ...otherHandlers,
      ...resolvedButtonProps,
      ...resolvedMenuItemProps,
      role: 'menuitem',
      ref: handleRef
    };
  };

  return {
    getRootProps,
    disabled,
    focusVisible,
    highlighted,
    index,
    rootRef: handleRef,
    selected,
    totalItemCount
  };
}
