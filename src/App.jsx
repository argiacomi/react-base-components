import { css } from 'styled-components/macro';
import {
  AlertDemo,
  AvatarDemo,
  BadgeDemo,
  ButtonDemo,
  ButtonGroupDemo,
  PopperDemo
} from '@components';

const App = () => {
  return (
    <div css={{ margin: '1rem' }}>
      <AvatarDemo />
      <ButtonGroupDemo />
      <AlertDemo />
      <BadgeDemo />
      <ButtonDemo />
      <PopperDemo />
    </div>
  );
};

export default App;
