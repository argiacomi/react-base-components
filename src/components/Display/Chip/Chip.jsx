import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling } from '@styles';
import { useForkRef, useSlotProps } from '@components/lib';
import { ButtonBase } from '@components/inputs';
import CancelIcon from '@icons/Cancel';

export const chipClasses = {
  root: 'Chip-Root',
  avatar: 'Chip-Avatar',
  deleteIcon: 'Chip-DeleteIcon',
  icon: 'Chip-Icon',
  label: 'Chip-Label',
  clickable: 'Clickable',
  deletable: 'Deletable',
  disabled: 'Disabled',
  filled: 'Filled',
  focusVisible: 'FocusVisible',
  outlined: 'Outlined',
  avatarColor: {
    Primary: 'AvatarColorPrimary',
    Secondary: 'AvatarColorSecondary'
  }
};

const outlinedStyles = (theme, ownerState) => ({
  backgroundColor: 'transparent',
  color: theme.color[ownerState.color].body,
  border: `1px solid ${theme.alpha.add(theme.color[ownerState.color].body, 0.7)}`,
  [`&.${chipClasses.clickable}:hover`]: {
    backgroundColor: theme.alpha.add(theme.color[ownerState.color].body, theme.color.hoverOpacity)
  },
  [`&.${chipClasses.focusVisible}`]: {
    backgroundColor: theme.alpha.add(theme.color[ownerState.color].body, theme.color.focusOpacity)
  },
  [`& .${chipClasses.deleteIcon}`]: {
    color: theme.alpha.add(theme.color[ownerState.color].body, 0.7),
    marginRight: ownerState.size === 'small' ? theme.pxToRem(3) : theme.pxToRem(5),
    '&:hover, &:active': {
      color: theme.color[ownerState.color].body
    }
  },
  [`& .${chipClasses.avatar}, & .${chipClasses.icon}`]: {
    marginLeft: ownerState.size === 'small' ? theme.pxToRem(2) : theme.pxToRem(4)
  }
});

const avatarStyles = (theme, ownerState) => ({
  [`& .${chipClasses.avatar}`]: {
    color: theme.color.text.secondary,
    marginLeft: theme.pxToRem(5),
    marginRight: theme.pxToRem(-6),
    width: theme.pxToRem(24),
    height: theme.pxToRem(24),
    fontSize: theme.pxToRem(12),
    ...(ownerState.size === 'small' && {
      marginLeft: theme.pxToRem(4),
      marginRight: theme.pxToRem(-4),
      width: theme.pxToRem(18),
      height: theme.pxToRem(18),
      fontSize: theme.pxToRem(10)
    })
  },
  [`& .${chipClasses.avatarColor.primary}`]: {
    color: theme.color.primary.text,
    backgroundColor: theme.color.primary[600]
  },
  [`& .${chipClasses.avatarColor.secondary}`]: {
    color: theme.color.secondary.text,
    backgroundColor: theme.color.secondary[600]
  }
});

const iconStyles = (theme, ownerState) => ({
  [`& .${chipClasses.icon}`]: {
    marginLeft: theme.pxToRem(5),
    marginRight: theme.pxToRem(-6),
    ...(ownerState.size === 'small' && {
      fontSize: theme.pxToRem(18),
      marginLeft: theme.pxToRem(4),
      marginRight: theme.pxToRem(-4)
    }),
    // TODO: Keep an eye on this
    ...(ownerState.iconColor === ownerState.color && {
      color: theme.color.text.secondary,
      ...(ownerState.color !== 'default' && {
        color: 'inherit'
      })
    })
  },
  [`& .${chipClasses.deleteIcon}`]: {
    WebkitTapHighlightColor: 'transparent',
    color: theme.alpha.add(theme.color.text.primary, 0.26),
    fontSize: theme.pxToRem(22),
    cursor: 'pointer',
    margin: `0 ${theme.pxToRem(5)} 0 ${theme.pxToRem(-6)}`,
    '&:hover': {
      color: theme.alpha.add(theme.color.text.primary, 0.4)
    },
    ...(ownerState.size === 'small' && {
      fontSize: theme.pxToRem(16),
      marginRight: theme.pxToRem(4),
      marginLeft: theme.pxToRem(-4)
    }),
    ...(ownerState.color !== 'default' && {
      color: theme.alpha.add(theme.color[ownerState.color].text, 0.7),
      '&:hover, &:active': {
        color: theme.color[ownerState.color].text
      }
    })
  }
});

const clickableStyles = (theme, ownerState) => ({
  userSelect: 'none',
  WebkitTapHighlightColor: 'transparent',
  cursor: 'pointer',
  [`&:hover, &.${chipClasses.focusVisible}`]: {
    backgroundColor:
      ownerState.color === 'default'
        ? theme.alpha.add(theme.color.selected, 0.24)
        : theme.color[ownerState.color][600]
  },
  '&:active': {
    boxShadow: theme.boxShadow[1]
  }
});

const onDeleteStyles = (theme, ownerState) => ({
  [`&.${chipClasses.focusVisible}`]: {
    backgroundColor:
      ownerState.color === 'default'
        ? theme.alpha.add(theme.color.selected, theme.color.mode === 'light' ? 0.2 : 0.28)
        : theme.color[ownerState.color][600]
  }
});

