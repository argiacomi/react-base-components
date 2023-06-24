import { default as scStyled, useTheme as useStyledTheme } from 'styled-components/macro';
import isPropValid from '@emotion/is-prop-valid';
import cssProperties from './cssProperties';

export const shouldForwardProp = (prop) => {
  if (import.meta.env.PROD) {
    return isPropValid(prop);
  }

  return !['as', 'ownerState', 'ref', 'theme'].includes(prop);
};

const styled = (component) =>
  scStyled(component).withConfig({ shouldForwardProp: shouldForwardProp });

export default styled;

export const useTheme = () => {
  return useStyledTheme();
};

//--- Styling Extraction Helper Functions ---//

function getColorFromPath(obj, path) {
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

function getCustomSpacing(styleObject, theme) {
  let updatedStyleObject = {};

  for (let key in styleObject) {
    if (cssProperties.customSpacing.hasOwnProperty(key)) {
      cssProperties.customSpacing[key].forEach((cssProperty) => {
        updatedStyleObject[cssProperty] =
          typeof styleObject[key] === 'string' ? styleObject[key] : theme.spacing(styleObject[key]);
      });
    }
  }

  return updatedStyleObject;
}

function sizeTransform(value) {
  return value <= 1 && value !== 0 ? `${value * 100}%` : value;
}

//--- Styling Extractor Utility ---//
export const extractStyling = (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const theme = useTheme();
  let sxStyles = {};
  let cssStyles = {};
  const other = {};

  Object.keys(props).forEach((key) => {
    switch (true) {
      case key === 'sx':
        sxStyles = extractStyling(props[key]);
        break;
      case key === 'fontSize':
        cssStyles[key] = theme.text.size[props[key]] || props[key];
        break;
      case key === 'fontWeight':
        cssStyles[key] = theme.text.weight[props[key]] || props[key];
        break;
      case cssProperties.color.includes(key):
        cssStyles[key] = getColorFromPath(theme.color, props[key]) || props[key];
        break;
      case cssProperties.borderRadius.includes(key):
        cssStyles[key] = theme.rounded[props[key]] || props[key];
        break;
      case cssProperties.sizing.includes(key):
        cssStyles[key] = sizeTransform(props[key]);
        break;
      case cssProperties.spacing.includes(key):
        cssStyles[key] = typeof props[key] === 'string' ? props[key] : theme.spacing(props[key]);
        break;
      case Object.keys(cssProperties.customSpacing).includes(key):
        cssStyles = { ...cssStyles, ...getCustomSpacing(props, theme) };
        break;
      case cssProperties.other.includes(key):
        cssStyles[key] = props[key];
        break;
      default:
        other[key] = props[key];
    }
  });

  cssStyles = { ...sxStyles.cssStyles, ...cssStyles };

  return { cssStyles, other };
};
