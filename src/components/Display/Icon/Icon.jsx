import React from 'react';
import * as FiIcons from 'react-icons/fi';
import * as IoIcons from 'react-icons/io5';
import * as MdIcons from 'react-icons/md';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';

export const iconClasses = {
  root: 'Icon-Root'
};

const sizeMapping = {
  inherit: 'inherit',
  mini: 'sm',
  small: 'xl',
  medium: '2xl',
  large: '4xl',
  jumob: '5xl'
};

const iconLibraries = {
  Fi: FiIcons,
  Io: IoIcons,
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

const IconRoot = styled('span')(({ theme, ownerState }) => {
  const size = ownerState.fontSize || ownerState.size;
  let fontSize;
  if (typeof size === 'string') {
    const sizeStyle = theme.text.size[sizeMapping[size]] || {};
    fontSize = sizeStyle.fontSize || size;
  } else if (typeof size === 'number') {
    fontSize = theme.pxToRem(size);
  }

  return {
    userSelect: 'none',
    width: '1em',
    height: '1em',
    display: 'inline-block',
    fill: ownerState.isSvgElement ? undefined : 'currentColor',
    flexShrink: 0,
    transition: theme.transition.create('fill', {
      duration: theme.transition.duration.shorter
    }),
    fontSize: fontSize,
    color:
      theme.color[ownerState.color]?.body ??
      {
        action: theme.color.active,
        disabled: theme.color.disabled.text,
        inherit: undefined
      }[ownerState.color],
    ...ownerState.cssStyles
  };
});

const Icon = React.forwardRef((props, ref) => {
  const {
    children,
    color = 'inherit',
    size = 'medium',
    htmlColor,
    icon: iconProp,
    slots = {},
    slotProps = {},
    titleAccess,
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const Icon = iconLibraries.find(iconProp);

  const isSvgElement = Icon().props.children.every((currentValue) =>
    ['svg', 'circle', 'path', 'line', 'polygon', 'polyline', 'rect', 'ellipse'].includes(
      currentValue.type
    )
  );

  const ownerState = {
    ...props,
    cssStyles,
    color,
    isSvgElement,
    size
  };

  const component = Icon || 'span';
  const IconComponent = slots.root || IconRoot;

  const iconRootProps = useSlotProps({
    elementType: IconComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      'data-testid': iconProp,
      focusable: 'false',
      fill: htmlColor,
      'aria-hidden': titleAccess ? undefined : true,
      ref: ref,
      role: titleAccess ? 'img' : undefined
    },
    ownerState,
    className: iconClasses.root
  });

  return (
    <IconComponent as={component} {...iconRootProps}>
      {children}
    </IconComponent>
  );
});

Icon.displayName = 'Icon';

export default Icon;
