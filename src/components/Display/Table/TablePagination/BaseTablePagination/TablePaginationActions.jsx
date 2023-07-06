import React from 'react';
import { useSlotProps } from '@components/lib';

function LastPageIconDefault() {
  return <span>{'⇾|'}</span>;
}
function FirstPageIconDefault() {
  return <span>{'|⇽'}</span>;
}
function NextPageIconDefault() {
  return <span>{'⇾'}</span>;
}
function BackPageIconDefault() {
  return <span>{'⇽'}</span>;
}

function defaultGetAriaLabel(type) {
  return `Go to ${type} page`;
}

const TablePaginationActions = React.forwardRef((props, ref) => {
  const {
    count,
    getItemAriaLabel = defaultGetAriaLabel,
    onPageChange,
    page,
    rowsPerPage,
    showFirstButton = false,
    showLastButton = false,
    direction,
    ownerState: ownerStateProp,
    slotProps = {},
    slots = {},
    ...other
  } = props;

  const ownerState = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  const Root = slots.root ?? 'div';
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: { ref: ref },
    ownerState
  });

  const FirstButton = slots.firstButton ?? 'button';
  const firstButtonProps = useSlotProps({
    elementType: FirstButton,
    externalSlotProps: slotProps.firstButton,
    additionalProps: {
      onClick: handleFirstPageButtonClick,
      disabled: page === 0,
      'aria-label': getItemAriaLabel('first', page),
      title: getItemAriaLabel('first', page)
    },
    ownerState
  });

  const LastButton = slots.lastButton ?? 'button';
  const lastButtonProps = useSlotProps({
    elementType: LastButton,
    externalSlotProps: slotProps.lastButton,
    additionalProps: {
      onClick: handleLastPageButtonClick,
      disabled: page >= Math.ceil(count / rowsPerPage) - 1,
      'aria-label': getItemAriaLabel('last', page),
      title: getItemAriaLabel('last', page)
    },
    ownerState
  });

  const NextButton = slots.nextButton ?? 'button';
  const nextButtonProps = useSlotProps({
    elementType: NextButton,
    externalSlotProps: slotProps.nextButton,
    additionalProps: {
      onClick: handleNextButtonClick,
      disabled: count !== -1 ? page >= Math.ceil(count / rowsPerPage) - 1 : false,
      'aria-label': getItemAriaLabel('next', page),
      title: getItemAriaLabel('next', page)
    },
    ownerState
  });

  const BackButton = slots.backButton ?? 'button';
  const backButtonProps = useSlotProps({
    elementType: BackButton,
    externalSlotProps: slotProps.backButton,
    additionalProps: {
      onClick: handleBackButtonClick,
      disabled: page === 0,
      'aria-label': getItemAriaLabel('previous', page),
      title: getItemAriaLabel('previous', page)
    },
    ownerState
  });

  const LastPageIcon = slots.lastPageIcon ?? LastPageIconDefault;
  const FirstPageIcon = slots.firstPageIcon ?? FirstPageIconDefault;
  const NextPageIcon = slots.nextPageIcon ?? NextPageIconDefault;
  const BackPageIcon = slots.backPageIcon ?? BackPageIconDefault;

  return (
    <Root {...rootProps}>
      {showFirstButton && (
        <FirstButton {...firstButtonProps}>
          {direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </FirstButton>
      )}
      <BackButton {...backButtonProps}>
        {direction === 'rtl' ? <NextPageIcon /> : <BackPageIcon />}
      </BackButton>
      <NextButton {...nextButtonProps}>
        {direction === 'rtl' ? <BackPageIcon /> : <NextPageIcon />}
      </NextButton>
      {showLastButton && (
        <LastButton {...lastButtonProps}>
          {direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </LastButton>
      )}
    </Root>
  );
});

TablePaginationActions.displayName = 'TablePaginationActions';

export default TablePaginationActions;
