import { forwardRef } from 'react';
import clsx from 'clsx';
import { styled } from '@styles';
import { Paper } from '@components';

const AppBarRoot = styled(Paper)(({ theme, ownerState }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  boxSizing: 'border-box',
  flexShrink: 0,
  borderRadius: 0,
  ...{
    fixed: {
      position: 'fixed',
      zIndex: '100 ',
      top: 0,
      left: 'auto',
      right: 0,
      '@media print': {
        position: 'absolute'
      }
    },
    absolute: {
      position: 'absolute',
      zIndex: '100 ',
      top: 0,
      right: 0,
      left: 'auto'
    },
    sticky: {
      position: 'sticky',
      zIndex: '100 ',
      top: 0,
      right: 0,
      left: 'auto'
    },
    relative: {
      position: 'relative'
    },
    static: {
      position: 'static'
    }
  }[ownerState.position],
  color: theme.color.text.primary,
  backgroundColor: theme.color[ownerState.color]
    ? theme.color[ownerState.color][500]
    : theme.color.gray[500],
  ...(ownerState.color === 'inherit' && {
    color: 'inherit',
    backgroundColor: 'inherit'
  }),
  ...(ownerState.color === 'transparent' && {
    color: 'inherit',
    backgroundColor: 'transparent'
  }),
  ...(ownerState.color === 'monochrome' && {
    border: `1px solid ${theme.color.mode === 'dark' ? theme.color.white : theme.color.black}`
  })
}));

const AppBar = forwardRef((props, ref) => {
  const { className, color = 'primary', position = 'fixed', ...other } = props;

  // Paper props
  const {
    component = 'header',
    elevation = ['default', 'inherit', 'monochrome'].includes(color) ? 0 : 4,
    square = true
  } = props;

  const ownerState = {
    ...props,
    component,
    elevation,
    square,
    color,
    position
  };

  return (
    <AppBarRoot
      className={clsx('AppBar-Root', className)}
      ownerState={ownerState}
      ref={ref}
      {...other}
    />
  );
});
AppBar.displayName = 'AppBar';

export default AppBar;
