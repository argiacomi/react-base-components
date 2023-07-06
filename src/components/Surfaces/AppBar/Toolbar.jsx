import { forwardRef } from 'react';
import clsx from 'clsx';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';

export const toolbarClasses = {
  root: 'Toolbar-Root',
  regular: 'Regular',
  dense: 'Dense',
  disableGutters: 'DisableGutters'
};

const ToolbarRoot = styled('div')(
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
      minHeight: 56,
      [theme.breakpoints.up('xs')]: {
        '@media (orientation: landscape)': {
          minHeight: 48
        }
      },
      [theme.breakpoints.up('sm')]: {
        minHeight: 64
      }
    },
  ({ ownerState }) => ownerState.cssStyles
);

const Toolbar = forwardRef((props, ref) => {
  const {
    component: componentProp = 'div',
    disableGutters = false,
    slots = {},
    slotProps = {},
    variant = 'regular',
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = {
    ...props,
    cssStyles,
    disableGutters,
    variant
  };

  const classes = {
    root: [
      toolbarClasses.root,
      !ownerState.disableGutters && toolbarClasses.gutters,
      toolbarClasses[ownerState.variant]
    ]
  };

  const component = componentProp || 'div';

  const ToolbarComponent = slots.root || ToolbarRoot;
  const toolbarRootProps = useSlotProps({
    elementType: ToolbarComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: ref
    },
    ownerState,
    className: classes.root
  });

  return <ToolbarComponent as={component} {...toolbarRootProps} />;
});

Toolbar.displayName = 'Toolbar';

export default Toolbar;
