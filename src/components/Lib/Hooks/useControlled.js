import * as React from 'react';

export function useControlled({ controlled, default: defaultProp, name, state = 'value' }) {
  const { current: isControlled } = React.useRef(controlled !== undefined);
  const [valueState, setValue] = React.useState(defaultProp);
  const value = isControlled ? controlled : valueState;

  if (!import.meta.env.PROD) {
    React.useEffect(() => {
      if (isControlled !== (controlled !== undefined)) {
        console.error(
          `MUI: A component is changing the ${isControlled ? '' : 'un'}controlled
          ${state} state of ${name} to be ${isControlled ? 'un' : ''}controlled.
          Elements should not switch from uncontrolled to controlled (or vice versa).
          Decide between using a controlled or uncontrolled ${name} element for the lifetime of the component.`
        );
      }
    }, [state, name, controlled]);

    const { current: defaultValue } = React.useRef(defaultProp);

    React.useEffect(() => {
      if (!isControlled && defaultValue !== defaultProp) {
        console.error(
          `A component is changing the default ${state} state of an uncontrolled ${name} after being initialized.
          To suppress this warning opt to use a controlled ${name}.`
        );
      }
    }, [JSON.stringify(defaultProp)]);
  }

  const setValueIfUncontrolled = React.useCallback((newValue) => {
    if (!isControlled) {
      setValue(newValue);
    }
  }, []);

  return [value, setValueIfUncontrolled];
}
