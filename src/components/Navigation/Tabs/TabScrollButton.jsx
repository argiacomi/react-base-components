import * as React from 'react';
import clsx from 'clsx';
import styled, { useTheme } from '@styles';
import { ButtonBase } from '@components/inputs';
import { Icon } from '@components/display';
import { useSlotProps } from '@components/lib';

const tabScrollButtonClasses = {
  root: 'TabScrollButton-Root',
  vertical: 'TabScrollButton-Vertical',
  disabled: 'TabScrollButton-Disabled'
};
const TabScrollButtonRoot = styled(ButtonBase)(({ ownerState }) => ({
  width: 40,
  flexShrink: 0,
  opacity: 0.8,
  [`&.${tabScrollButtonClasses.disabled}`]: {
    opacity: 0
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
    className,
    slots = {},
    slotProps = {},
    direction,
    orientation,
    disabled,
    ...other
  } = props;

  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';

  const ownerState = { isRtl, ...props };

  const classes = {
    root: [
      tabScrollButtonClasses.root,
      ownerState.disabled && tabScrollButtonClasses.disabled,
      ownerState.orientation === 'vertical' && tabScrollButtonClasses.vertical
    ]
  };

  const StartButtonIcon =
    slots.StartScrollButtonIcon ?? (() => <Icon icon='MdKeyboardArrowLeft' />);

  const EndButtonIcon = slots.EndScrollButtonIcon ?? (() => <Icon icon='MdKeyboardArrowRight' />);

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

  return (
    <TabScrollButtonRoot
      component='div'
      className={clsx(classes.root, className)}
      ref={ref}
      role={null}
      ownerState={ownerState}
      tabIndex={null}
      {...other}
    >
      {direction === 'left' ? (
        <StartButtonIcon {...startButtonIconProps} />
      ) : (
        <EndButtonIcon {...endButtonIconProps} />
      )}
    </TabScrollButtonRoot>
  );
});

TabScrollButton.displayName = 'TabScrollButton';

export default TabScrollButton;
