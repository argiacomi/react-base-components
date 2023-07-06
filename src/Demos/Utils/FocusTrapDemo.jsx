import { Box, FocusTrap } from '@components';
import { css } from 'styled-components/macro';
import React from 'react';

export default function FocusTrapDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <Box css={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <button type='button' onClick={() => setOpen(true)}>
        Open
      </button>
      {open && (
        <FocusTrap open>
          <Box tabIndex={-1} css={{ marginTop: '1rem', padding: '1rem' }}>
            <label>
              First name: <input type='text' />
            </label>
            <br />
            <button type='button' onClick={() => setOpen(false)}>
              Close
            </button>
          </Box>
        </FocusTrap>
      )}
    </Box>
  );
}
