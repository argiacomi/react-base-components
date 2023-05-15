// Defines different easing functions using cubic bezier curves and the standard linear function.
export const easings = {
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  linear: 'linear',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
};

//Defines a set of predefined duration values for transitions, in milliseconds.
export const durations = {
  duration0: 0,
  duration25: 25,
  duration50: 50,
  duration75: 75,
  duration100: 100,
  duration350: 350,
  duration400: 400,
  duration450: 450,
  duration500: 500,
  duration550: 550,
  duration600: 600,
  duration650: 650,
  duration700: 700,
  duration750: 750,
  duration800: 800,
  duration850: 850,
  duration900: 900,
  duration950: 950,
  duration1000: 1000,
  shortest: 150,
  leavingScreen: 195,
  shorter: 200,
  enteringScreen: 225,
  short: 250,
  standard: 300,
  complex: 375
};

// Takes a number of milliseconds and returns it formatted as a string with the "ms" suffix.
function formatMs(milliseconds) {
  return `${Math.round(milliseconds)}ms`;
}

// Calculates a duration based on a provided height value (in pixels), useful for transitions involving height changes.
function getAutoHeightDuration(height) {
  if (!height) {
    return 0;
  }

  const constant = height / 36;

  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
}

// Creates transition strings for CSS transition properties.
export function createTransitions(props = ['all'], options = {}) {
  const {
    duration: durationOption = durations.standard,
    easing: easingOption = easings.easeInOut,
    delay = 0,
    ...other
  } = options;

  if (process.env.NODE_ENV !== 'production') {
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
    checkArgumentType(
      easingOption,
      'easing',
      isString,
      'Argument "easing" must be a string.'
    );
    checkArgumentType(
      delay,
      'delay',
      isNumber,
      'Argument "delay" must be a number or a string.'
    );

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
          typeof durationOption === 'string'
            ? durationOption
            : formatMs(durationOption)
        } ${easingOption} ${
          typeof delay === 'string' ? delay : formatMs(delay)
        }`
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
