import React from 'react';
import styled from '@styles';
import { ButtonBase } from '@components/inputs';
import MoreHorizIcon from '@icons/MoreHoriz';

const BreadcrumbCollapsedButton = styled(ButtonBase)(({ theme }) => ({
  display: 'flex',
  marginLeft: `calc(${theme.spacing(1)} * 0.5)`,
  marginRight: `calc(${theme.spacing(1)} * 0.5)`,
  ...(theme.color.mode === 'light'
    ? { backgroundColor: theme.color.gray[100], color: theme.color.gray[900] }
    : { backgroundColor: theme.color.gray[900], color: theme.color.gray[100] }),
  borderRadius: 2,
  '&:hover, &:focus': {
    ...(theme.color.mode === 'light'
      ? { backgroundColor: theme.color.gray[200] }
      : { backgroundColor: theme.color.gray[800] })
  },
  '&:active': {
    boxShadow: theme.boxShadow[0],
    ...(theme.color.mode === 'light'
      ? { backgroundColor: theme.alpha.emphasize(theme.color.gray[200], 0.12) }
      : { backgroundColor: theme.alpha.emphasize(theme.color.gray[800], 0.12) })
  }
}));

const BreadcrumbCollapsedIcon = styled(MoreHorizIcon)({
  width: 24,
  height: 16
});

const BreadcrumbCollapsed = React.forwardRef((props, ref) => {
  const { slots = {}, slotProps = {}, ...otherProps } = props;
  const ownerState = props;

  return (
    <li ref={ref}>
      <BreadcrumbCollapsedButton
        className='Breadcrumb-CollapsedButton'
        {...otherProps}
        ownerState={ownerState}
      >
        <BreadcrumbCollapsedIcon
          as={slots.CollapsedIcon}
          ownerState={ownerState}
          {...slotProps.collapsedIcon}
        />
      </BreadcrumbCollapsedButton>
    </li>
  );
});

BreadcrumbCollapsed.displayName = 'BreadcrumbCollapsed';

export default BreadcrumbCollapsed;
