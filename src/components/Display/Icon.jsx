import * as React from 'react';
import clsx from 'clsx';
import styled from 'styled-components/macro';
import * as FiIcons from 'react-icons/fi';
import * as MdIcons from 'react-icons/md';

const sizeMapping = {
  inherit: 'inherit',
  small: 'xl',
  medium: '2xl',
  large: '4xl'
};

const iconLibraries = {
  Fi: FiIcons,
  Md: MdIcons,
  find: (iconProp) => {
    for (const prefix in iconLibraries) {
      if (iconProp.includes(prefix)) {
        const IconComponent = iconLibraries[prefix][iconProp];
        if (IconComponent !== undefined) {
          return IconComponent;
        }
      }
    }
    console.error(`Icon ${iconProp} not found in installed libraries.`);
    return () => null;
  }
};

const IconRoot = styled('span')(({ theme, $ownerState }) => {
  let fontSize, lineHeight;
  if (typeof $ownerState.size === 'string') {
    const sizeStyle = theme.text.size[sizeMapping[$ownerState.size]] || {};
    fontSize = sizeStyle.fontSize || $ownerState.size;
    lineHeight = sizeStyle.lineHeight || 'normal';
  } else {
    fontSize = `${$ownerState.size}rem`;
    lineHeight = 'normal';
  }

  const fillColor = ['inherit', 'white'].includes($ownerState.color)
    ? $ownerState.color === 'inherit'
      ? 'currentColor'
      : theme.color.white
    : theme.color[$ownerState.color][500];

  return {
    userSelect: 'none',
    width: '1em',
    height: '1em',
    overflow: 'hidden',
    display: 'inline-block',
    textAlign: 'center',
    flexShrink: 0,
    transition: theme.transition.create(['fill', 'color'], {
      duration: theme.transition.duration.shortest,
      easing: theme.transition.easing.easeInOut
    }),
    fill: fillColor,
    fontSize: fontSize,
    lineHeight: lineHeight
  };
});

const Icon = React.forwardRef((props, ref) => {
  const {
    children,
    className,
    color = 'inherit',
    size = 'medium',
    htmlColor,
    icon: iconProp,
    titleAccess,
    ...other
  } = props;

  const IconComponent = iconLibraries.find(iconProp);

  const ownerState = {
    ...props,
    color,
    size
  };

  return (
    <IconRoot
      as={IconComponent}
      className={clsx('Icon-Root', className)}
      $ownerState={ownerState}
      data-testid={iconProp}
      focusable='false'
      fill={htmlColor}
      aria-hidden={titleAccess ? undefined : true}
      role={titleAccess ? 'img' : undefined}
      ref={ref}
      {...other}
    >
      {children}
    </IconRoot>
  );
});

Icon.displayName = 'Icon';

export default Icon;
