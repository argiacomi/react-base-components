import { css } from 'styled-components/macro'; //eslint-disable-line
import {
  Box,
  // AlertDemo,
  // AvatarDemo,
  // BadgeDemo,
  // ButtonDemo,
  // ButtonGroupDemo,
  // ChipDemo,
  // PopperDemo,
  // ClickAwayListenerDemo,
  FocusTrapDemo
} from '@components';

const App = () => {
  return (
    <Box css={{ margin: '1rem' }}>
      <FocusTrapDemo />
    </Box>
  );
};

export default App;
