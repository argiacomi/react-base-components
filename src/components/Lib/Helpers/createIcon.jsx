import React from 'react';
import Icon from '@components/display/icon';

export default function createIcon(displayName) {
  function Component(props, ref) {
    return (
      <Icon
        icon={`${displayName}`}
        data-testid={`${displayName.replace('Md', '')}Icon`}
        ref={ref}
        {...props}
      ></Icon>
    );
  }

  if (!import.meta.env.PROD) {
    Component.displayName = `${displayName.replace('Md', '')}Icon`;
  }

  Component.displayName = Icon.displayName;

  return React.memo(React.forwardRef(Component));
}
