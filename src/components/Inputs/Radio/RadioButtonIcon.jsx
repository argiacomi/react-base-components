import styled from '@styles';
import RadioButtonCheckedIcon from '@icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@icons/RadioButtonUnchecked';

const RadioButtonIconRoot = styled('span')({
  position: 'relative',
  display: 'flex'
});

const RadioButtonIconBackground = styled(RadioButtonUncheckedIcon)({
  transform: 'scale(1)'
});

const RadioButtonIconDot = styled(RadioButtonCheckedIcon)(({ theme, ownerState }) => ({
  left: 0,
  position: 'absolute',
  transform: 'scale(0)',
  transition: theme.transition.create('transform', {
    easing: theme.transition.easing.easeIn,
    duration: theme.transition.duration.shortest
  }),
  ...(ownerState.checked && {
    transform: 'scale(1)',
    transition: theme.transition.create('transform', {
      easing: theme.transition.easing.easeOut,
      duration: theme.transition.duration.shortest
    })
  })
}));

const RadioButtonIcon = (props) => {
  const { checked = false, classes = {}, size } = props;

  const ownerState = { ...props, checked };

  return (
    <RadioButtonIconRoot className={classes.root} ownerState={ownerState}>
      <RadioButtonIconBackground
        size={size}
        className={classes.background}
        ownerState={ownerState}
      />
      <RadioButtonIconDot size={size} className={classes.dot} ownerState={ownerState} />
    </RadioButtonIconRoot>
  );
};

RadioButtonIcon.displayName = 'RadioButtonIcon';

export default RadioButtonIcon;
