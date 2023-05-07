import { useCallback, useEffect, useRef, useState } from 'react';

function useControlled({
  controlled,
  default: defaultProp,
  name,
  state = 'value'
}) {
  const isControlledRef = useRef(controlled !== undefined);
  const [valueState, setValue] = useState(defaultProp);
  const value = isControlledRef.current ? controlled : valueState;

  const logError = (message) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(message);
    }
  };

  useEffect(() => {
    if (isControlledRef.current !== (controlled !== undefined)) {
      logError(
        [
          `A component is changing the ${!isControlledRef.current && 'un'}
          controlled ${state} state of ${name} to be ${
            isControlledRef.current && 'un'
          } controlled.`,
          'Elements should not switch from uncontrolled to controlled (or vice versa).',
          `Decide between using a controlled or uncontrolled ${name} ` +
            'element for the lifetime of the component.',
          "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
          'More info: https://fb.me/react-controlled-components'
        ].join('\n')
      );
    }
  }, [state, name, controlled]);

  const defaultValueRef = useRef(defaultProp);

  useEffect(() => {
    if (!isControlledRef.current && defaultValueRef.current !== defaultProp) {
      logError(
        [
          `A component is changing the default ${state} state of an uncontrolled ${name} after being initialized. ` +
            `To suppress this warning opt to use a controlled ${name}.`
        ].join('\n')
      );
    }
  }, [JSON.stringify(defaultProp)]);

  const setValueIfUncontrolled = useCallback((newValue) => {
    if (!isControlledRef.current) {
      setValue(newValue);
    }
  }, []);

  return [value, setValueIfUncontrolled];
}

export { useControlled };
