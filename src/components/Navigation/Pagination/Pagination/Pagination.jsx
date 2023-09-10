import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling } from '@styles';
import PaginationItem from '../paginationItem';
import usePagination from './usePagination';

export const paginationClasses = {
  root: 'Pagination-Root',
  ul: 'Pagination-Ul'
};

const PaginationRoot = styled('nav', {
  name: 'Pagination',
  slot: 'Root'
})(({ ownerState }) => ownerState.cssStyles);

const PaginationUl = styled('ul', {
  name: 'Pagination',
  slot: 'Ul'
})({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  padding: 0,
  margin: 0,
  listStyle: 'none'
});

function defaultGetAriaLabel(type, page, selected) {
  if (type === 'page') {
    return `${selected ? '' : 'Go to '}page ${page}`;
  }
  return `Go to ${type} page`;
}

const Pagination = React.forwardRef((props, ref) => {
  const {
    boundaryCount = 1,
    className,
    color = 'standard',
    count = 1,
    defaultPage = 1,
    disabled = false,
    getItemAriaLabel = defaultGetAriaLabel,
    hideNextButton = false,
    hidePrevButton = false,
    onChange,
    page,
    renderItem = (item) => <PaginationItem {...item} />,
    shape = 'circular',
    showFirstButton = false,
    showLastButton = false,
    siblingCount = 1,
    size = 'medium',
    variant = 'text',
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const { items } = usePagination({ ...props, componentName: 'Pagination' });

  const ownerState = {
    ...props,
    boundaryCount,
    color,
    count,
    cssStyles,
    defaultPage,
    disabled,
    getItemAriaLabel,
    hideNextButton,
    hidePrevButton,
    renderItem,
    shape,
    showFirstButton,
    showLastButton,
    siblingCount,
    size,
    variant
  };

  const classes = {
    root: [paginationClasses.root, variant],
    ul: [paginationClasses.ul]
  };

  return (
    <PaginationRoot
      aria-label='pagination navigation'
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      ref={ref}
      {...other}
    >
      <PaginationUl className={classes.ul} ownerState={ownerState}>
        {items.map((item, index) => (
          <li key={index}>
            {renderItem({
              ...item,
              color,
              'aria-label': getItemAriaLabel(item.type, item.page, item.selected),
              shape,
              size,
              variant
            })}
          </li>
        ))}
      </PaginationUl>
    </PaginationRoot>
  );
});

// @default tags synced with default values from usePagination

Pagination.displayName = 'Pagination';

export default Pagination;
