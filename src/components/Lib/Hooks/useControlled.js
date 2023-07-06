import React from 'react';

export function useControlled({ controlled, default: defaultProp, name, state = 'value' }) {
  const { current: isControlled } = React.useRef(controlled !== undefined);
  const [valueState, setValue] = React.useState(defaultProp);
  const value = isControlled ? controlled : valueState;

  if (!import.meta.env.PROD) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      if (isControlled !== (controlled !== undefined)) {
        console.error(
          `A component is changing the ${isControlled ? '' : 'un'}controlled
          ${state} state of ${name} to be ${isControlled ? 'un' : ''}controlled.
          Elements should not switch from uncontrolled to controlled (or vice versa).
          Decide between using a controlled or uncontrolled ${name} element for the lifetime of the component.`
        );
      }
    }, [state, name, controlled, isControlled]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { current: defaultValue } = React.useRef(defaultProp);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      if (!isControlled && defaultValue !== defaultProp) {
        console.error(
          `A component is changing the default ${state} state of an uncontrolled ${name} after being initialized.
          To suppress this warning opt to use a controlled ${name}.`
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defaultProp)]);
  }

  const setValueIfUncontrolled = React.useCallback((newValue) => {
    if (!isControlled) {
      setValue(newValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [value, setValueIfUncontrolled];
}
