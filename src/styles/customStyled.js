import { default as scStyled, useTheme as useStyledTheme } from 'styled-components/macro';

export const styled = (component) =>
  scStyled(component).withConfig({
    shouldForwardProp: (prop) => !['ownerState', 'theme', 'as'].includes(prop)
  });

export const useTheme = () => {
  return useStyledTheme();
};
