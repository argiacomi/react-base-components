import styled from '@styles';

const NotchedOutlineRoot = styled('fieldset')({
  textAlign: 'left',
  position: 'absolute',
  bottom: 0,
  right: 0,
  top: -5,
  left: 0,
  margin: 0,
  padding: '0 8px',
  pointerEvents: 'none',
  borderRadius: 'inherit',
  borderStyle: 'solid',
  borderWidth: 1,
  overflow: 'hidden',
  minWidth: '0%'
});

const NotchedOutlineLegend = styled('legend')(({ ownerState, theme }) => ({
  float: 'unset',
  width: 'auto',
  overflow: 'hidden',
  ...(!ownerState.withLabel && {
    padding: 0,
    lineHeight: '11px',
    transition: theme.transition.create('width', {
      duration: 150,
      easing: theme.transition.easing.easeOut
    })
  }),
  ...(ownerState.withLabel && {
    display: 'block',
    padding: 0,
    height: 11,
    fontSize: '0.75em',
    visibility: 'hidden',
    maxWidth: 0.01,
    transition: theme.transition.create('max-width', {
      duration: 50,
      easing: theme.transition.easing.easeOut
    }),
    whiteSpace: 'nowrap',
    '& > span': {
      paddingLeft: 5,
      paddingRight: 5,
      display: 'inline-block',
      opacity: 0,
      visibility: 'visible'
    },
    ...(ownerState.notched && {
      maxWidth: '100%',
      transition: theme.transition.create('max-width', {
        duration: 100,
        easing: theme.transition.easing.easeOut,
        delay: 50
      })
    })
  })
}));

const NotchedOutline = (props) => {
  const { className, label, notched, ...other } = props;
  const withLabel = label != null && label !== '';
  const ownerState = {
    ...props,
    notched,
    withLabel
  };

  return (
    <NotchedOutlineRoot aria-hidden className={className} ownerState={ownerState} {...other}>
      <NotchedOutlineLegend ownerState={ownerState}>
        {withLabel ? <span>{label}</span> : <span className='notranslate'>&#8203;</span>}
      </NotchedOutlineLegend>
    </NotchedOutlineRoot>
  );
};

NotchedOutline.displayName = 'NotchedOutline';

export default NotchedOutline;
