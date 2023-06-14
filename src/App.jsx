import { css } from 'styled-components/macro'; //eslint-disable-line
import {
  Box,
  // AlertDemo,
  // AvatarDemo,
  // BackdropDemo,
  // BadgeDemo,
  // BreadcrumbsDemo,
  // ButtonDemo,
  // ButtonGroupDemo,
  // CardDemo,
  // ChipDemo,
  // ClickAwayListenerDemo,
  DrawerDemo
  // FocusTrapDemo,
  // FormControlDemo,
  // ListDemo,
  // ModalDemo,
  // PopoverDemo,
  // PopperDemo,
  // SnackbarDemo,
  // TooltipDemo,
} from '@components';

const App = () => {
  return (
    <Box css={{ margin: '3rem', height: 2000 }}>
      <DrawerDemo />
    </Box>
  );
};

export default App;
