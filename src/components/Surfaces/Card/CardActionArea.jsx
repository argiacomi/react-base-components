import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@styles';
import { ButtonBase } from '@components/inputs';

const cardActionAreaClasses = {
  root: 'CardActionArea-Root',
  focusVisible: 'focusVisible',
  focusHighlight: 'focusHighlight'
};

const CardActionAreaRoot = styled(ButtonBase)({
  display: 'block',
  textAlign: 'inherit',
  borderRadius: 'inherit',
  width: '100%',
  [`&:hover .${cardActionAreaClasses.focusHighlight}`]: {
    opacity: 0.04,
    '@media (hover: none)': {
      opacity: 0
    }
  },
  [`&.${cardActionAreaClasses.focusVisible} .${cardActionAreaClasses.focusHighlight}`]: {
    opacity: 0.12
  }
});

const CardActionAreaFocusHighlight = styled('span')(({ theme }) => ({
  overflow: 'hidden',
  pointerEvents: 'none',
  position: 'absolute',
  inset: 0,
  borderRadius: 'inherit',
  opacity: 0,
  backgroundColor: 'currentcolor',
  transition: theme.transition.create('opacity', {
    duration: theme.transition.duration.short
  })
}));

const CardActionArea = React.forwardRef((props, ref) => {
  const { children, className, focusVisibleClassName, ...other } = props;

  const ownerState = props;

  return (
    <CardActionAreaRoot
      className={clsx(cardActionAreaClasses.root, className)}
      focusVisibleClassName={clsx(focusVisibleClassName, cardActionAreaClasses.focusVisible)}
      ref={ref}
      ownerState={ownerState}
      {...other}
    >
      {children}
      <CardActionAreaFocusHighlight
        className={cardActionAreaClasses.focusHighlight}
        ownerState={ownerState}
      />
    </CardActionAreaRoot>
  );
});

CardActionArea.displayName = 'CardActionArea';

export default CardActionArea;
