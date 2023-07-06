import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling, useTheme } from '@styles';
import { capitalize } from '@components/lib';
import FirstPageIcon from '@components/lib/icons/FirstPage';
import LastPageIcon from '@components/lib/icons/LastPage';
import NavigateBeforeIcon from '@components/lib/icons/NavigateBefore';
import NavigateNextIcon from '@components/lib/icons/NavigateNext';
import ButtonBase from '@components/Inputs/Button/ButtonBase';

export const paginationItemClasses = {
  root: 'PaginationItem-Root',
  icon: 'PaginationItem-Icon',
  disabled: 'Disabled',
  selected: 'Selected',
  page: 'Page',
  first: 'FirstLast',
  last: 'FirstLast',
  'start-ellipsis': 'PaginationItem-Ellipsis',
  'end-ellipsis': 'PaginationItem-Ellipsis',
  previous: 'PreviousNext',
  next: 'PreviousNext'
};

const PaginationItemEllipsis = styled('div', {
  name: 'PaginationItem',
  slot: 'Root'
})(({ theme, ownerState }) => ({
  ...theme.text.typography.body2,
  borderRadius: 32 / 2,
  textAlign: 'center',
  boxSizing: 'border-box',
  minWidth: 32,
  padding: '0 6px',
  margin: '0 3px',
  color: theme.color.text.primary,
  height: 'auto',
  [`&.${paginationItemClasses.disabled}`]: {
    opacity: theme.color.disabledOpacity
  },
  ...(ownerState.size === 'small' && {
    minWidth: 26,
    borderRadius: 26 / 2,
    margin: '0 1px',
    padding: '0 4px'
  }),
  ...(ownerState.size === 'large' && {
    minWidth: 40,
    borderRadius: 40 / 2,
    padding: '0 10px',
    fontSize: theme.pxToRem(15)
  })
}));

const PaginationItemPage = styled(ButtonBase, {
  name: 'PaginationItem',
  slot: 'Root'
})(
  ({ theme, ownerState }) => ({
    ...theme.text.typography.body2,
    borderRadius: 32 / 2,
    textAlign: 'center',
    boxSizing: 'border-box',
    minWidth: 32,
    height: 32,
    padding: '0 6px',
    margin: '0 3px',
    color: theme.color.text.primary,
    [`&.${paginationItemClasses.focusVisible}`]: {
      backgroundColor: theme.color.focus
    },
    [`&.${paginationItemClasses.disabled}`]: {
      opacity: theme.color.disabledOpacity
    },
    transition: theme.transition.create(['color', 'background-color'], {
      duration: theme.transition.duration.short
    }),
    '&:hover': {
      backgroundColor: theme.color.hover,
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        backgroundColor: 'transparent'
      }
    },
    [`&.${paginationItemClasses.selected}`]: {
      backgroundColor: theme.color.selected,
      '&:hover': {
        backgroundColor: theme.alpha.add(
          theme.color.selected,
          theme.color.selectedOpacity + theme.color.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: theme.color.selected
        }
      },
      [`&.${paginationItemClasses.focusVisible}`]: {
        backgroundColor: theme.alpha.add(
          theme.color.selected,
          theme.color.selectedOpacity + theme.color.focusOpacity
        )
      },
      [`&.${paginationItemClasses.disabled}`]: {
        opacity: 1,
        color: theme.color.disabled.text,
        backgroundColor: theme.color.selected
      }
    },
    ...(ownerState.size === 'small' && {
      minWidth: 26,
      height: 26,
      borderRadius: 26 / 2,
      margin: '0 1px',
      padding: '0 4px'
    }),
    ...(ownerState.size === 'large' && {
      minWidth: 40,
      height: 40,
      borderRadius: 40 / 2,
      padding: '0 10px',
      fontSize: theme.pxToRem(15)
    }),
    ...(ownerState.shape === 'rounded' && {
      borderRadius: theme.rounded.md
    })
  }),
  ({ theme, ownerState }) => ({
    ...(ownerState.variant === 'text' && {
      [`&.${paginationItemClasses.selected}`]: {
        ...(ownerState.color !== 'standard' && {
          color: theme.color[ownerState.color].text,
          backgroundColor: theme.color[ownerState.color].body,
          '&:hover': {
            backgroundColor: theme.color[ownerState.color].dark,
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
              backgroundColor: theme.color[ownerState.color].body
            }
          },
          [`&.${paginationItemClasses.focusVisible}`]: {
            backgroundColor: theme.color[ownerState.color].dark
          }
        }),
        [`&.${paginationItemClasses.disabled}`]: {
          color: theme.color.disabled.text
        }
      }
    }),
    ...(ownerState.variant === 'outlined' && {
      border: `1px solid ${
        theme.color.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)'
      }`,
      [`&.${paginationItemClasses.selected}`]: {
        ...(ownerState.color !== 'standard' && {
          color: theme.color[ownerState.color].body,
          border: `1px solid ${theme.alpha.add(theme.color[ownerState.color].body, 0.5)}`,
          backgroundColor: theme.alpha.add(
            theme.color[ownerState.color].body,
            theme.color.activatedOpacity
          ),
          '&:hover': {
            backgroundColor: theme.alpha.add(
              theme.color[ownerState.color].body,
              theme.color.activatedOpacity + theme.color.focusOpacity
            ),
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
              backgroundColor: 'transparent'
            }
          },
          [`&.${paginationItemClasses.focusVisible}`]: {
            backgroundColor: theme.alpha.add(
              theme.color[ownerState.color].body,
              theme.color.activatedOpacity + theme.color.focusOpacity
            )
          }
        }),
        [`&.${paginationItemClasses.disabled}`]: {
          borderColor: theme.color.disabledBackground,
          color: theme.color.disabled.text
        }
      }
    }),
    ...ownerState.cssStyles
  })
);

