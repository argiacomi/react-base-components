import { default as scStyled, useTheme as useStyledTheme } from 'styled-components/macro';
import cssProperties from './cssProperties';

export const styled = (component) =>
  scStyled(component).withConfig({
    shouldForwardProp: (prop) => !['as', 'css', 'ownerState', 'theme'].includes(prop)
  });

export const useTheme = () => {
  return useStyledTheme();
};

function getValueFromPath(obj, path) {
  const parts = path.split('.');
  let currentPart = obj;

  for (const part of parts) {
    if (currentPart[part] !== undefined) {
      currentPart = currentPart[part];
    } else {
      return undefined;
    }
  }

  return currentPart;
}

export const extractStyling = (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const theme = useTheme();
  const cssStyles = {};
  const other = {};

  Object.keys(props).forEach((key) => {
    switch (true) {
      case key === 'fontSize':
        cssStyles[key] = theme.text.size[props[key]] || props[key];
        break;
      case key === 'fontWeight':
        cssStyles[key] = theme.text.weight[props[key]] || props[key];
        break;
      case cssProperties.color.includes(key):
        cssStyles[key] = getValueFromPath(theme.color, props[key]) || props[key];
        break;
      case cssProperties.borderRadius.includes(key):
        cssStyles[key] = theme.rounded[props[key]] || props[key];
        break;
      case cssProperties.other.includes(key):
        cssStyles[key] = props[key];
        break;
      default:
        other[key] = props[key];
    }
  });

  return { cssStyles, other };
};
