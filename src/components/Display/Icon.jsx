import * as React from 'react';
import tw from 'twin.macro';
import { durations } from '@components/lib';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';

const iconLibraries = {
  Fa: FaIcons,
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

const fontSizeStyle = {
  inherit: tw`text-inherit`,
  small: tw`text-xl`,
  medium: tw`text-2xl`,
  large: tw`text-4xl`,
  default: tw`text-xl`
};

const Icon = React.forwardRef(
  (
    {
      children,
      className,
      fontSize = 'medium',
      htmlColor,
      icon: iconProp,
      titleAccess,
      viewBox,
      ...other
    },
    ref
  ) => {
    const IconComponent = iconLibraries.find(iconProp);
    const baseStyle = tw`select-none w-[1em] h-[1em] inline-block fill-current shrink-0 text-inherit transition-colors`;
    const durationStyle = { transitionDuration: `${durations.shorter}ms` };
    const iconStyles = [
      baseStyle,
      fontSizeStyle[fontSize] || {
        fontSize: typeof fontSize === 'string' ? fontSize : `${fontSize}px`
      },
      durationStyle
    ].filter(Boolean);
    const more = viewBox ? viewBox : {};

    return (
      <IconComponent
        className={className}
        css={iconStyles}
        data-testid={iconProp}
        focusable='false'
        fill={htmlColor}
        aria-hidden={titleAccess ? undefined : true}
        role={titleAccess ? 'img' : undefined}
        ref={ref}
        {...more}
        {...other}
      />
    );
  }
);

Icon.displayName = 'Icon';

export default Icon;
