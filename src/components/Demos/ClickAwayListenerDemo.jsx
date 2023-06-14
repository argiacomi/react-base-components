import React from 'react';
import { css, useTheme } from 'styled-components/macro'; //eslint-disable-line
import { Box, ClickAwayListener, Portal } from '@components';

export default function ClickAwayDemo() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  const styles = {
    position: 'absolute',
    top: 28,
    right: 0,
    left: 0,
    zIndex: 1,
    border: '1px solid',
    padding: 'rem',
    backgroundColor: theme.color.background
  };

  return (
    <ClickAwayListener eventTypes={['onMouseDown', 'onTouchStart']} onClickAway={handleClickAway}>
      <div>
        <button type='button' onClick={handleClick}>
          Open menu dropdown
        </button>
        {open ? (
          <Portal>
            <Box sx={styles}>Click me, I will stay visible until you click outside.</Box>
          </Portal>
        ) : null}
      </div>
    </ClickAwayListener>
  );
}
