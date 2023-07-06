import React from 'react';
import styled from '@styles';
import { useSlotProps } from '@components/lib';
import ButtonBase from '@components/inputs/Button/ButtonBase';
import KeyboardArrowLeft from '@icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@icons/KeyboardArrowRight';

const tabScrollButtonClasses = {
  root: 'TabScrollButton-Root',
  vertical: 'Vertical',
  disabled: 'Disabled'
};
const TabScrollButtonRoot = styled(ButtonBase)(({ theme, ownerState }) => ({
  width: 40,
  flexShrink: 0,
  opacity: 0.8,
  [`&.${tabScrollButtonClasses.disabled}`]: {
    color: theme.color.disabled.body
  },
  ...(ownerState.orientation === 'vertical' && {
    width: '100%',
    height: 40,
    '& svg': {
      transform: `rotate(${ownerState.isRtl ? -90 : 90}deg)`
    }
  })
}));

const TabScrollButton = React.forwardRef((props, ref) => {
  const {
    component = 'button',
    slots = {},
    slotProps = {},
    direction,
    isRtl,
    orientation,
    disabled,
    ...other
  } = props;

  const ownerState = { isRtl, orientation, disabled, ...props };

  const classes = {
    root: [
      tabScrollButtonClasses.root,
      ownerState.disabled && tabScrollButtonClasses.disabled,
      ownerState.orientation === 'vertical' && tabScrollButtonClasses.vertical
    ]
  };

  const StartButtonIcon = slots.StartScrollButtonIcon ?? KeyboardArrowLeft;
  const EndButtonIcon = slots.EndScrollButtonIcon ?? KeyboardArrowRight;

  const startButtonIconProps = useSlotProps({
    elementType: StartButtonIcon,
    externalSlotProps: slotProps.startScrollButtonIcon,
    additionalProps: {
      fontSize: 'small'
    },
    ownerState
  });

  const endButtonIconProps = useSlotProps({
    elementType: EndButtonIcon,
    externalSlotProps: slotProps.endScrollButtonIcon,
    additionalProps: {
      fontSize: 'small'
    },
    ownerState
  });

  const TabScrollButton = slots.scrollButtonRoot ?? TabScrollButtonRoot;
  const tabScrollButtonRootProps = useSlotProps({
    elementType: TabScrollButton,
    externalSlotProps: slotProps.endScrollButtonIcon,
    externalForwardedProps: other,
    additionalProps: {
      component: 'div',
      disabled: disabled,
      fontSize: 'small',
      ref: ref,
      role: null,
      tabIndex: null
    },
    ownerState,
    className: classes.root
  });

  return (
    <TabScrollButton component={component} {...tabScrollButtonRootProps}>
      {direction === 'left' ? (
        <StartButtonIcon {...startButtonIconProps} />
      ) : (
        <EndButtonIcon {...endButtonIconProps} />
      )}
    </TabScrollButton>
  );
});

TabScrollButton.displayName = 'TabScrollButton';

export default TabScrollButton;
