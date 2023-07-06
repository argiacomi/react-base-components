import { default as scStyled, useTheme as useStyledTheme } from 'styled-components/macro';
import cssProperties from './cssProperties';

export const shouldForwardProp = (prop) => {
  return !['as', 'classes', 'item', 'ownerState', 'ref', 'sx', 'theme'].includes(prop);
};

const styled = (component, configProp) => {
  const { shouldForwardProp: customforwardProp, ...otherAttrs } = configProp || {};

  return scStyled(component)
    .withConfig({
      shouldForwardProp: customforwardProp ?? shouldForwardProp
    })
    .attrs(otherAttrs);
};

export default styled;

export const useTheme = () => {
  return useStyledTheme();
};

//--- Styling Extraction Helper Functions ---//

function checkOverlap(arr1, arr2) {
  return arr1.some((item) => arr2.includes(item));
}

function isObject(value) {
  return typeof value === 'object' && value !== null;
}

function getCustomSpacing(key, style, theme) {
  let updatedStyleObject = {};

  cssProperties.customSpacing[key].forEach((cssProperty) => {
    updatedStyleObject[cssProperty] = typeof style === 'string' ? style : theme.spacing(style);
  });

  return updatedStyleObject;
}

function widthTransform(value, theme) {
  if (typeof value === 'string') {
    return value.search('rem') ? value : theme.pxToRem(value);
  } else {
    return theme.spacing(value / 8);
  }
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
        cssStyles = { ...sxStyles.cssStyles, ...cssStyles };
        break;
      case key === 'fontSize':
        cssStyles[key] = theme.text.size[props[key]] || props[key];
        break;
      case key === 'fontWeight':
        cssStyles[key] = theme.text.weight[props[key]] || props[key];
        break;
      case cssProperties.color.includes(key):
        cssStyles[key] = theme.alpha.getColorFromPath(theme, props[key]) || props[key];
        break;
      case cssProperties.border.includes(key):
        cssStyles[key] = `${widthTransform(props[key], theme)} solid currentColor`;
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
        cssStyles = { ...cssStyles, ...getCustomSpacing(key, props[key], theme) };
        break;
      case isObject(props[key]) && checkOverlap(Object.keys(props[key]), theme.breakpoints.keys):
        // eslint-disable-next-line no-case-declarations
        let breakpointObj = props[key];
        for (let breakpointKey in breakpointObj) {
          if (!cssStyles[`${theme.breakpoints.up(breakpointKey)}`]) {
            cssStyles[`${theme.breakpoints.up(breakpointKey)}`] = {};
          }
          cssStyles[`${theme.breakpoints.up(breakpointKey)}`][key] = breakpointObj[breakpointKey];
        }
        break;
      case cssProperties.special.some((char) => key.includes(char)):
        sxStyles = extractStyling(props[key]);
        cssStyles[key] = sxStyles.cssStyles;
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
