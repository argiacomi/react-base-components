import * as React from 'react';
import { useCompoundItem, useId, useForkRef } from '@components/lib';
import { useListContext } from '../BaseList/ListContext';
import { useBaseListItem } from '../BaseList';
import { useButton } from '@components/inputs';

function listItemValueGenerator(otherItemValues) {
  return otherItemValues.size;
}

function useListItem(parameters) {
  const { value: valueParam, rootRef: externalRef, disabled = false, id: idParam } = parameters;

  const itemRef = React.useRef();
  const id = useId(idParam);

  const { value: selectedValue, dense, selectionFollowsFocus } = useListContext();

  const listItemMetadata = React.useMemo(
    () => ({ disabled, ref: itemRef, id }),
    [disabled, itemRef, id]
  );

  const {
    id: value,
    index,
    totalItemCount: totalItemsCount
  } = useCompoundItem(valueParam ?? listItemValueGenerator, listItemMetadata);

  const {
    getRootProps: getListItemProps,
    rootRef: listItemRefHandler,
    highlighted,
    selected
  } = useBaseListItem({
    item: value
  });

  const {
    getRootProps: getButtonProps,
    rootRef: buttonRefHandler,
    active,
    focusVisible,
    setFocusVisible
  } = useButton({
    disabled,
    focusableWhenDisabled: !selectionFollowsFocus,
    type: 'button'
  });

  const handleRef = useForkRef(itemRef, externalRef, listItemRefHandler, buttonRefHandler);

  const getRootProps = (otherHandlers) => {
    const resolvedListProps = {
      ...otherHandlers,
      ...getListItemProps(otherHandlers)
    };

    const resolvedButtonProps = {
      ...resolvedListProps,
      ...getButtonProps(resolvedListProps)
    };

    return {
      ...resolvedButtonProps,
      role: 'listItem',
      'aria-selected': selected,
      id,
      ref: handleRef
    };
  };

  return {
    getRootProps,
    active,
    dense,
    focusVisible,
    highlighted,
    index,
    rootRef: handleRef,
    selected: selected || value === selectedValue,
    setFocusVisible,
    totalItemsCount
  };
}

export default useListItem;
