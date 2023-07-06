import React from 'react';
import { isFragment } from 'react-is';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';
import { Text } from '@components/display';
import BreadcrumbCollapsed from './BreadcrumbCollapsed';

export const breadcrumbsClasses = {
  root: 'Breadcrumbs-Root',
  li: 'Breadcrumbs-Li',
  ol: 'Breadcrumbs-Ol',
  separator: 'Breadcrumbs-Separator'
};

const BreadcrumbsRoot = styled(Text)(({ ownerState }) => ownerState.cssStyles);

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
    component = 'nav',
    slots = {},
    slotProps = {},
    expandText = 'Show path',
    itemsAfterCollapse = 1,
    itemsBeforeCollapse = 1,
    maxItems = 8,
    separator = '/',
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const [expanded, setExpanded] = React.useState(false);

  const ownerState = {
    ...props,
    component,
    cssStyles,
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
      <li className={breadcrumbsClasses.li} key={`child-${index}`}>
        {child}
      </li>
    ));

  const BreadcrumbComponent = slots.root || BreadcrumbsRoot;
  const breadcrumbProps = useSlotProps({
    elementType: BreadcrumbComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      color: 'text.secondary',
      component,
      ref: ref
    },
    ownerState,
    className: breadcrumbsClasses.root
  });

  return (
    <BreadcrumbComponent {...breadcrumbProps}>
      <BreadcrumbsOl className={breadcrumbsClasses.ol} ref={listRef} ownerState={ownerState}>
        {insertSeparators(
          expanded || (maxItems && allItems.length <= maxItems)
            ? allItems
            : renderItemsBeforeAndAfter(allItems),
          breadcrumbsClasses.separator,
          separator,
          ownerState
        )}
      </BreadcrumbsOl>
    </BreadcrumbComponent>
  );
});

Breadcrumbs.displayName = 'Breadcrumbs';

export default Breadcrumbs;
