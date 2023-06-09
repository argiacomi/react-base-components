import { baseTheme as theme } from '@styles';
// Takes a number of milliseconds and returns it formatted as a string with the "ms" suffix.
function formatMs(milliseconds) {
  return `${Math.round(milliseconds)}ms`;
}

// Calculates a duration based on a provided height value (in pixels), useful for transitions involving height changes.
export function getAutoHeightDuration(timeout, wrapperSize) {
  if (timeout !== 'auto' || !wrapperSize) {
    return 0;
  }
  return Math.round((4 + 15 * (wrapperSize / 36) ** 0.25 + wrapperSize / 36 / 5) * 10);
}

// Creates transition strings for CSS transition properties.
export function createTransitions(props = ['all'], options = {}) {
  const {
    duration: durationOption = theme.transition.duration.standard,
    easing: easingOption = theme.transition.easing.easeInOut,
    delay = 0,
    ...other
  } = options;

  if (!import.meta.env.PROD) {
    const isString = (value) => typeof value === 'string';
    const isNumber = (value) => !isNaN(parseFloat(value));

    const checkArgumentType = (arg, argName, typeFn, errorMessage) => {
      if (!typeFn(arg)) {
        console.error(errorMessage);
      }
    };

    checkArgumentType(
      props,
      'props',
      (value) => isString(value) || Array.isArray(value),
      'Argument "props" must be a string or Array.'
    );
    checkArgumentType(
      durationOption,
      'duration',
      isNumber,
      `Argument "duration" must be a number or a string but found ${durationOption}.`
    );
    checkArgumentType(easingOption, 'easing', isString, 'Argument "easing" must be a string.');
    checkArgumentType(delay, 'delay', isNumber, 'Argument "delay" must be a number or a string.');

    const checkUnrecognizedArgs = (args) => {
      const keys = Object.keys(args);
      if (keys.length !== 0) {
        console.error(`Unrecognized argument(s) [${keys.join(',')}].`);
      }
    };
    checkUnrecognizedArgs(other);
  }

  return (Array.isArray(props) ? props : [props])
    .map(
      (animatedProp) =>
        `${animatedProp} ${
          typeof durationOption === 'string' ? durationOption : formatMs(durationOption)
        } ${easingOption} ${typeof delay === 'string' ? delay : formatMs(delay)}`
    )
    .join(',');
}

//Returns an object containing transition properties – duration, easing, and delay – from the given input parameters.
export function getTransitionProps({ timeout, easing, style = {} }, options) {
  return {
    duration:
      style.transitionDuration ??
      (typeof timeout === 'number' ? timeout : timeout[options.mode] || 0),
    easing:
      style.transitionTimingFunction ??
      (typeof easing === 'object' ? easing[options.mode] : easing),
    delay: style.transitionDelay
  };
}

// Triggers a reflow on the passed Dom node by accessing its scrollTop property.
export const reflow = (node) => node.scrollTop;

export function debounce(func, wait = 166) {
  let timeout;
  function debounced(...args) {
    const later = () => {
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  }
  debounced.clear = () => {
    clearTimeout(timeout);
  };
  return debounced;
}