const ChipRoot = styled('div')(
  ({ theme, ownerState }) => {
    return {
      maxWidth: '100%',
      fontFamily: 'inherit',
      fontSize: theme.pxToRem(13),
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: ownerState.size === 'small' ? theme.pxToRem(24) : theme.pxToRem(32),
      color:
        ownerState.color === 'default'
          ? theme.color.text.primary
          : theme.color[ownerState.color].text,
      backgroundColor:
        ownerState.color === 'default' ? theme.color.selected : theme.color[ownerState.color].body,
      borderRadius: theme.rounded['2xl'],
      whiteSpace: 'nowrap',
      transition: theme.transition.create(['background-color', 'box-shadow']),
      cursor: 'default',
      outline: 0,
      textDecoration: 'none',
      border: 0,
      padding: 0,
      verticalAlign: 'middle',
      boxSizing: 'border-box',
      [`&.${chipClasses.disabled}`]: {
        opacity: theme.color.disabledOpacity,
        pointerEvents: 'none'
      },
      ...avatarStyles(theme, ownerState),
      ...iconStyles(theme, ownerState),
      ...(ownerState.onDelete && onDeleteStyles(theme, ownerState))
    };
  },
  ({ theme, ownerState }) => ownerState.clickable && clickableStyles(theme, ownerState),
  ({ theme, ownerState }) => ownerState.variant === 'outlined' && outlinedStyles(theme, ownerState),
  ({ ownerState }) => ownerState.cssStyles
);

const ChipLabel = styled('span')(({ theme, ownerState }) => ({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  paddingLeft: ownerState.size === 'small' ? theme.pxToRem(8) : theme.pxToRem(12),
  paddingRight: ownerState.size === 'small' ? theme.pxToRem(8) : theme.pxToRem(12),
  whiteSpace: 'nowrap'
}));

function isDeleteKeyboardEvent(keyboardEvent) {
  return keyboardEvent.key === 'Backspace' || keyboardEvent.key === 'Delete';
}

const Chip = React.forwardRef((props, ref) => {
  const {
    avatar: avatarProp,
    clickable: clickableProp,
    color = 'default',
    component: componentProp,
    deleteIcon: deleteIconProp,
    disabled = false,
    icon: iconProp,
    label,
    onClick,
    onDelete,
    onKeyDown,
    onKeyUp,
    size = 'medium',
    slots = {},
    slotProps = {},
    variant = 'filled',
    tabIndex,
    focusableWhenDisabled = false,
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const chipRef = React.useRef(null);
  const handleRef = useForkRef(chipRef, ref);

  const handleDeleteIconClick = (event) => {
    event.stopPropagation();
    if (onDelete) {
      onDelete(event);
    }
  };

  const handleKeyDown = (event) => {
    if (event.currentTarget === event.target && isDeleteKeyboardEvent(event)) {
      event.preventDefault();
    }

    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  const handleKeyUp = (event) => {
    if (event.currentTarget === event.target) {
      if (onDelete && isDeleteKeyboardEvent(event)) {
        onDelete(event);
      } else if (event.key === 'Escape' && chipRef.current) {
        chipRef.current.blur();
      }
    }

    if (onKeyUp) {
      onKeyUp(event);
    }
  };

  const clickable = clickableProp !== false && onClick ? true : clickableProp;

  const component = clickable || onDelete ? ButtonBase : componentProp || 'div';

  const ownerState = {
    ...props,
    cssStyles,
    component,
    disabled,
    size,
    color,
    iconColor: React.isValidElement(iconProp) ? iconProp.props.color || color : color,
    onDelete: !!onDelete,
    clickable,
    variant
  };

  const classes = {
    root: clsx(
      chipClasses.root,
      ownerState.clickable && chipClasses.clickable,
      ownerState.onDelete && chipClasses.deletable,
      ownerState.disabled && chipClasses.disabled,
      chipClasses[ownerState.variant]
    ),
    avatar: [chipClasses.avatar, chipClasses.avatarColor[ownerState.color]],
    deleteIcon: chipClasses.deleteIcon,
    icon: chipClasses.icon,
    label: chipClasses.label,
    focusVisible: chipClasses.focusVisible
  };

  const moreProps =
    component === ButtonBase
      ? {
          component: componentProp || 'div',
          focusVisibleClassName: classes.focusVisible,
          ...(onDelete && { disableRipple: true })
        }
      : {};

  let deleteIcon = null;
  if (onDelete) {
    deleteIcon =
      deleteIconProp && React.isValidElement(deleteIconProp) ? (
        React.cloneElement(deleteIconProp, {
          className: clsx(deleteIconProp.props.className, classes.deleteIcon),
          onClick: handleDeleteIconClick
        })
      ) : (
        <CancelIcon className={clsx(classes.deleteIcon)} onClick={handleDeleteIconClick} />
      );
  }

  let avatar = null;
  if (avatarProp && React.isValidElement(avatarProp)) {
    avatar = React.cloneElement(avatarProp, {
      className: clsx(classes.avatar, avatarProp.props.className)
    });
  }

  let icon = null;
  if (iconProp && React.isValidElement(iconProp)) {
    icon = React.cloneElement(iconProp, {
      className: clsx(classes.icon, iconProp.props.className)
    });
  }

  if (!import.meta.env.PROD) {
    if (avatar && icon) {
      console.error(
        `The Chip component can not handle the avatar
        and the icon prop at the same time. Pick one.`
      );
    }
  }

  const ChipRootComponent = slots?.root ?? ChipRoot;
  const chipRootProps = useSlotProps({
    elementType: ChipRootComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      disabled: clickable && disabled ? true : undefined,
      onClick,
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp,
      ref: handleRef,
      tabIndex: !focusableWhenDisabled && disabled ? -1 : tabIndex,
      ...moreProps
    },
    ownerState,
    className: classes.root
  });

  return (
    <ChipRoot as={component} {...chipRootProps}>
      {avatar || icon}
      <ChipLabel className={clsx(classes.label)} ownerState={ownerState}>
        {label}
      </ChipLabel>
      {deleteIcon}
    </ChipRoot>
  );
});

Chip.displayName = 'Chip';

export default Chip;
