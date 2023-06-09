import { css } from 'styled-components/macro';
import { AlertDemo, BadgeDemo, ButtonDemo, PopperDemo } from '@components';

const App = () => {
  return (
    <div css={{ margin: '1rem' }}>
      <AlertDemo />
      <BadgeDemo />
      <ButtonDemo />
      <PopperDemo />
    </div>
  );
};

export default App;