const PaginationItemPageIcon = styled('div', {
  name: 'PaginationItem',
  slot: 'Icon'
})(({ theme, ownerState }) => ({
  fontSize: theme.pxToRem(20),
  margin: '0 -8px',
  ...(ownerState.size === 'small' && {
    fontSize: theme.pxToRem(18)
  }),
  ...(ownerState.size === 'large' && {
    fontSize: theme.pxToRem(22)
  })
}));

const PaginationItem = React.forwardRef((props, ref) => {
  const {
    className,
    color = 'standard',
    component,
    disabled = false,
    page,
    selected = false,
    shape = 'circular',
    size = 'medium',
    slots = {},
    type = 'page',
    variant = 'text',
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = {
    ...props,
    color,
    cssStyles,
    disabled,
    selected,
    shape,
    size,
    type,
    variant
  };

  const theme = useTheme();
  const classes = {
    root: [
      paginationItemClasses.root,
      `size${capitalize(size)}`,
      capitalize(variant),
      capitalize(shape),
      ownerState.color !== 'standard' && `${capitalize(variant)}${capitalize(color)}`,
      ownerState.disabled && paginationItemClasses.disabled,
      ownerState.selected && paginationItemClasses.selected,
      paginationItemClasses[ownerState.type]
    ],
    icon: paginationItemClasses.icon
  };

  const normalizedIcons =
    theme.direction === 'rtl'
      ? {
          previous: slots.next || NavigateNextIcon,
          next: slots.previous || NavigateBeforeIcon,
          last: slots.first || FirstPageIcon,
          first: slots.last || LastPageIcon
        }
      : {
          previous: slots.previous || NavigateBeforeIcon,
          next: slots.next || NavigateNextIcon,
          first: slots.first || FirstPageIcon,
          last: slots.last || LastPageIcon
        };

  const Icon = normalizedIcons[type];

  return type === 'start-ellipsis' || type === 'end-ellipsis' ? (
    <PaginationItemEllipsis
      ref={ref}
      ownerState={ownerState}
      className={clsx(classes.root, className)}
    >
      …
    </PaginationItemEllipsis>
  ) : (
    <PaginationItemPage
      ref={ref}
      ownerState={ownerState}
      component={component}
      disabled={disabled}
      className={clsx(classes.root, className)}
      {...other}
    >
      {type === 'page' && page}
      {Icon ? (
        <PaginationItemPageIcon as={Icon} ownerState={ownerState} className={classes.icon} />
      ) : null}
    </PaginationItemPage>
  );
});

PaginationItem.displayName = 'PaginationItem';

export default PaginationItem;
