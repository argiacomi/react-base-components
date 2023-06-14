import * as React from 'react';
import { isFragment } from 'react-is';
import clsx from 'clsx';
import { styled } from '@styles';
import { useSlotProps } from '@components/lib';
import { Text } from '@components/layout';
import BreadcrumbCollapsed from './BreadcrumbCollapsed';

const BreadcrumbsRoot = styled(Text)({});

const BreadcrumbsOl = styled('ol')({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  padding: 0,
  margin: 0,
  listStyle: 'none'
});

const BreadcrumbsSeparator = styled('li')(({ theme }) => ({
  display: 'flex',
  userSelect: 'none',
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1)
}));

function insertSeparators(items, className, separator, ownerState) {
  return items.reduce((acc, current, index) => {
    if (index < items.length - 1) {
      acc = acc.concat(
        current,
        <BreadcrumbsSeparator
          aria-hidden
          key={`separator-${index}`}
          className={className}
          ownerState={ownerState}
        >
          {separator}
        </BreadcrumbsSeparator>
      );
    } else {
      acc.push(current);
    }

    return acc;
  }, []);
}

const Breadcrumbs = React.forwardRef((props, ref) => {
  const {
    children,
    className,
    component = 'nav',
    slots = {},
    slotProps = {},
    expandText = 'Show path',
    itemsAfterCollapse = 1,
    itemsBeforeCollapse = 1,
    maxItems = 8,
    separator = '/',
    ...other
  } = props;

  const [expanded, setExpanded] = React.useState(false);

  const ownerState = {
    ...props,
    component,
    expanded,
    expandText,
    itemsAfterCollapse,
    itemsBeforeCollapse,
    maxItems,
    separator
  };

  const collapsedIconSlotProps = useSlotProps({
    elementType: slots.CollapsedIcon,
    externalSlotProps: slotProps.collapsedIcon,
    ownerState
  });

  const listRef = React.useRef(null);
  const renderItemsBeforeAndAfter = (allItems) => {
    const handleClickExpand = () => {
      setExpanded(true);

      const focusable = listRef.current.querySelector('a[href],button,[tabindex]');
      if (focusable) {
        focusable.focus();
      }
    };

    if (itemsBeforeCollapse + itemsAfterCollapse >= allItems.length) {
      if (!import.meta.env.PROD) {
        console.error(
          `You have provided an invalid combination of props to the Breadcrumbs.
        itemsAfterCollapse={${itemsAfterCollapse}} + itemsBeforeCollapse={${itemsBeforeCollapse}} >= maxItems={${maxItems}}`
        );
      }
      return allItems;
    }

    return [
      ...allItems.slice(0, itemsBeforeCollapse),
      <BreadcrumbCollapsed
        aria-label={expandText}
        key='ellipsis'
        slots={{ CollapsedIcon: slots.CollapsedIcon }}
        slotProps={{ collapsedIcon: collapsedIconSlotProps }}
        onClick={handleClickExpand}
      />,
      ...allItems.slice(allItems.length - itemsAfterCollapse, allItems.length)
    ];
  };

  const allItems = React.Children.toArray(children)
    .filter((child) => {
      if (!import.meta.env.PROD) {
        if (isFragment(child)) {
          console.error(
            `The Breadcrumbs component doesn't accept a Fragment as a child.
            Consider providing an array instead.`
          );
        }
      }

      return React.isValidElement(child);
    })
    .map((child, index) => (
      <li className={'Breadcrumbs-Li'} key={`child-${index}`}>
        {child}
      </li>
    ));

  return (
    <BreadcrumbsRoot
      ref={ref}
      component={component}
      color='text.secondary'
      className={clsx('Breadcrumbs-Root', className)}
      ownerState={ownerState}
      {...other}
    >
      <BreadcrumbsOl className={'Breadcrumbs-Ol'} ref={listRef} ownerState={ownerState}>
        {insertSeparators(
          expanded || (maxItems && allItems.length <= maxItems)
            ? allItems
            : renderItemsBeforeAndAfter(allItems),
          'Breadcrumbs-Separator',
          separator,
          ownerState
        )}
      </BreadcrumbsOl>
    </BreadcrumbsRoot>
  );
});

Breadcrumbs.displayName = 'Breadcrumbs';

export default Breadcrumbs;
