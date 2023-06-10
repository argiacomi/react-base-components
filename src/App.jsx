import { css } from 'styled-components/macro';
import {
  AlertDemo,
  AvatarDemo,
  BadgeDemo,
  ButtonDemo,
  ButtonGroupDemo,
  ChipDemo,
  ClickAwayListenerDemo,
  PopperDemo
} from '@components';

const App = () => {
  return (
    <div css={{ margin: '1rem' }}>
      <ClickAwayListenerDemo />
    </div>
  );
};

export default App;
