import { forwardRef } from 'react';
import clsx from 'clsx';
import styled from 'styled-components/macro';
import { Paper } from '@components';

const ToolbarRoot = styled(Paper)(
  ({ theme, ownerState }) => ({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    ...(!ownerState.disableGutters && {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3)
      }
    }),
    ...(ownerState.variant === 'dense' && {
      minHeight: 48
    })
  }),
  ({ theme, ownerState }) =>
    ownerState.variant === 'regular' && {
      minHeight: theme.spacing(8),
      [theme.breakpoints.up('xs')]: {
        '@media (orientation: landscape)': {
          minHeight: theme.spacing(6)
        }
      },
      [theme.breakpoints.up('sm')]: {
        minHeight: theme.spacing(8)
      }
    }
);

const Toolbar = forwardRef(function Toolbar(props, ref) {
  const {
    className,
    component = 'div',
    disableGutters = false,
    variant = 'regular',
    ...other
  } = props;

  const ownerState = {
    ...props,
    component,
    disableGutters,
    variant
  };

  return (
    <ToolbarRoot
      as={component}
      className={clsx('Toolbar-Root', className)}
      ownerState={ownerState}
      ref={ref}
      {...other}
    />
  );
});

Toolbar.displayName = 'Toolbar';

export default Toolbar;
