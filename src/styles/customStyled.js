import { default as scStyled } from 'styled-components/macro';

const styled = (component) =>
  scStyled(component).withConfig({
    shouldForwardProp: (prop) => !['ownerState'].includes(prop)
  });

export default styled;
