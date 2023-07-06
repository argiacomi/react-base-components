import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling } from '@styles';
import { appendOwnerState, useId } from '@components/lib';
import IconButton from '@components/Inputs/Button/IconButton';
import InputBase from '@components/Inputs/Input/InputBase';
import Select from '@components/Inputs/Select';
import MenuItem from '@components/Navigation/Menu/MenuItem';
import Toolbar from '@components/Surfaces/AppBar/Toolbar';
import TableCell from '../TableCell';
import BaseTablePagination, {
  tablePaginationClasses as baseTablePaginationClasses
} from './BaseTablePagination';
import FirstPageIcon from '@icons/FirstPage';
import KeyboardArrowLeft from '@icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@icons/KeyboardArrowRight';
import LastPageIcon from '@icons/LastPage';

export const tablePaginationClasses = baseTablePaginationClasses;

const CustomIconButton = React.forwardRef((props, ref) => {
  const { ownerState, ...other } = props;
  return <IconButton ref={ref} {...other} />;
});

CustomIconButton.displayName = 'CustomIconButton';

const TablePaginationRoot = styled('td', {
  name: 'TablePagination',
  slot: 'Root'
})(({ theme, ownerState }) => ({
  overflow: 'auto',
  color: theme.color.text.primary,
  fontSize: theme.pxToRem(14),
  '&:last-child': {
    padding: 0
  },
  ...ownerState.cssStyles
}));

const TablePaginationToolbar = styled(Toolbar, {
  name: 'TablePagination',
  slot: 'Toolbar'
})(({ theme }) => ({
  minHeight: 52,
  paddingRight: 2,
  [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
    minHeight: 52
  },
  [theme.breakpoints.up('sm')]: {
    minHeight: 52,
    paddingRight: 2
  },
  [`& .${tablePaginationClasses.actions}`]: {
    flexShrink: 0,
    marginLeft: 20
  }
}));

const TablePaginationSpacer = styled('div', {
  name: 'TablePagination',
  slot: 'Spacer'
})({
  flex: '1 1 100%'
});

const TablePaginationSelectLabel = styled('p', {
  name: 'TablePagination',
  slot: 'SelectLabel'
})(({ theme }) => ({
  ...theme.text.typography.body2,
  flexShrink: 0
}));

const TablePaginationSelect = styled(Select, {
  name: 'TablePagination',
  slot: 'Select'
})({
  color: 'inherit',
  fontSize: 'inherit',
  flexShrink: 0,
  marginRight: 32,
  marginLeft: 8,
  [`& .${tablePaginationClasses.select}`]: {
    paddingLeft: 8,
    paddingRight: 24,
    textAlign: 'right',
    textAlignLast: 'right'
  }
});

const TablePaginationMenuItem = styled(MenuItem, {
  name: 'TablePagination',
  slot: 'MenuItem'
})({});

const TablePaginationDisplayedRows = styled('p', {
  name: 'TablePagination',
  slot: 'DisplayedRows'
})(({ theme }) => ({
  ...theme.text.typography.body2,
  flexShrink: 0
}));

const TablePagination = React.forwardRef((props, ref) => {
  const {
    ActionsComponent,
    backIconButtonProps,
    className,
    component = TableCell,
    nextIconButtonProps,
    slotProps = {},
    showFirstButton = false,
    showLastButton = false,
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = { ...props, cssStyles };
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
  const MenuItemComponent = slotProps.select?.native ? 'option' : TablePaginationMenuItem;

  const selectId = useId(slotProps.select?.id);
  const labelId = useId(slotProps.select?.['aria-labelledby']);

  const rootProps = appendOwnerState(TablePaginationRoot, {}, ownerState);
  const actionsProps = appendOwnerState(ActionsComponent, {}, ownerState);
  const selectProps = appendOwnerState(TablePaginationSelect, slotProps?.select, ownerState);
  const menuItemProps = appendOwnerState(MenuItemComponent, {}, ownerState);
  const displayedRowsProps = appendOwnerState(TablePaginationDisplayedRows, {}, ownerState);
  const selectLabelProps = appendOwnerState(TablePaginationSelectLabel, {}, ownerState);
  const spacerProps = appendOwnerState(TablePaginationSpacer, {}, ownerState);
  const toolbarProps = appendOwnerState(TablePaginationToolbar, {}, ownerState);

  return (
    <BaseTablePagination
      slots={{
        root: TablePaginationRoot,
        actions: ActionsComponent,
        toolbar: TablePaginationToolbar,
        spacer: TablePaginationSpacer,
        selectLabel: TablePaginationSelectLabel,
        select: TablePaginationSelect,
        menuItem: MenuItemComponent,
        displayedRows: TablePaginationDisplayedRows
      }}
      slotProps={{
        root: {
          as: component,
          ...rootProps
        },
        actions: {
          slots: {
            firstButton: CustomIconButton,
            lastButton: CustomIconButton,
            nextButton: CustomIconButton,
            backButton: CustomIconButton,
            lastPageIcon: LastPageIcon,
            firstPageIcon: FirstPageIcon,
            nextPageIcon: KeyboardArrowRight,
            backPageIcon: KeyboardArrowLeft
          },
          slotProps: {
            backButton: backIconButtonProps,
            nextButton: nextIconButtonProps
          },
          showFirstButton,
          showLastButton,
          className: classes.actions,
          ownerState,
          ...actionsProps
        },
        select: {
          variant: 'standard',
          input: <InputBase />,
          ...selectProps,
          ...(slotProps.select?.native ? {} : { labelId }),
          'aria-labelledby': labelId,
          className: clsx(classes.select, slotProps.select?.className),
          classes: {
            ...slotProps.select?.classes,
            root: clsx(classes.selectRoot, (slotProps.select?.classes || {}).root),
            select: clsx(classes.select, (slotProps.select?.classes || {}).select)
          }
        },
        menuItem: {
          className: classes.menuItem,
          ...menuItemProps
        },
        displayedRows: {
          className: classes.displayedRows,
          ...displayedRowsProps
        },
        selectLabel: {
          className: classes.selectLabel,
          ...selectLabelProps
        },
        spacer: {
          className: classes.spacer,
          ...spacerProps
        },
        toolbar: {
          className: classes.toolbar,
          ...toolbarProps
        }
      }}
      selectId={selectId}
      labelId={labelId}
      ref={ref}
      {...other}
      className={clsx(classes.root, className)}
    />
  );
});

TablePagination.displayName = 'TablePagination';

export default TablePagination;
