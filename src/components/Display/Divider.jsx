import * as React from 'react';
import clsx from 'clsx';
import styled from 'styled-components/macro';

const DividerRoot = styled('div')(
  ({ theme, ownerState }) => ({
    margin: 0,
    flexShrink: 0,
    borderWidth: 0,
    borderStyle: 'solid',
    borderColor: theme.color.divider,
    borderBottomWidth: 'thin',
    ...(ownerState.absolute && {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%'
    }),
    ...(ownerState.variant === 'inset' && {
      marginLeft: '4.5rem'
    }),
    ...(ownerState.variant === 'middle' &&
      ownerState.orientation === 'horizontal' && {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2)
      }),
    ...(ownerState.variant === 'middle' &&
      ownerState.orientation === 'vertical' && {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
      }),
    ...(ownerState.orientation === 'vertical' && {
      height: '100%',
      borderBottomWidth: 0,
      borderRightWidth: 'thin'
    }),
    ...(ownerState.flexItem && {
      alignSelf: 'stretch',
      height: 'auto'
    })
  }),
  ({ ownerState }) => ({
    ...(ownerState.children && {
      display: 'flex',
      whiteSpace: 'nowrap',
      textAlign: 'center',
      border: 0,
      '&::before, &::after': {
        content: '""',
        alignSelf: 'center'
      }
    })
  }),
  ({ theme, ownerState }) => ({
    ...(ownerState.children &&
      ownerState.orientation !== 'vertical' && {
        '&::before, &::after': {
          position: 'relative',
          width: '100%',
          height: 0,
          borderTop: `thin solid ${theme.color.divider}`
        }
      })
  }),
  ({ theme, ownerState }) => ({
    ...(ownerState.children &&
      ownerState.orientation === 'vertical' && {
        flexDirection: 'column',
        '&::before, &::after': {
          position: 'static',
          width: 0,
          height: '100%',
          borderLeft: `thin solid ${theme.color.divider}`
        }
      })
  }),
  ({ ownerState }) => ({
    ...(ownerState.orientation !== 'vertical' &&
      {
        right: {
          '&::before': {
            width: '90%'
          },
          '&::after': {
            width: '10%'
          }
        },
        left: {
          '&::before': {
            width: '10%'
          },
          '&::after': {
            width: '90%'
          }
        }
      }[ownerState.textAlign])
  })
);

const DividerWrapper = styled('span')(({ theme, ownerState }) => ({
  display: 'inline-block',
  paddingLeft: theme.spacing(1.2),
  paddingRight: theme.spacing(1.2),
  ...(ownerState.orientation === 'vertical' && {
    paddingTop: theme.spacing(1.2),
    paddingBottom: theme.spacing(1.2)
  })
}));

const Divider = React.forwardRef((props, ref) => {
  const {
    absolute = false,
    children,
    className,
    component = children ? 'div' : 'hr',
    flexItem = false,
    orientation = 'horizontal',
    role = component !== 'hr' ? 'separator' : undefined,
    textAlign = 'center',
    variant = 'fullWidth',
    ...other
  } = props;

  const ownerState = {
    ...props,
    absolute,
    component,
    flexItem,
    orientation,
    role,
    textAlign,
    variant
  };

  return (
    <DividerRoot
      as={component}
      className={clsx('Divider-Root', className)}
      ownerState={ownerState}
      role={role}
      ref={ref}
      {...other}
    >
      {children ? (
        <DividerWrapper className='Divider-Wrapper' ownerState={ownerState}>
          {children}
        </DividerWrapper>
      ) : null}
    </DividerRoot>
  );
});
Divider.displayName = 'Divider';

export default Divider;
