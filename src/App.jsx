import { css } from 'styled-components/macro';
import { BadgeDemo, ButtonDemo, PopperDemo } from '@components';

const App = () => {
  return (
    <div css={{ margin: '1rem' }}>
      <BadgeDemo />
      <ButtonDemo />
      <PopperDemo />
    </div>
  );
};

export default App;
