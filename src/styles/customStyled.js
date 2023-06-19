import {
  default as scStyled,
  useTheme as useStyledTheme,
  css as styledCss
} from 'styled-components/macro';

export const styled = (component) =>
  scStyled(component).withConfig({
    shouldForwardProp: (prop) => !['as', 'css', 'ownerState', 'theme'].includes(prop)
  });

export const useTheme = () => {
  return useStyledTheme();
};

export const css = () => {
  return styledCss;
};
