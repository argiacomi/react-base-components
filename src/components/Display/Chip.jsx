import React from 'react';
import clsx from 'clsx';
import { styled } from '@styles';
import { useForkRef } from '@component/hooks';
import { ButtonBase } from '@components/inputs';
import Icon from '@components/Display/Icon';

export const chipClasses = {
  root: 'Chip-Root',
  avatar: 'Chip-Avatar',
  deleteIcon: 'Chip-DeleteIcon',
  icon: 'Chip-Icon',
  label: 'Chip-Label',
  clickable: 'Chip-Clickable',
  deletable: 'Chip-Deletable',
  disabled: 'Chip-Disabled',
  filled: 'Chip-Filled',
  focusVisible: 'Chip-FocusVisible',
  outlined: 'Chip-Outlined',
  avatarColor: {
    Primary: 'Chip-AvatarColorPrimary',
    Secondary: 'Chip-AvatarColorSecondary'
  }
};

const outlinedStyles = (theme, ownerState) => ({
  backgroundColor: 'transparent',
  color: theme.color[ownerState.color].body,
  border: `1px solid ${theme.alpha.add(theme.color[ownerState.color].body, 0.7)}`,
  [`&.${chipClasses.clickable}:hover`]: {
    backgroundColor: theme.alpha.add(
      theme.color[ownerState.color].body,
      theme.color.mode === 'light' ? 0.2 : 0.15
    )
  },
  [`&.${chipClasses.focusVisible}`]: {
    backgroundColor: theme.alpha.add(theme.color[ownerState.color].body, 0.12)
  },
  [`& .${chipClasses.deleteIcon}`]: {
    color: theme.alpha.add(theme.color[ownerState.color].body, 0.7),
    marginRight: {
      small: theme.spacing(3 / 8),
      medium: theme.spacing(5 / 8)
    }[ownerState.size],
    '&:hover, &:active': {
      color: theme.color[ownerState.color].body
    }
  },
  [`& .${chipClasses.avatar}, & .${chipClasses.icon}`]: {
    small: { marginLeft: theme.spacing(2 / 8) },
    medium: { marginLeft: theme.spacing(4 / 8) }
  }[ownerState.size]
});

const avatarStyles = (theme, ownerState) => ({
  [`& .${chipClasses.avatar}`]: {
    size: {
      marginLeft: theme.spacing(4 / 8),
      marginRight: theme.spacing(-4 / 8),
      width: theme.spacing(18 / 8),
      height: theme.spacing(18 / 8),
      fontSize: theme.spacing(10 / 8)
    },
    medium: {
      marginLeft: theme.spacing(5 / 8),
      marginRight: theme.spacing(-6 / 8),
      width: theme.spacing(3),
      height: theme.spacing(3),
      color: theme.color.text.secondary,
      fontSize: theme.spacing(12 / 8)
    }
  }[ownerState.size],
  //TODO: Simplify this
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
    marginLeft: theme.spacing(5 / 8),
    marginRight: theme.spacing(-6 / 8),
    ...(ownerState.size === 'small' && {
      fontSize: theme.spacing(18 / 8),
      marginLeft: theme.spacing(4 / 8),
      marginRight: theme.spacing(-4 / 8)
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
    fontSize: theme.spacing(22 / 8),
    cursor: 'pointer',
    margin: `0 ${theme.spacing(5 / 8)} 0 ${theme.spacing(-6 / 8)}`,
    '&:hover': {
      color: theme.alpha.add(theme.color.text.primary, 0.4)
    },
    ...(ownerState.size === 'small' && {
      fontSize: theme.spacing(16 / 8),
      marginRight: theme.spacing(4 / 8),
      marginLeft: theme.spacing(-4 / 8)
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
      fontSize: theme.spacing(13 / 8),
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: ownerState.size === 'small' ? theme.spacing(3) : theme.spacing(4),
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
        opacity: 0.38,
        pointerEvents: 'none'
      },
      ...avatarStyles(theme, ownerState),
      ...iconStyles(theme, ownerState),
      ...(ownerState.onDelete && onDeleteStyles(theme, ownerState))
    };
  },
  ({ theme, ownerState }) => ownerState.clickable && clickableStyles(theme, ownerState),
  ({ theme, ownerState }) => ownerState.variant === 'outlined' && outlinedStyles(theme, ownerState)
);

const ChipLabel = styled('span')(({ theme, ownerState }) => ({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  paddingLeft: ownerState.size === 'small' ? theme.spacing(1) : theme.spacing(1.5),
  paddingRight: ownerState.size === 'small' ? theme.spacing(1) : theme.spacing(1.5),
  whiteSpace: 'nowrap'
}));

function isDeleteKeyboardEvent(keyboardEvent) {
  return keyboardEvent.key === 'Backspace' || keyboardEvent.key === 'Delete';
}

const Chip = React.forwardRef((props, ref) => {
  const {
    avatar: avatarProp,
    className,
    clickable: clickableProp,
    color = 'default',
    component: ComponentProp,
    deleteIcon: deleteIconProp,
    disabled = false,
    icon: iconProp,
    label,
    onClick,
    onDelete,
    onKeyDown,
    onKeyUp,
    size = 'medium',
    variant = 'filled',
    tabIndex,
    focusableWhenDisabled = false, // TODO v6: Rename to `focusableWhenDisabled`.
    ...other
  } = props;

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

  const component = clickable || onDelete ? ButtonBase : ComponentProp || 'div';

  const ownerState = {
    ...props,
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
    avatar: clsx(chipClasses.avatar, chipClasses.avatarColor[ownerState.color]),
    deleteIcon: chipClasses.deleteIcon,
    icon: chipClasses.icon,
    label: chipClasses.label,
    focusVisible: chipClasses.focusVisible
  };

  const moreProps =
    component === ButtonBase
      ? {
          component: ComponentProp || 'div',
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
        <Icon
          icon={deleteIconProp || 'MdCancel'}
          className={clsx(classes.deleteIcon)}
          onClick={handleDeleteIconClick}
        />
      );
  }

  let avatar = null;
  if (avatarProp && React.isValidElement(avatarProp)) {
    avatar = React.cloneElement(avatarProp, {
      className: clsx(classes.avatar, avatarProp.props.className)
    });
  }

  let icon = null;
  if (iconProp) {
    icon =
      iconProp && React.isValidElement(iconProp) ? (
        React.cloneElement(iconProp, {
          className: clsx(classes.icon, iconProp.props.className)
        })
      ) : (
        <Icon icon={iconProp} className={clsx(classes.icon)} onClick={handleDeleteIconClick} />
      );
  }

  if (!import.meta.env.PROD) {
    if (avatar && icon) {
      console.error(
        `The Chip component can not handle the avatar
        and the icon prop at the same time. Pick one.`
      );
    }
  }

  return (
    <ChipRoot
      as={component}
      className={clsx(classes.root, className)}
      disabled={clickable && disabled ? true : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      ref={handleRef}
      tabIndex={!focusableWhenDisabled && disabled ? -1 : tabIndex}
      ownerState={ownerState}
      {...moreProps}
      {...other}
    >
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
