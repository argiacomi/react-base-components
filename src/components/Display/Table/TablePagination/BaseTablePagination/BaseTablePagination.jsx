import React from 'react';
import { isHostComponent, useId, useSlotProps } from '@components/lib';
import TablePaginationActions from './TablePaginationActions';

export const tablePaginationClasses = {
  root: 'TablePagination-Root',
  toolbar: 'TablePagination-Toolbar',
  spacer: 'TablePagination-Spacer',
  selectLabel: 'TablePagination-SelectLabel',
  select: 'TablePagination-Select',
  selectIcon: 'TablePagination-SelectIcon',
  input: 'TablePagination-Input',
  menuItem: 'TablePagination-MenuItem',
  displayedRows: 'TablePagination-DisplayedRows',
  actions: 'TablePagination-Actions'
};

function defaultLabelDisplayedRows({ from, to, count }) {
  return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
}

function defaultGetAriaLabel(type) {
  return `Go to ${type} page`;
}

const TablePagination = React.forwardRef((props, ref) => {
  const {
    colSpan: colSpanProp,
    count,
    getItemAriaLabel = defaultGetAriaLabel,
    labelDisplayedRows = defaultLabelDisplayedRows,
    labelId: labelIdProp,
    labelRowsPerPage = 'Rows per page:',
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    rowsPerPageOptions = [10, 25, 50, 100],
    selectId: selectIdProp,
    slotProps = {},
    slots = {},
    ...other
  } = props;

  const ownerState = props;
  const classes = {
    root: tablePaginationClasses.root,
    toolbar: tablePaginationClasses.toolbar,
    spacer: tablePaginationClasses.spacer,
    selectLabel: tablePaginationClasses.selectLabel,
    select: tablePaginationClasses.select,
    input: tablePaginationClasses.input,
    selectIcon: tablePaginationClasses.selectIcon,
    menuItem: tablePaginationClasses.menuItem,
    displayedRows: tablePaginationClasses.displayedRows,
    actions: tablePaginationClasses.actions
  };

  let colSpan;
  const Root = slots.root ?? 'td';
  if (Root === 'td' || !isHostComponent(Root)) {
    colSpan = colSpanProp || 1000; // col-span over everything
  }

  const getLabelDisplayedRowsTo = () => {
    if (count === -1) {
      return (page + 1) * rowsPerPage;
    }
    return rowsPerPage === -1 ? count : Math.min(count, (page + 1) * rowsPerPage);
  };

  const selectId = useId(selectIdProp);
  const labelId = useId(labelIdProp);

  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      colSpan,
      ref: ref
    },
    ownerState,
    className: classes.root
  });

  const Select = slots.select ?? 'select';
  const selectProps = useSlotProps({
    elementType: Select,
    externalSlotProps: slotProps.select,
    additionalProps: {
      value: rowsPerPage,
      id: selectId,
      onChange: (event) => onRowsPerPageChange && onRowsPerPageChange(event),
      'aria-label': rowsPerPage.toString(),
      'aria-labelledby': [labelId, selectId].filter(Boolean).join(' ') || undefined
    },
    ownerState,
    className: classes.select
  });

  const Actions = slots.actions ?? TablePaginationActions;
  const actionsProps = useSlotProps({
    elementType: Actions,
    externalSlotProps: slotProps.actions,
    additionalProps: {
      page,
      rowsPerPage,
      count,
      onPageChange,
      getItemAriaLabel
    },
    ownerState,
    className: classes.actions
  });

  const MenuItem = slots.menuItem ?? 'option';
  const menuItemProps = useSlotProps({
    elementType: MenuItem,
    externalSlotProps: slotProps.menuItem,
    additionalProps: {
      value: undefined
    },
    ownerState,
    className: classes.menuItem
  });

  const SelectLabel = slots.selectLabel ?? 'p';
  const selectLabelProps = useSlotProps({
    elementType: SelectLabel,
    externalSlotProps: slotProps.selectLabel,
    additionalProps: {
      id: labelId
    },
    ownerState,
    className: classes.selectLabel
  });

  const DisplayedRows = slots.displayedRows ?? 'p';
  const displayedRowsProps = useSlotProps({
    elementType: DisplayedRows,
    externalSlotProps: slotProps.displayedRows,
    ownerState,
    className: classes.displayedRows
  });

  const Toolbar = slots.toolbar ?? 'div';
  const toolbarProps = useSlotProps({
    elementType: Toolbar,
    externalSlotProps: slotProps.toolbar,
    ownerState,
    className: classes.toolbar
  });

  const Spacer = slots.spacer ?? 'div';
  const spacerProps = useSlotProps({
    elementType: Spacer,
    externalSlotProps: slotProps.spacer,
    ownerState,
    className: classes.spacer
  });

  return (
    <Root {...rootProps}>
      <Toolbar {...toolbarProps}>
        <Spacer {...spacerProps} />
        {rowsPerPageOptions.length > 1 && (
          <SelectLabel {...selectLabelProps}>{labelRowsPerPage}</SelectLabel>
        )}

        {rowsPerPageOptions.length > 1 && (
          <Select {...selectProps}>
            {rowsPerPageOptions.map((rowsPerPageOption) => (
              <MenuItem
                {...menuItemProps}
                key={
                  typeof rowsPerPageOption !== 'number' && rowsPerPageOption.label
                    ? rowsPerPageOption.label
                    : rowsPerPageOption
                }
                value={
                  typeof rowsPerPageOption !== 'number' && rowsPerPageOption.value
                    ? rowsPerPageOption.value
                    : rowsPerPageOption
                }
              >
                {typeof rowsPerPageOption !== 'number' && rowsPerPageOption.label
                  ? rowsPerPageOption.label
                  : rowsPerPageOption}
              </MenuItem>
            ))}
          </Select>
        )}

        <DisplayedRows {...displayedRowsProps}>
          {labelDisplayedRows({
            from: count === 0 ? 0 : page * rowsPerPage + 1,
            to: getLabelDisplayedRowsTo(),
            count: count === -1 ? -1 : count,
            page
          })}
        </DisplayedRows>
        <Actions {...actionsProps} />
      </Toolbar>
    </Root>
  );
});

TablePagination.displayName = 'TablePagination';

export default TablePagination;
