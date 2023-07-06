import { useBaseListItem as useListItem } from '@BaseList';
import React from 'react';
import { useCompoundItem, useForkRef, useId } from '@components/lib';

export default function useOption(parameters) {
  const { value, label, disabled, rootRef: optionRefParam, id: idParam } = parameters;

  const {
    getRootProps: getListItemProps,
    rootRef: listItemRefHandler,
    highlighted,
    selected
  } = useListItem({
    item: value
  });

  const id = useId(idParam);

  const optionRef = React.useRef(null);

  const selectOption = React.useMemo(
    () => ({
      disabled,
      label,
      value,
      ref: optionRef,
      id
    }),
    [disabled, label, value, id]
  );

  const { index } = useCompoundItem(value, selectOption);

  const handleRef = useForkRef(optionRefParam, optionRef, listItemRefHandler);

  return {
    getRootProps: (otherHandlers) => ({
      ...otherHandlers,
      ...getListItemProps(otherHandlers),
      id,
      ref: handleRef,
      role: 'option',
      'aria-selected': selected
    }),
    highlighted,
    index,
    selected,
    rootRef: handleRef
  };
}
