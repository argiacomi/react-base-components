import * as React from 'react';
import { css, useTheme } from 'styled-components/macro'; //eslint-disable-line
import { Box, ClickAwayListener, IGNORE_CLASS_NAME } from '@components';

export default function ClickAway() {
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
    <>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Box component='span' css={{ position: 'relative', backgroundColor: 'white' }}>
          <button type='button' onClick={handleClick}>
            Open menu dropdown
          </button>
          {open ? (
            <Box css={styles}>Click me, I will stay visible until you click outside.</Box>
          ) : null}
        </Box>
      </ClickAwayListener>
      <Box
        className={IGNORE_CLASS_NAME}
        css={{ width: '100px', height: '100px', backgroundColor: 'red' }}
      ></Box>
    </>
  );
}
