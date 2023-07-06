import React from 'react';
import FormGroup from '../Form/FormGroup';
import { useControlled, useForkRef, useId } from '@components/lib';
import RadioGroupContext from './RadioGroupContext';

const RadioGroup = React.forwardRef((props, ref) => {
  const {
    actions,
    children,
    defaultValue,
    name: nameProp,
    onChange,
    value: valueProp,
    ...other
  } = props;

  const rootRef = React.useRef(null);

  const [value, setValueState] = useControlled({
    controlled: valueProp,
    default: defaultValue,
    name: 'RadioGroup'
  });

  React.useImperativeHandle(
    actions,
    () => ({
      focus: () => {
        let input = rootRef.current.querySelector('input:not(:disabled):checked');

        if (!input) {
          input = rootRef.current.querySelector('input:not(:disabled)');
        }

        if (input) {
          input.focus();
        }
      }
    }),
    []
  );

  const handleRef = useForkRef(ref, rootRef);

  const name = useId(nameProp);

  const contextValue = React.useMemo(
    () => ({
      name,
      onChange(event) {
        setValueState(event.target.value);

        if (onChange) {
          onChange(event, event.target.value);
        }
      },
      value
    }),
    [name, onChange, setValueState, value]
  );

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <FormGroup role='radiogroup' ref={handleRef} {...other}>
        {children}
      </FormGroup>
    </RadioGroupContext.Provider>
  );
});

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
