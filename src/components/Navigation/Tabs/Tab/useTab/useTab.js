import React from 'react';
import { useCompoundItem, useForkRef, useId } from '@components/lib';
import { useBaseListItem } from '@components/display/list/baselist';
import { useTabsContext } from '../../Tabs';

function tabValueGenerator(otherTabValues) {
  return otherTabValues.size;
}

function useTab(parameters) {
  const {
    component,
    value: valueParam,
    rootRef: externalRef,
    disabled = false,
    id: idParam
  } = parameters;

  const tabRef = React.useRef(null);
  const id = useId(idParam);

  const { value: selectedValue, selectionFollowsFocus, getTabPanelId } = useTabsContext();

  const tabMetadata = React.useMemo(() => ({ disabled, ref: tabRef, id }), [disabled, tabRef, id]);

  const {
    id: value,
    index,
    totalItemCount: totalTabsCount
  } = useCompoundItem(valueParam ?? tabValueGenerator, tabMetadata);

  const {
    getRootProps: getTabProps,
    rootRef: listItemRefHandler,
    highlighted,
    selected
  } = useBaseListItem({
    item: value
  });

  const handleRef = useForkRef(tabRef, externalRef, listItemRefHandler);

  const tabPanelId = value !== undefined ? getTabPanelId(value) : undefined;

  const getRootProps = (otherHandlers) => {
    const resolvedTabProps = {
      ...otherHandlers,
      ...getTabProps(otherHandlers)
    };

    return {
      ...resolvedTabProps,
      component,
      disabled,
      focusableWhenDisabled: !selectionFollowsFocus,
      type: 'button',
      role: 'tab',
      'aria-controls': tabPanelId,
      'aria-selected': selected,
      id,
      ref: handleRef
    };
  };

  return {
    getRootProps,
    disabled,
    highlighted,
    index,
    rootRef: handleRef,
    selected: selected || value === selectedValue,
    totalTabsCount
  };
}

export default useTab;
